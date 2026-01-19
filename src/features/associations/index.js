import { Hono } from 'hono';
import { eq, sql, desc, and } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { associations, transactions, staff } from '../../db/schema';
import AssociationsList from './Page';
import AssociationDetail, { AssociationProfileForm } from './Detail';
import NewForm from './NewForm';
import NewTransactionForm from '../transactions/NewForm';
import AssociationExportForm from './ExportForm';
import PerformanceReport from './PerformanceReport';
import { roleGuard } from '../auth/middleware';
import { createAssociationSchema, updateAssociationSchema } from './validation';

const app = new Hono();

// 1. List Associations with Stats
app.get('/', async (c) => {
  const db = c.get('db');
  
  const allAssociations = await db.select().from(associations).execute();
  
  let totalIncomeGlobal = 0;
  let totalExpenseGlobal = 0;

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
      
    const inc = incomeRes[0].total || 0;
    const exp = expenseRes[0].total || 0;
    totalIncomeGlobal += inc;
    totalExpenseGlobal += exp;

    return {
      ...assoc,
      income: inc,
      expense: exp,
      staffCount: staffRes[0].count || 0,
    };
  }));

  const globalStats = {
    totalUnits: allAssociations.length,
    netPosition: totalIncomeGlobal - totalExpenseGlobal,
    totalRevenue: totalIncomeGlobal
  };

  return c.html(<AssociationsList associations={enhancedList} stats={globalStats} />);
});

// 2. New Form (Full page)
app.get('/new', roleGuard(['super_admin', 'admin', 'manager']), (c) => {
  return c.html(<NewForm />);
});

// 3. Create Action
app.post('/', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  const result = createAssociationSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors = Object.keys(errors).reduce((acc, key) => {
      acc[key] = errors[key][0];
      return acc;
    }, {});
    return c.html(<NewForm errors={formattedErrors} values={body} />);
  }

  const data = result.data;
  const id = `assoc_${Date.now()}`;
  
  try {
    await db.insert(associations).values({
      id,
      saccoId: 'sacco-01',
      name: data.name,
      type: data.type,
      status: 'active',
      createdAt: data.createdAt || new Date().toISOString().split('T')[0]
    }).execute();
    
    c.header('HX-Trigger', JSON.stringify({ showMessage: { message: `Business unit "${data.name}" created successfully!`, type: 'success' } }));
    return c.redirect('/dashboard/associations');
  } catch (error) {
    console.error("Error creating association:", error);
    return c.html(<NewForm errors={{ general: error.message }} values={body} />);
  }
});

// 4. Export Page
app.get('/export-form', roleGuard(['super_admin', 'admin', 'manager']), zValidator('query', z.object({
  id: z.string()
})), async (c) => {
  const { id } = c.req.valid('query');
  const db = c.get('db');
  
  const assoc = await db.select().from(associations).where(eq(associations.id, id)).get();
  if (!assoc) return c.text('Association not found', 404);

  return c.html(<AssociationExportForm associationId={assoc.id} associationName={assoc.name} />);
});

// 5. Export CSV Action
app.get('/export', zValidator('query', z.object({
  id: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})), async (c) => {
  const { id, startDate, endDate } = c.req.valid('query');
  const db = c.get('db');

  const assoc = await db.select().from(associations).where(eq(associations.id, id)).get();
  if (!assoc) return c.text('Association not found', 404);

  const conditions = [eq(transactions.associationId, id)];
  if (startDate) conditions.push(sql`${transactions.date} >= ${startDate}`);
  if (endDate) conditions.push(sql`${transactions.date} <= ${endDate}`);
  
  const txs = await db.select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.date))
    .execute();

  // Generate CSV
  const headers = ['Transaction ID', 'Date', 'Type', 'Category', 'Amount', 'Description'];
  const rows = txs.map(t => [
    t.id,
    t.date,
    t.type,
    t.category,
    t.amount,
    `"${(t.description || '').replace(/"/g, '""')}"` // Escape quotes
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  return c.text(csvContent, 200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': `attachment; filename="ledger-${assoc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv"`,
  });
});

