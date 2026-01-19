import { Hono } from 'hono';
import { eq, desc, inArray, sql } from 'drizzle-orm';
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

  // Calculate stats for the current month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  
  const paidThisMonthRes = await db.select({ total: sql`sum(${payroll.amount})` })
    .from(payroll)
    .where(sql`${payroll.date} >= ${firstDay}`)
    .execute();

  const totalObligationRes = await db.select({ total: sql`sum(${staff.salary})` })
    .from(staff)
    .where(eq(staff.status, 'active'))
    .execute();

  const stats = {
    totalPaidMonth: paidThisMonthRes[0]?.total || 0,
    totalMonthlyObligation: totalObligationRes[0]?.total || 0,
    pending: (totalObligationRes[0]?.total || 0) - (paidThisMonthRes[0]?.total || 0)
  };

  return c.html(<PayrollPage history={enrichedHistory} stats={stats} />);
});

// 2. Full-Page Payroll Wizard
app.get('/run', async (c) => {
  const db = c.get('db');
  
  const allAssociations = await db.select().from(associations).execute();
  const assocMap = new Map(allAssociations.map(a => [a.id, a]));

  const staffRaw = await db.select().from(staff).where(eq(staff.status, 'active')).execute();
  
  const staffWithUnit = staffRaw.map(s => ({
    ...s,
    unitName: assocMap.get(s.associationId)?.name || 'Unknown Unit',
    unitType: assocMap.get(s.associationId)?.type || 'project'
  }));
  
  return c.html(<RunPage staffList={staffWithUnit} />);
});

// 3. Execute Run
app.post('/run', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody({ all: true }); 
  const date = body.date || new Date().toISOString().split('T')[0];
  
  let staffIdsToProcess = [];
  if (typeof body.staffIds === 'string') staffIdsToProcess = [body.staffIds];
  else if (Array.isArray(body.staffIds)) staffIdsToProcess = [...new Set(body.staffIds)];
  
  if (staffIdsToProcess.length === 0) return c.redirect('/dashboard/payroll');
  
  const allStaff = await db.select().from(staff).execute();
  const staffMap = new Map(allStaff.map(s => [s.id, s]));
  
  await Promise.all(staffIdsToProcess.map(async (id) => {
    const amount = parseInt(body[`amount_${id}`]) || 0;
    const employee = staffMap.get(id);
    if (!employee || amount <= 0) return;
    
    const txnId = `txn_pay_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const payId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    const isPartial = amount < (employee.salary || 0);
    const description = isPartial ? `Partial Salary: ${employee.fullName}` : `Salary Payment: ${employee.fullName}`;
    
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
  
  c.header('HX-Trigger', JSON.stringify({ showMessage: { message: `Payroll processed for ${staffIdsToProcess.length} employees!`, type: 'success' } }));
  
  // Re-fetch data for full page response if using HTMX hx-target="body"
  const history = await db.select().from(payroll).orderBy(desc(payroll.date)).limit(50).execute();
  // ... (simplified enrichment for response)
  return c.redirect('/dashboard/payroll');
});

export default app;
