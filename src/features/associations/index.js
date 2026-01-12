import { Hono } from 'hono';
import { eq, sql, desc } from 'drizzle-orm';
import { associations, transactions, staff } from '../../db/schema';
import AssociationsList from './Page';
import AssociationDetail from './Detail';
import NewForm from './NewForm';
import NewTransactionForm from '../transactions/NewForm';
import { roleGuard } from '../auth/middleware';

const app = new Hono();

// 1. List Associations with Stats
app.get('/', async (c) => {
  const db = c.get('db');
  
  const allAssociations = await db.select().from(associations).execute();
  
  const enhancedList = await Promise.all(allAssociations.map(async (assoc) => {
    // Sum Income
    const incomeRes = await db.select({ total: sql`sum(${transactions.amount})` })
      .from(transactions)
      .where(sql`${transactions.associationId} = ${assoc.id} AND ${transactions.type} = 'income'`)
      .execute();
      
    // Sum Expense
    const expenseRes = await db.select({ total: sql`sum(${transactions.amount})` })
      .from(transactions)
      .where(sql`${transactions.associationId} = ${assoc.id} AND ${transactions.type} = 'expense'`)
      .execute();
      
    // Count Staff
    const staffRes = await db.select({ count: sql`count(*)` })
      .from(staff)
      .where(eq(staff.associationId, assoc.id))
      .execute();
      
    return {
      ...assoc,
      income: incomeRes[0].total || 0,
      expense: expenseRes[0].total || 0,
      staffCount: staffRes[0].count || 0,
    };
  }));

  return c.html(<AssociationsList associations={enhancedList} />);
});

// 2. New Form (Modal content)
app.get('/new', roleGuard(['super_admin', 'admin', 'manager']), (c) => {
  return c.html(<NewForm />);
});

// 3. Create Action
app.post('/', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  const id = `assoc_${Date.now()}`;
  
  try {
    await db.insert(associations).values({
      id,
      saccoId: 'sacco-01', // Defaulting for now
      name: body.name,
      type: body.type,
      status: 'active',
      createdAt: new Date().toISOString()
    }).execute();
    
    c.header('HX-Trigger', JSON.stringify({
      showMessage: {
        message: `Association '${body.name}' created successfully!`,
        type: 'success'
      },
      refreshList: true, // Custom event for list refresh
      closeModal: true
    }));
    return c.redirect('/dashboard/associations');
  } catch (error) {
    console.error("Error creating association:", error);
    c.header('HX-Trigger', JSON.stringify({
      showMessage: {
        message: `Error creating association: ${error.message}`,
        type: 'error'
      }
    }));
    return c.redirect('/dashboard/associations');
  }
});

// 4. Detail View
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  
  const assoc = await db.select().from(associations).where(eq(associations.id, id)).get();
  if (!assoc) return c.text('Association not found', 404);
  
  const history = await db.select()
    .from(transactions)
    .where(eq(transactions.associationId, id))
    .orderBy(desc(transactions.date))
    .limit(15)
    .execute();
    
   const staffList = await db.select().from(staff).where(eq(staff.associationId, id)).execute();
   
   return c.html(<AssociationDetail association={assoc} transactions={history} staff={staffList} />);
});

export default app;