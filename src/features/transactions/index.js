import { Hono } from 'hono';
import { desc } from 'drizzle-orm';
import { transactions } from '../../db/schema';
import Page from './Page';

const app = new Hono();

app.get('/', async (c) => {
  const db = c.get('db');
  
  const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.date)).execute();

  return c.html(<Page transactions={allTransactions} />);
});

export default app;