// 6. Performance Report (HTML/Print)
app.get('/report', zValidator('query', z.object({
  id: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})), async (c) => {
  const { id, startDate, endDate } = c.req.valid('query');
  const db = c.get('db');

  const assoc = await db.select().from(associations).where(eq(associations.id, id)).get();
  if (!assoc) return c.text('Association not found', 404);

  const conditions = [eq(transactions.associationId, id)];
  if (startDate) conditions.push(sql`${transactions.date} >= ${startDate}`);
  if (endDate) conditions.push(sql`${transactions.date} <= ${endDate}`);
  
  const txs = await db.select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.date))
    .execute();

  // Aggregate by Category
  const categoryMap = {};
  let totalIncome = 0;
  let totalExpense = 0;

  txs.forEach(t => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = { name: t.category, type: t.type, amount: 0, count: 0 };
    }
    categoryMap[t.category].amount += t.amount;
    categoryMap[t.category].count += 1;
    
    if (t.type === 'income') totalIncome += t.amount;
    else totalExpense += t.amount;
  });

  const staffRes = await db.select({ count: sql`count(*)` })
    .from(staff)
    .where(eq(staff.associationId, id))
    .execute();

  const stats = {
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    txCount: txs.length
  };

  return c.html(
    <PerformanceReport 
      association={assoc} 
      stats={stats} 
      categories={Object.values(categoryMap)}
      staffCount={staffRes[0].count || 0}
      period={{ start: startDate, end: endDate }}
    />
  );
});

// 7. Detail View
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

// 8. Update Action
app.put('/:id', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  const result = updateAssociationSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors = Object.keys(errors).reduce((acc, key) => {
      acc[key] = errors[key][0];
      return acc;
    }, {});
    
    const assoc = await db.select().from(associations).where(eq(associations.id, id)).get();
    return c.html(<AssociationProfileForm id="assoc-profile-form" association={{ ...assoc, ...body }} errors={formattedErrors} />);
  }

  const data = result.data;
  
  await db.update(associations)
    .set({
      name: data.name,
      type: data.type,
      status: data.status,
    })
    .where(eq(associations.id, id))
    .execute();

  const updatedAssoc = await db.select().from(associations).where(eq(associations.id, id)).get();

  return c.html(
    <>
      <AssociationProfileForm id="assoc-profile-form" association={updatedAssoc} />
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          const toastContainer = document.getElementById('htmx-toast-container');
          if (toastContainer) {
            const toast = document.createElement('div');
            toast.className = 'alert bg-success text-sm font-bold shadow-default rounded-sm text-white border-none py-3 px-6 z-[9999]';
            toast.innerHTML = '<span>Unit Updated Successfully</span>';
            toastContainer.appendChild(toast);
            setTimeout(() => { 
              toast.remove();
              window.location.reload(); 
            }, 1500); 
          }
        })();
      ` }} />
    </>
  );
});

// 9. Delete Action
app.delete('/:id', roleGuard(['super_admin', 'admin']), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  try {
    // Check if staff are still assigned
    const staffCount = await db.select({ count: sql`count(*)` }).from(staff).where(eq(staff.associationId, id)).get();
    if (staffCount.count > 0) {
      c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Cannot delete unit: Staff are still assigned. Please reassign them first.", type: 'error' } }));
      return c.status(400);
    }

    // Delete transactions first (or handle via FK constraints if configured, but let's be explicit)
    await db.delete(transactions).where(eq(transactions.associationId, id)).execute();
    
    // Delete association
    await db.delete(associations).where(eq(associations.id, id)).execute();

    c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Business unit deleted successfully.", type: 'success' } }));
    return c.redirect('/dashboard/associations');
  } catch (error) {
    console.error("Error deleting association:", error);
    c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Error deleting unit: " + error.message, type: 'error' } }));
    return c.status(500);
  }
});

export default app;
