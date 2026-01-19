import { Hono } from 'hono';
import { desc, eq, and, sql, or, like } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { transactions, associations } from '../../db/schema';
import Page, { LedgerTable } from './Page';
import NewTransactionForm from './NewForm';
import JournalForm from './JournalForm';
import JournalPage from './JournalPage';
import { roleGuard } from '../auth/middleware';
import { createTransactionSchema } from './validation';

const app = new Hono();

// 1. List Transactions
app.get('/', async (c) => {
  const db = c.get('db');
  const associationId = c.req.query('associationId') || '';
  const type = c.req.query('type') || '';
  const search = c.req.query('search') || '';
  const page = parseInt(c.req.query('page') || '1');
  const limit = 15;
  const offset = (page - 1) * limit;

  const allAssociations = await db.select().from(associations).execute();
  const assocMap = new Map(allAssociations.map(a => [a.id, a]));

  let conditions = [];
  if (associationId) conditions.push(eq(transactions.associationId, associationId));
  if (type) conditions.push(eq(transactions.type, type));
  if (search) conditions.push(or(like(transactions.description, `%${search}%`), like(transactions.category, `%${search}%`)));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const allTransactions = await db.select()
    .from(transactions)
    .where(whereClause)
    .orderBy(desc(transactions.date))
    .limit(limit)
    .offset(offset)
    .execute();

  const countRes = await db.select({ count: sql`count(*)` })
    .from(transactions)
    .where(whereClause)
    .execute();

  const total = countRes[0].count;
  const totalPages = Math.ceil(total / limit);

  const transactionsWithUnits = allTransactions.map(t => ({
    ...t,
    unitName: assocMap.get(t.associationId)?.name || 'Unknown Unit'
  }));

  // Global Stats (unfiltered)
  const statsRes = await db.select({
    type: transactions.type,
    total: sql`sum(${transactions.amount})`
  }).from(transactions).groupBy(transactions.type).execute();

  const stats = {
    income: statsRes.find(r => r.type === 'income')?.total || 0,
    expense: statsRes.find(r => r.type === 'expense')?.total || 0,
  };

  const props = {
    transactions: transactionsWithUnits,
    associations: allAssociations,
    filters: { associationId, type, search },
    page,
    totalPages,
    stats
  };

  if (c.req.header('hx-request') && !c.req.header('hx-push-url')) {
    return c.html(<LedgerTable {...props} />);
  }

  return c.html(<Page {...props} />);
});

// 2. Journal Page (Full Screen)
app.get('/journal', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const associationId = c.req.query('associationId');
  if (!associationId) return c.redirect('/dashboard/associations');

  const assoc = await db.select().from(associations).where(eq(associations.id, associationId)).get();
  if (!assoc) return c.text('Association not found', 404);

  return c.html(<JournalPage associationId={assoc.id} associationName={assoc.name} />);
});

// 3. Journal Form (Modal Content)
app.get('/journal-form', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const associationId = c.req.query('associationId') || '';
  return c.html(<JournalForm associationId={associationId} />);
});

// 4. Journal Create Action
app.post('/journal', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  const items = [];
  const regex = /^items\[(\d+)\]\[(\w+)\]$/;
  
  for (const [key, value] of Object.entries(body)) {
    const match = key.match(regex);
    if (match) {
      const index = parseInt(match[1]);
      const field = match[2];
      if (!items[index]) items[index] = {};
      items[index][field] = value;
    }
  }

  const validItems = items.filter(item => item && item.amount && item.description && item.category && item.type);
  if (validItems.length === 0) return c.html(<JournalForm associationId={body.associationId} errors={{ general: "No items found" }} />);

  try {
    const ops = validItems.map(item => {
        return db.insert(transactions).values({
            id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            associationId: body.associationId,
            type: item.type,
            category: item.category,
            amount: parseInt(item.amount),
            description: item.description,
            date: body.date,
            createdAt: new Date().toISOString()
        }).execute();
    });
    await Promise.all(ops);

    c.header('HX-Trigger', JSON.stringify({ showMessage: { message: `Saved ${validItems.length} entries to unit journal!`, type: 'success' } }));
    return c.redirect(`/dashboard/associations/${body.associationId}`);
  } catch (e) {
    return c.html(<JournalForm associationId={body.associationId} errors={{ general: "Database error" }} />);
  }
});

// 5. Single Entry Routes
app.get('/new', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const associationId = c.req.query('associationId') || '';
  const activeAssociations = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
  return c.html(<NewTransactionForm associations={activeAssociations} selectedId={associationId} initialType={c.req.query('type') || 'income'} />);
});

app.post('/', 
  roleGuard(['super_admin', 'admin', 'manager']), 
  zValidator('form', createTransactionSchema, (result, c) => {
    if (!result.success) return c.text('Validation Error', 400);
  }),
  async (c) => {
    const db = c.get('db');
    const body = c.req.valid('form');
    await db.insert(transactions).values({
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      associationId: body.associationId,
      type: body.type,
      category: body.category,
      amount: body.amount,
      description: body.description,
      date: body.date,
      createdAt: new Date().toISOString()
    }).execute();

    c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Transaction recorded successfully!", type: 'success' } }));
    return c.redirect('/dashboard/transactions');
  }
);

export default app;