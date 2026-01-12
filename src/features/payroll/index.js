import { Hono } from 'hono';
import { eq, desc, inArray } from 'drizzle-orm';
import { payroll, staff, transactions, associations } from '../../db/schema';
import PayrollPage from './Page';
import RunPage from './RunPage';

const app = new Hono();

// 1. List History
app.get('/', async (c) => {
  const db = c.get('db');
  
  const history = await db.select()
    .from(payroll)
    .orderBy(desc(payroll.date))
    .limit(50)
    .execute();
    
  let enrichedHistory = [];
  
  if (history.length > 0) {
    const staffIds = [...new Set(history.map(p => p.staffId))];
    const txnIds = [...new Set(history.map(p => p.transactionId))];
    
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

// 2. Full-Page Payroll Wizard
app.get('/run', async (c) => {
  const db = c.get('db');
  
  // Fetch active staff with their unit names
  const allAssociations = await db.select().from(associations).execute();
  const assocMap = new Map(allAssociations.map(a => [a.id, a]));

  const staffRaw = await db.select().from(staff).where(eq(staff.status, 'active')).execute();
  
  const staffWithUnit = staffRaw.map(s => ({
    ...s,
    unitName: assocMap.get(s.associationId)?.name || 'Unknown Unit'
  }));
  
  return c.html(<RunPage staffList={staffWithUnit} />);
});

// 3. Execute Run
app.post('/run', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody({ all: true }); 
  const date = body.date || new Date().toISOString().split('T')[0];
  
  let staffIdsToProcess = [];
  if (typeof body.staffIds === 'string') {
    staffIdsToProcess = [body.staffIds];
  } else if (Array.isArray(body.staffIds)) {
    staffIdsToProcess = [...new Set(body.staffIds)]; // Ensure uniqueness
  } else {
    staffIdsToProcess = []; 
  }
  
  if (staffIdsToProcess.length === 0) {
    return c.redirect('/dashboard/payroll');
  }
  
  const allStaff = await db.select().from(staff).execute();
  const staffMap = new Map(allStaff.map(s => [s.id, s]));
  
  await Promise.all(staffIdsToProcess.map(async (id) => {
    // Fetch specific amount for this staff ID from the body
    // Hono parseBody puts it in body[`amount_${id}`]
    // Since we used { all: true }, it might be an array if multiple inputs had same name (unlikely here) or string
    const rawAmount = body[`amount_${id}`];
    const amountVal = Array.isArray(rawAmount) ? rawAmount[0] : rawAmount;
    const amount = parseInt(amountVal) || 0; // Fallback to 0 if NaN

    const employee = staffMap.get(id);
    
    if (!employee || amount <= 0) return;
    
    const txnId = `txn_pay_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const payId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    const isPartial = amount < (employee.salary || 0);
    const description = isPartial 
      ? `Partial Salary: ${employee.fullName}` 
      : `Salary Payment: ${employee.fullName}`;
    
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
