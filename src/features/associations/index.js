import { Hono } from 'hono';
import { eq, sql, desc } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { associations, transactions, staff } from '../../db/schema';
import AssociationsList from './Page';
import AssociationDetail from './Detail';
import NewForm from './NewForm';
import NewTransactionForm from '../transactions/NewForm';
import { roleGuard } from '../auth/middleware';
import { createAssociationSchema } from './validation';

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
app.post('/', 
  roleGuard(['super_admin', 'admin', 'manager']), 
  zValidator('form', createAssociationSchema, (result, c) => {
    if (!result.success) {
      return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
    }
  }),
  async (c) => {
    const db = c.get('db');
    const body = c.req.valid('form');
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
  }
);

// 4. Detail View
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  
  const assoc = await db.select().from(associations).where(eq(associations.id, id)).get();
  if (!assoc) return c.text('Association not found', 404);
  
  // Dates for Monthly P&L (Current Month)
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  // 1. Calculate Totals (All Time)
  const incomeRes = await db.select({ total: sql`sum(${transactions.amount})` })
    .from(transactions)
    .where(sql`${transactions.associationId} = ${id} AND ${transactions.type} = 'income'`)
    .execute();
    
  const expenseRes = await db.select({ total: sql`sum(${transactions.amount})` })
    .from(transactions)
    .where(sql`${transactions.associationId} = ${id} AND ${transactions.type} = 'expense'`)
    .execute();

  // 2. Calculate Totals (This Month)
  const monthIncomeRes = await db.select({ total: sql`sum(${transactions.amount})` })
    .from(transactions)
    .where(sql`${transactions.associationId} = ${id} AND ${transactions.type} = 'income' AND ${transactions.date} >= ${firstDay} AND ${transactions.date} <= ${lastDay}`)
    .execute();

  const monthExpenseRes = await db.select({ total: sql`sum(${transactions.amount})` })
    .from(transactions)
    .where(sql`${transactions.associationId} = ${id} AND ${transactions.type} = 'expense' AND ${transactions.date} >= ${firstDay} AND ${transactions.date} <= ${lastDay}`)
    .execute();

  const countRes = await db.select({ count: sql`count(*)` })
    .from(transactions)
    .where(eq(transactions.associationId, id))
    .execute();

  const totalIncome = incomeRes[0].total || 0;
  const totalExpense = expenseRes[0].total || 0;
  
  const monthIncome = monthIncomeRes[0].total || 0;
  const monthExpense = monthExpenseRes[0].total || 0;
  
  const stats = {
    totalIncome,
    totalExpense,
    netPosition: totalIncome - totalExpense,
    thisMonthIncome: monthIncome,
    thisMonthExpense: monthExpense,
    thisMonthNet: monthIncome - monthExpense,
    totalTransactions: countRes[0].count || 0
  };

  // 3. Calculate 6-Month Trend
  const trendData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mStart = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
    const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
    const label = d.toLocaleString('default', { month: 'short' });

    const inc = await db.select({ total: sql`sum(${transactions.amount})` })
      .from(transactions)
      .where(sql`${transactions.associationId} = ${id} AND ${transactions.type} = 'income' AND ${transactions.date} >= ${mStart} AND ${transactions.date} <= ${mEnd}`)
      .execute();

    const exp = await db.select({ total: sql`sum(${transactions.amount})` })
      .from(transactions)
      .where(sql`${transactions.associationId} = ${id} AND ${transactions.type} = 'expense' AND ${transactions.date} >= ${mStart} AND ${transactions.date} <= ${mEnd}`)
      .execute();

    trendData.push({
      month: label,
      income: inc[0].total || 0,
      expense: exp[0].total || 0
    });
  }

  // Recent History
  const history = await db.select()
    .from(transactions)
    .where(eq(transactions.associationId, id))
    .orderBy(desc(transactions.date))
    .limit(15)
    .execute();
    
   const staffList = await db.select().from(staff).where(eq(staff.associationId, id)).execute();
   
   return c.html(<AssociationDetail association={assoc} transactions={history} staff={staffList} stats={stats} trendData={trendData} />);
});

export default app;