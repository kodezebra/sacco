import { Hono } from 'hono';
import { eq, desc, like, sql } from 'drizzle-orm';
import { shares, members, sacco } from '../../db/schema';
import Page, { SharesList } from './Page';
import PurchaseForm from './PurchaseForm';

const app = new Hono();

app.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search') || '';
  const page = parseInt(c.req.query('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;
  
  // Base query for data
  let query = db.select({
    id: shares.id,
    amount: shares.amount,
    date: shares.date,
    memberId: shares.memberId,
    memberName: members.fullName,
  })
  .from(shares)
  .leftJoin(members, eq(shares.memberId, members.id));

  // Base query for count
  let countQuery = db.select({ count: sql`count(*)` }).from(shares).leftJoin(members, eq(shares.memberId, members.id));

  if (search) {
    const searchPattern = `%${search}%`;
    const whereClause = like(members.fullName, searchPattern);
    query = query.where(whereClause);
    countQuery = countQuery.where(whereClause);
  }

  const allShares = await query.orderBy(desc(shares.date)).limit(limit).offset(offset).execute();
  const totalResult = await countQuery.execute();
  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / limit);

  // Calculate Stats
  const capitalResult = await db.select({ total: sql`sum(${shares.amount})` }).from(shares).execute();
  const shareholdersResult = await db.select({ count: sql`count(distinct ${shares.memberId})` }).from(shares).execute();
  const saccoSettings = await db.select().from(sacco).limit(1).execute();
  
  const stats = {
    totalCapital: capitalResult[0]?.total || 0,
    totalShareholders: shareholdersResult[0]?.count || 0,
    sharePrice: saccoSettings[0]?.sharePrice || 0
  };

  if (c.req.header('hx-request')) {
    return c.html(<SharesList shares={allShares} page={page} totalPages={totalPages} search={search} />);
  }

  return c.html(<Page shares={allShares} page={page} totalPages={totalPages} search={search} stats={stats} />);
});

app.get('/new', async (c) => {
  const db = c.get('db');
  const allMembers = await db.select().from(members).where(eq(members.status, 'active')).execute();
  const settings = await db.select().from(sacco).limit(1).execute();
  const price = settings[0]?.sharePrice || 20000;
  
  // Use PurchaseForm as a full page
  return c.html(<PurchaseForm members={allMembers} sharePrice={price} />);
});

app.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  
  if (!body.memberId || !body.amount || !body.date) {
    return c.text("Missing required fields", 400);
  }

  await db.insert(shares).values({
    id: `shr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    memberId: body.memberId,
    amount: parseFloat(body.amount),
    date: body.date,
    createdAt: new Date().toISOString()
  }).execute();

  // Set toast header
  c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Share purchase recorded successfully!", type: "success" } }));
  
  // Re-fetch data for the full page
  const search = '';
  const page = 1;
  const limit = 10;
  
  const allShares = await db.select({
    id: shares.id,
    amount: shares.amount,
    date: shares.date,
    memberId: shares.memberId,
    memberName: members.fullName,
  })
  .from(shares)
  .leftJoin(members, eq(shares.memberId, members.id))
  .orderBy(desc(shares.date))
  .limit(limit)
  .execute();
  
  const totalResult = await db.select({ count: sql`count(*)` }).from(shares).execute();
  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / limit);

  const capitalResult = await db.select({ total: sql`sum(${shares.amount})` }).from(shares).execute();
  const shareholdersResult = await db.select({ count: sql`count(distinct ${shares.memberId})` }).from(shares).execute();
  const saccoSettings = await db.select().from(sacco).limit(1).execute();
  
  const stats = {
    totalCapital: capitalResult[0]?.total || 0,
    totalShareholders: shareholdersResult[0]?.count || 0,
    sharePrice: saccoSettings[0]?.sharePrice || 0
  };

  return c.html(<Page shares={allShares} page={page} totalPages={totalPages} search={search} stats={stats} />);
});

export default app;
