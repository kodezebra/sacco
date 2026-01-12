import { Hono } from 'hono';
import { desc, eq } from 'drizzle-orm';
import { transactions, associations } from '../../db/schema';
import TransactionsPage from './Page';
import NewTransactionForm from './NewForm';
import { roleGuard } from '../auth/middleware';

const app = new Hono();

// 1. List Transactions
app.get('/', async (c) => {
  const db = c.get('db');
  const associationId = c.req.query('associationId');
  
  // Fetch Associations for mapping (N+1 avoidance)
  const allAssociations = await db.select().from(associations).execute();
  const assocMap = new Map(allAssociations.map(a => [a.id, a]));

  let query = db.select()
    .from(transactions)
    .orderBy(desc(transactions.date));

  if (associationId) {
    query = query.where(eq(transactions.associationId, associationId));
  }

  const allTransactions = await query.execute();
    
  const transactionsWithUnits = allTransactions.map(t => ({
    ...t,
    unitName: assocMap.get(t.associationId)?.name || 'Unknown Unit',
    unitType: assocMap.get(t.associationId)?.type || 'N/A'
  }));

  return c.html(<TransactionsPage transactions={transactionsWithUnits} />);
});

// 2. New Form
app.get('/new', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const associationId = c.req.query('associationId') || '';
  const initialType = c.req.query('type') || '';
  
  const activeAssociations = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
  return c.html(<NewTransactionForm associations={activeAssociations} selectedId={associationId} initialType={initialType} />);
});

// 3. Create Transaction
app.post('/', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  const id = `txn_${Date.now()}`;
  const isHTMX = body.is_htmx === 'true' || c.req.header('HX-Request') === 'true';
  
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
  
  if (isHTMX) {
    const activeAssociations = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
    
    c.header('HX-Trigger', JSON.stringify({
      showMessage: {
        message: `Transaction recorded successfully!`,
        type: 'success'
      },
      refreshTransactions: true
    }));

    // Return a fresh form (pre-filling the association if it was provided)
    return c.html(
      <NewTransactionForm 
        associations={activeAssociations} 
        selectedId={body.associationId} 
        initialType={body.type} 
      />
    );
  }
  
  return c.redirect('/dashboard/transactions');
});

export default app;