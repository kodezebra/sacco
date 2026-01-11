import { Hono } from 'hono';
import { desc, eq } from 'drizzle-orm';
import { transactions, associations } from '../../db/schema';
import TransactionsPage from './Page';
import NewTransactionForm from './NewForm';

const app = new Hono();

// 1. List Transactions
app.get('/', async (c) => {
  const db = c.get('db');
  
  // Fetch Associations for mapping (N+1 avoidance)
  const allAssociations = await db.select().from(associations).execute();
  const assocMap = new Map(allAssociations.map(a => [a.id, a]));

  const allTransactions = await db.select()
    .from(transactions)
    .orderBy(desc(transactions.date)) // and createdAt
    .execute();
    
  const transactionsWithUnits = allTransactions.map(t => ({
    ...t,
    unitName: assocMap.get(t.associationId)?.name || 'Unknown Unit',
    unitType: assocMap.get(t.associationId)?.type || 'N/A'
  }));

  return c.html(<TransactionsPage transactions={transactionsWithUnits} />);
});

// 2. New Form
app.get('/new', async (c) => {
  const db = c.get('db');
  const activeAssociations = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
  return c.html(<NewTransactionForm associations={activeAssociations} />);
});

// 3. Create Transaction
app.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  const id = `txn_${Date.now()}`;
  
  await db.insert(transactions).values({
    id,
    associationId: body.associationId,
    type: body.type, // income | expense
    category: body.category,
    amount: parseInt(body.amount),
    description: body.description,
    date: body.date,
    createdAt: new Date().toISOString()
  }).execute();
  
  return c.redirect('/dashboard/transactions');
});

export default app;