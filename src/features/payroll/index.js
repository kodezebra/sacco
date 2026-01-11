import { Hono } from 'hono';
import { eq, desc, inArray } from 'drizzle-orm';
import { payroll, staff, transactions } from '../../db/schema';
import PayrollPage from './Page';
import RunForm from './RunForm';

const app = new Hono();

// 1. List History
app.get('/', async (c) => {
  const db = c.get('db');
  
  // Fetch latest payroll entries
  const history = await db.select()
    .from(payroll)
    .orderBy(desc(payroll.date)) // timestamp would be better but date is text
    .limit(50)
    .execute();
    
  // Manual Join Logic
  let enrichedHistory = [];
  
  if (history.length > 0) {
    const staffIds = [...new Set(history.map(p => p.staffId))];
    const txnIds = [...new Set(history.map(p => p.transactionId))];
    
    // Fetch related entities
    // Note: Drizzle's inArray requires a non-empty array
    const staffList = staffIds.length ? await db.select().from(staff).where(inArray(staff.id, staffIds)).execute() : [];
    const txnList = txnIds.length ? await db.select().from(transactions).where(inArray(transactions.id, txnIds)).execute() : [];
    
    const staffMap = new Map(staffList.map(s => [s.id, s]));
    const txnMap = new Map(txnList.map(t => [t.id, t]));
    
    enrichedHistory = history.map(p => ({
      ...p,
      staffName: staffMap.get(p.staffId)?.fullName || 'Unknown Staff',
      role: staffMap.get(p.staffId)?.role || '-',
      txnDescription: txnMap.get(p.transactionId)?.description || '-',
    }));
  }

  return c.html(<PayrollPage history={enrichedHistory} />);
});

// 2. Form - Prepare Run
app.get('/run', async (c) => {
  const db = c.get('db');
  
  // Fetch active staff to populate the worksheet
  const activeStaff = await db.select().from(staff).where(eq(staff.status, 'active')).execute();
  
  return c.html(<RunForm staffList={activeStaff} />);
});

// 3. Execute Run
app.post('/run', async (c) => {
  const db = c.get('db');
  
  // { all: true } ensures we get arrays for fields with multiple values
  const body = await c.req.parseBody({ all: true }); 
  const date = body.date || new Date().toISOString().split('T')[0];
  
  // Ensure we handle both single entry (string) and multiple (array)
  const staffIds = Array.isArray(body.staffIds) ? body.staffIds : [body.staffIds].filter(Boolean);
  const amounts = Array.isArray(body.amounts) ? body.amounts : [body.amounts].filter(Boolean);
  // notes if added
  
  if (staffIds.length === 0) {
    return c.text('No staff selected', 400);
  }
  
  // Fetch staff details to get Association IDs (trusted source)
  // Optimization: Fetch all active staff to map
  const allStaff = await db.select().from(staff).execute();
  const staffMap = new Map(allStaff.map(s => [s.id, s]));
  
  await Promise.all(staffIds.map(async (id, index) => {
    const amount = parseInt(amounts[index]);
    const employee = staffMap.get(id);
    
    if (!employee || amount <= 0) return;
    
    const txnId = `txn_pay_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const payId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    // Determine description based on partial vs full
    const isPartial = amount < (employee.salary || 0);
    const description = isPartial 
      ? `Partial Salary: ${employee.fullName}` 
      : `Salary Payment: ${employee.fullName}`;
    
    // 1. Create Transaction (Expense)
    await db.insert(transactions).values({
      id: txnId,
      associationId: employee.associationId,
      type: 'expense',
      category: 'Payroll',
      amount: amount,
      description: description,
      date: date,
      createdAt: new Date().toISOString()
    }).execute();
    
    // 2. Create Payroll Record
    await db.insert(payroll).values({
      id: payId,
      staffId: employee.id,
      transactionId: txnId,
      amount: amount,
      date: date
    }).execute();
  }));
  
  return c.redirect('/dashboard/payroll');
});

export default app;