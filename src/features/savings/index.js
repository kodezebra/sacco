import { Hono } from 'hono';
import { desc, eq, like, sql, or } from 'drizzle-orm';
import { savings, members } from '../../db/schema';
import Page, { SavingsList } from './Page';
import TransactionForm from './TransactionForm';

const app = new Hono();

app.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search') || '';
  const page = parseInt(c.req.query('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  let query = db.select({
    id: savings.id,
    amount: savings.amount,
    type: savings.type,
    date: savings.date,
    memberId: savings.memberId,
    memberName: members.fullName,
  })
  .from(savings)
  .leftJoin(members, eq(savings.memberId, members.id));

  let countQuery = db.select({ count: sql`count(*)` }).from(savings).leftJoin(members, eq(savings.memberId, members.id));

  if (search) {
    const searchPattern = `%${search}%`;
    const whereClause = or(
      like(members.fullName, searchPattern),
      like(savings.type, searchPattern)
    );
    query = query.where(whereClause);
    countQuery = countQuery.where(whereClause);
  }

  const allSavings = await query.orderBy(desc(savings.date)).limit(limit).offset(offset).execute();
  
  const totalResult = await countQuery.execute();
  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / limit);

  // Stats calculation
  const statsResult = await db.select({
    type: savings.type,
    total: sql`sum(${savings.amount})`
  }).from(savings).groupBy(savings.type).execute();

  const deposits = statsResult.find(r => r.type === 'deposit')?.total || 0;
  const withdrawals = statsResult.find(r => r.type === 'withdrawal')?.total || 0;

  const stats = {
    totalBalance: deposits - withdrawals,
    totalDeposits: deposits,
    totalWithdrawals: withdrawals
  };

  if (c.req.header('hx-request')) {
    return c.html(<SavingsList savings={allSavings} page={page} totalPages={totalPages} search={search} />);
  }

  return c.html(<Page savings={allSavings} page={page} totalPages={totalPages} search={search} stats={stats} />);
});

app.get('/new', async (c) => {
  const db = c.get('db');
  const allMembers = await db.select().from(members).where(eq(members.status, 'active')).execute();
  const type = c.req.query('type') || 'deposit';
  return c.html(<TransactionForm members={allMembers} initialType={type} />);
});

app.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  
  if (!body.memberId || !body.amount || !body.type || !body.date) {
    return c.text("Missing required fields", 400);
  }

  await db.insert(savings).values({
    id: `sav_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    memberId: body.memberId,
    type: body.type,
    amount: parseFloat(body.amount),
    date: body.date,
    createdAt: new Date().toISOString()
  }).execute();

  c.header('HX-Trigger', JSON.stringify({ 
    showMessage: { 
      message: `${body.type.charAt(0).toUpperCase() + body.type.slice(1)} recorded successfully!`, 
      type: "success" 
    } 
  }));

  // Re-fetch data for the full page
  const limit = 10;
  const allSavings = await db.select({
    id: savings.id,
    amount: savings.amount,
    type: savings.type,
    date: savings.date,
    memberId: savings.memberId,
    memberName: members.fullName,
  })
  .from(savings)
  .leftJoin(members, eq(savings.memberId, members.id))
  .orderBy(desc(savings.date))
  .limit(limit)
  .execute();
  
  const totalResult = await db.select({ count: sql`count(*)` }).from(savings).execute();
  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / limit);

  const statsResult = await db.select({
    type: savings.type,
    total: sql`sum(${savings.amount})`
  }).from(savings).groupBy(savings.type).execute();

  const deposits = statsResult.find(r => r.type === 'deposit')?.total || 0;
  const withdrawals = statsResult.find(r => r.type === 'withdrawal')?.total || 0;

  const stats = {
    totalBalance: deposits - withdrawals,
    totalDeposits: deposits,
    totalWithdrawals: withdrawals
  };

  return c.html(<Page savings={allSavings} page={1} totalPages={totalPages} search="" stats={stats} />);
});

export default app;
