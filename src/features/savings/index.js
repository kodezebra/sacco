import { Hono } from 'hono';
import { desc, eq, like, sql, or } from 'drizzle-orm';
import { savings, members } from '../../db/schema';
import Page, { SavingsList } from './Page';

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

  if (c.req.header('hx-request')) {
    return c.html(<SavingsList savings={allSavings} page={page} totalPages={totalPages} search={search} />);
  }

  return c.html(<Page savings={allSavings} page={page} totalPages={totalPages} search={search} />);
});

export default app;
