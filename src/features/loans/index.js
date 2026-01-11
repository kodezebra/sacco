import { Hono } from 'hono';
import { eq, desc, like, or, sql } from 'drizzle-orm';
import { loans, members } from '../../db/schema';
import Page, { LoansList } from './Page';

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
  let countQuery = db.select({ count: sql`count(*)` }).from(loans).leftJoin(members, eq(loans.memberId, members.id));

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
  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / limit);

  if (c.req.header('hx-request')) {
    return c.html(<LoansList loans={allLoans} page={page} totalPages={totalPages} search={search} />);
  }

  return c.html(<Page loans={allLoans} page={page} totalPages={totalPages} search={search} />);
});

export default app;