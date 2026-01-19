import { Hono } from 'hono';
import { eq, desc, like, or, sql, and, isNull, sum, count } from 'drizzle-orm';
import { loans, members, sacco } from '../../db/schema';
import Page, { LoansList } from './Page';
import LoanForm from './LoanForm';

const app = new Hono();

app.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search') || '';
  const page = parseInt(c.req.query('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;
  
  // Base query for data
  let query = db.select({
    id: loans.id,
    principal: loans.principal,
    status: loans.status,
    issuedDate: loans.issuedDate,
    interestRate: loans.interestRate,
    durationMonths: loans.durationMonths,
    memberId: loans.memberId,
    memberName: members.fullName,
  })
  .from(loans)
  .leftJoin(members, eq(loans.memberId, members.id));

  // Base query for count
  let countQuery = db.select({ total: count() }).from(loans).leftJoin(members, eq(loans.memberId, members.id));

  if (search) {
    const searchPattern = `%${search}%`;
    const whereClause = or(
      like(members.fullName, searchPattern),
      like(loans.id, searchPattern)
    );
    query = query.where(whereClause);
    countQuery = countQuery.where(whereClause);
  }

  const allLoans = await query.orderBy(desc(loans.issuedDate)).limit(limit).offset(offset).execute();
  const totalResult = await countQuery.execute();
  const totalCount = totalResult[0].total;
  const totalPages = Math.ceil(totalCount / limit);

  // Stats
  const activeStats = await db.select({
    activeCount: count(),
    activePrincipal: sum(loans.principal)
  }).from(loans).where(eq(loans.status, 'active')).execute();

  const totalLoansStats = await db.select({ total: count() }).from(loans).execute();

  const stats = {
    activePrincipal: Number(activeStats[0]?.activePrincipal || 0),
    activeCount: activeStats[0]?.activeCount || 0,
    totalLoans: totalLoansStats[0]?.total || 0
  };

  if (c.req.header('hx-request')) {
    return c.html(<LoansList loans={allLoans} page={page} totalPages={totalPages} search={search} />);
  }

  return c.html(<Page loans={allLoans} page={page} totalPages={totalPages} search={search} stats={stats} />);
});

app.get('/new', async (c) => {
  const db = c.get('db');
  
  // Eligible = Active status AND has no current active loans
  const eligibleMembers = await db.select({
    id: members.id,
    fullName: members.fullName,
    memberNumber: members.memberNumber
  })
  .from(members)
  .leftJoin(loans, and(
    eq(members.id, loans.memberId),
    eq(loans.status, 'active')
  ))
  .where(and(
    eq(members.status, 'active'),
    isNull(loans.id)
  ))
  .execute();

  const settings = await db.select().from(sacco).limit(1).execute();
  return c.html(<LoanForm members={eligibleMembers} settings={settings[0] || {}} />);
});

app.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  
  if (!body.memberId || !body.principal || !body.issuedDate) {
    return c.text("Missing required fields", 400);
  }

  await db.insert(loans).values({
    id: `loan_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    memberId: body.memberId,
    principal: parseInt(body.principal),
    interestRate: parseFloat(body.interestRate || 5.0),
    durationMonths: parseInt(body.durationMonths || 6),
    issuedDate: body.issuedDate,
    status: 'active',
    createdAt: new Date().toISOString()
  }).execute();

  c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Loan issued successfully!", type: "success" } }));
  
  // Re-fetch everything for full page response
  const allLoans = await db.select({
    id: loans.id,
    principal: loans.principal,
    status: loans.status,
    issuedDate: loans.issuedDate,
    interestRate: loans.interestRate,
    durationMonths: loans.durationMonths,
    memberId: loans.memberId,
    memberName: members.fullName,
  })
  .from(loans)
  .leftJoin(members, eq(loans.memberId, members.id))
  .orderBy(desc(loans.issuedDate))
  .limit(10)
  .execute();

  const activeStats = await db.select({
    activeCount: count(),
    activePrincipal: sum(loans.principal)
  }).from(loans).where(eq(loans.status, 'active')).execute();

  const totalLoansStats = await db.select({ total: count() }).from(loans).execute();

  const stats = {
    activePrincipal: Number(activeStats[0]?.activePrincipal || 0),
    activeCount: activeStats[0]?.activeCount || 0,
    totalLoans: totalLoansStats[0]?.total || 0
  };

  return c.html(<Page loans={allLoans} page={1} totalPages={1} search="" stats={stats} />);
});

export default app;