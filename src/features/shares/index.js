import { Hono } from 'hono';
import { eq, desc, like, sql } from 'drizzle-orm';
import { shares, members } from '../../db/schema';
import Page, { SharesList } from './Page';

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

  if (c.req.header('hx-request')) {
    return c.html(<SharesList shares={allShares} page={page} totalPages={totalPages} search={search} />);
  }

  return c.html(<Page shares={allShares} page={page} totalPages={totalPages} search={search} />);
});

export default app;
