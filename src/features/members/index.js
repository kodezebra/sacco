import { Hono } from 'hono';
import { like, or, eq, desc, sql, and } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { members, shares, savings, loans, loanPayments, transactions, sacco } from '../../db/schema';
import MembersPage, { MembersList, MemberRow } from './List';
import NewMemberForm from './NewForm';
import MemberDetailPage, { 
  MemberDetailStats, 
  MemberDetailProfileForm 
} from './Detail';
import MemberSavingsPage from './SavingsPage';
import MemberSharesPage from './SharesPage';
import MemberLoansPage from './LoansPage';
import { Toast } from '../../components/Toast';
import DepositForm from './DepositForm';
import LoanForm from './LoanForm';
import LoanRepaymentForm from './LoanRepaymentForm';
import SharePurchaseForm from './SharePurchaseForm';
import WithdrawForm from './WithdrawForm';
import MemberExportForm from './ExportForm';
import { roleGuard } from '../auth/middleware';
import { createMemberSchema, updateMemberSchema, memberTransactionSchema, memberLoanSchema } from './validation';

const app = new Hono();

// Helper to get members with pagination
const getMembers = async (db, search = '', page = 1, limit = 10, status = '') => {
  const offset = (page - 1) * limit;
  let conditions = [];

  if (search) {
    const searchPattern = `%${search}%`;
    conditions.push(or(like(members.fullName, searchPattern), like(members.phone, searchPattern), like(members.memberNumber, searchPattern)));
  }

  if (status) {
    conditions.push(eq(members.status, status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let query = db.select().from(members);
  let countQuery = db.select({ count: sql`count(*)` }).from(members);

  if (whereClause) {
    query = query.where(whereClause);
    countQuery = countQuery.where(whereClause);
  }

  const data = await query.orderBy(desc(members.createdAt)).limit(limit).offset(offset).execute();
  const totalResult = await countQuery.execute();
  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / limit);

  return { data, total, page, totalPages };
};

// Helper to calculate member stats correctly
const getMemberStats = async (db, memberId) => {
  const memberShares = await db.select().from(shares).where(eq(shares.memberId, memberId)).execute();
  const memberSavings = await db.select().from(savings).where(eq(savings.memberId, memberId)).execute();
  const memberLoans = await db.select().from(loans).where(eq(loans.memberId, memberId)).execute();
  
  const settingsResult = await db.select().from(sacco).limit(1).execute();
  const multiplier = settingsResult[0]?.loanMultiplier || 3.0;

  const loanIds = memberLoans.map(l => l.id);
  let allPayments = [];
  if (loanIds.length > 0) {
    allPayments = await db.select().from(loanPayments).execute();
    allPayments = allPayments.filter(p => loanIds.includes(p.loanId));
  }

  const totalShares = memberShares.reduce((acc, s) => acc + s.amount, 0);
  const savingsBalance = memberSavings.reduce((acc, s) => s.type === 'deposit' ? acc + s.amount : acc - s.amount, 0);
  
  let activeLoanTotal = 0;
  let loanPaidTotal = 0;

  const loanBalance = memberLoans.filter(l => l.status === 'active').reduce((acc, l) => {
    const totalInterest = l.principal * (l.interestRate / 100) * l.durationMonths;
    const totalDue = l.principal + totalInterest;
    const paidForThisLoan = allPayments.filter(p => p.loanId === l.id).reduce((sum, p) => sum + p.amount, 0);
    
    activeLoanTotal += totalDue;
    loanPaidTotal += paidForThisLoan;

    return acc + (totalDue - paidForThisLoan);
  }, 0);

  const loanLimit = loanBalance > 0 ? 0 : (savingsBalance + totalShares) * multiplier;
  const sharePrice = settingsResult[0]?.sharePrice || 20000;

  return { totalShares, savingsBalance, loanBalance, activeLoanTotal, loanPaidTotal, loanLimit, multiplier, sharePrice };
};

// GET / ... Main members list
app.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search') || '';
  const status = c.req.query('status') || '';
  const page = parseInt(c.req.query('page') || '1');
  const { data, totalPages } = await getMembers(db, search, page, 10, status);

  // Calculate Directory Stats
  const membersResult = await db.select({ count: sql`count(*)` }).from(members).execute();
  
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const newMembersRes = await db.select({ count: sql`count(*)` }).from(members).where(sql`${members.createdAt} >= ${firstDay}`).execute();

  const savingsDeposits = await db.select({ total: sql`sum(${savings.amount})` }).from(savings).where(eq(savings.type, 'deposit')).execute();
  const savingsWithdrawals = await db.select({ total: sql`sum(${savings.amount})` }).from(savings).where(eq(savings.type, 'withdrawal')).execute();
  const totalSavings = (savingsDeposits[0].total || 0) - (savingsWithdrawals[0].total || 0);

  const loansResult = await db.select({ total: sql`sum(${loans.principal})` }).from(loans).where(eq(loans.status, 'active')).execute();

  const directoryStats = {
    totalMembers: membersResult[0].count,
    newMembers: newMembersRes[0].count,
    totalSavings,
    totalLoans: loansResult[0].total || 0
  };

  if (c.req.header('hx-request')) {
    return c.html(<MembersList members={data} page={page} totalPages={totalPages} search={search} status={status} />);
  }
  return c.html(<MembersPage members={data} page={page} totalPages={totalPages} search={search} status={status} stats={directoryStats} />);
});

// GET /new ... Form for creating a new member (Full Page)
app.get('/new', async (c) => {
  const db = c.get('db');
  const settingsResult = await db.select().from(sacco).limit(1).execute();
  const settings = settingsResult[0] || {};
  return c.html(<NewMemberForm defaults={settings} />);
});

// POST / ... Create a new member
app.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  const result = createMemberSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors = Object.keys(errors).reduce((acc, key) => {
      acc[key] = errors[key][0];
      return acc;
    }, {});
    
    const settingsResult = await db.select().from(sacco).limit(1).execute();
    const settings = settingsResult[0] || {};
    return c.html(<NewMemberForm errors={formattedErrors} values={body} defaults={settings} />);
  }

  const data = result.data;
  const memberId = `mbr_${Math.random().toString(36).substring(2, 9)}`;
  const newMember = {
    id: memberId,
    saccoId: 'sacco-01',
    fullName: data.fullName,
    phone: data.phone,
    address: data.address,
    nextOfKinName: data.nextOfKinName,
    nextOfKinPhone: data.nextOfKinPhone,
    createdAt: data.createdAt || new Date().toISOString().split('T')[0],
    status: 'active',
    memberNumber: `MBR${Math.floor(1000 + Math.random() * 9000)}`,
  };
  
  await db.insert(members).values(newMember).execute();
  
  c.header('HX-Trigger', JSON.stringify({ showMessage: { message: `Member "${data.fullName}" registered successfully!`, type: 'success' } }));
  return c.redirect('/dashboard/members');
});

// GET /export-form ... Serve the export options form
app.get('/export-form', (c) => {
  return c.html(<MemberExportForm />);
});

// GET /export ... CSV export with optional date filtering
app.get('/export', roleGuard(['super_admin', 'admin', 'manager', 'auditor']), async (c) => {
  const db = c.get('db');
  const startDate = c.req.query('startDate');
  const endDate = c.req.query('endDate');

  let query = db.select().from(members);
  let conditions = [];

  if (startDate) {
    conditions.push(sql`${members.createdAt} >= ${startDate}`);
  }
  if (endDate) {
    conditions.push(sql`${members.createdAt} <= ${endDate}`);
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const data = await query.execute();
  const headers = ['ID', 'Full Name', 'Phone', 'Member Number', 'Status', 'Joined Date', 'Address', 'Next of Kin'];
  const rows = data.map(m => [ m.id, `"${m.fullName}"`, m.phone, m.memberNumber, m.status, m.createdAt, `"${m.address || ''}"`, `"${m.nextOfKinName || ''}"` ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  const filename = startDate && endDate ? `members_${startDate}_to_${endDate}.csv` : 'members_all_time.csv';

  return c.text(csvContent, 200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': `attachment; filename="${filename}"`,
  });
});

// GET /:id/deposit ... Serves the deposit form
app.get('/:id/deposit', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const member = await db.select().from(members).where(eq(members.id, memberId)).get();
  const settingsResult = await db.select().from(sacco).limit(1).execute();
  const settings = settingsResult[0] || {};
  return c.html(<DepositForm member={member} defaults={settings} />);
});

// POST /:id/savings ... Handles the savings deposit
app.post('/:id/savings', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const body = await c.req.parseBody();
  const result = memberTransactionSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors = Object.keys(errors).reduce((acc, key) => {
      acc[key] = errors[key][0];
      return acc;
    }, {});
    
    const member = await db.select().from(members).where(eq(members.id, memberId)).get();
    const settingsResult = await db.select().from(sacco).limit(1).execute();
    const settings = settingsResult[0] || {};
    return c.html(<DepositForm member={member} errors={formattedErrors} values={body} defaults={settings} />);
  }

  const data = result.data;
  await db.insert(savings).values({
    id: `sav_${Math.random().toString(36).substring(2, 9)}`,
    memberId: memberId,
    type: 'deposit',
    amount: data.amount,
    date: data.date,
  }).execute();

  await db.insert(transactions).values({
    id: `txn_${Math.random().toString(36).substring(2, 9)}`,
    associationId: 'sacco-01',
    type: 'income',
    category: 'Savings Deposit',
    amount: data.amount,
    description: `Savings deposit from member ${memberId}`,
    date: data.date,
  }).execute();

  c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Deposit recorded successfully!", type: 'success' } }));
  return c.redirect(`/dashboard/members/${memberId}`);
});

// POST /:id/withdraw ... Handle Withdrawal
app.post('/:id/withdraw', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const body = await c.req.parseBody();
  const result = memberTransactionSchema.safeParse(body);

  const stats = await getMemberStats(db, memberId);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors = Object.keys(errors).reduce((acc, key) => {
      acc[key] = errors[key][0];
      return acc;
    }, {});
    
    const member = await db.select().from(members).where(eq(members.id, memberId)).get();
    const settingsResult = await db.select().from(sacco).limit(1).execute();
    const settings = settingsResult[0] || {};
    return c.html(<WithdrawForm member={member} maxAmount={stats.savingsBalance} errors={formattedErrors} values={body} defaults={settings} />);
  }

  const data = result.data;
  const amount = data.amount;

  if (amount > stats.savingsBalance) {
    const member = await db.select().from(members).where(eq(members.id, memberId)).get();
    return c.html(<WithdrawForm member={member} maxAmount={stats.savingsBalance} errors={{ amount: "Insufficient balance" }} values={body} />);
  }

  await db.insert(savings).values({
    id: `sav_${Math.random().toString(36).substring(2, 9)}`,
    memberId: memberId,
    type: 'withdrawal',
    amount: amount,
    date: data.date,
  }).execute();

  await db.insert(transactions).values({
    id: `txn_${Math.random().toString(36).substring(2, 9)}`,
    associationId: 'sacco-01',
    type: 'expense',
    category: 'Savings Withdrawal',
    amount: amount,
    description: `Savings withdrawal by member ${memberId}`,
    date: data.date,
  }).execute();

  c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Withdrawal processed successfully!", type: 'success' } }));
  return c.redirect(`/dashboard/members/${memberId}`);
});

// GET /:id/withdraw ... Serve Withdrawal Form
app.get('/:id/withdraw', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const member = await db.select().from(members).where(eq(members.id, memberId)).get();
  
  const stats = await getMemberStats(db, memberId);
  const settingsResult = await db.select().from(sacco).limit(1).execute();
  const settings = settingsResult[0] || {};
  return c.html(<WithdrawForm member={member} maxAmount={stats.savingsBalance} defaults={settings} />);
});

// GET /:id/loans/new ... Serve Loan Form
app.get('/:id/loans/new', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const member = await db.select().from(members).where(eq(members.id, memberId)).get();
  
  const stats = await getMemberStats(db, memberId);
  const settingsResult = await db.select().from(sacco).limit(1);
  const settings = settingsResult[0] || {};

  return c.html(<LoanForm member={member} defaults={settings} loanLimit={stats.loanLimit} />);
});

// POST /:id/loans ... Create Loan
app.post('/:id/loans', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const body = await c.req.parseBody();
  const result = memberLoanSchema.safeParse(body);

  const stats = await getMemberStats(db, memberId);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors = Object.keys(errors).reduce((acc, key) => {
      acc[key] = errors[key][0];
      return acc;
    }, {});
    
    const member = await db.select().from(members).where(eq(members.id, memberId)).get();
    const settingsResult = await db.select().from(sacco).limit(1);
    const settings = settingsResult[0] || {};
    
    return c.html(<LoanForm member={member} defaults={settings} errors={formattedErrors} values={body} loanLimit={stats.loanLimit} />);
  }

  const data = result.data;

  const newLoan = {
    id: `loan_${Math.random().toString(36).substring(2, 9)}`,
    memberId: memberId,
    principal: data.principal,
    interestRate: data.interestRate,
    durationMonths: data.durationMonths,
    issuedDate: data.issuedDate,
    status: 'active',
  };

  await db.insert(loans).values(newLoan).execute();

  await db.insert(transactions).values({
    id: `txn_${Math.random().toString(36).substring(2, 9)}`,
    associationId: 'sacco-01',
    type: 'expense',
    category: 'Loan Disbursement',
    amount: data.principal,
    description: `Loan disbursement to member ${memberId}`,
    date: data.issuedDate,
  }).execute();

  c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Loan issued successfully!", type: 'success' } }));
  return c.redirect(`/dashboard/members/${memberId}`);
});

// GET /:id/loans/:loanId/pay ... Serve Repayment Form
app.get('/:id/loans/:loanId/pay', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const member = await db.select().from(members).where(eq(members.id, memberId)).get();
  const loanId = c.req.param('loanId');
  
  const result = await db.select().from(loans).where(eq(loans.id, loanId)).limit(1);
  const loan = result[0];
  
  if (!loan) return c.text('Loan not found', 404);

  const payments = await db.select().from(loanPayments).where(eq(loanPayments.loanId, loanId)).execute();
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return c.html(<LoanRepaymentForm member={member} loan={loan} totalPaid={totalPaid} />);
});

// POST /:id/loans/:loanId/pay ... Handle Repayment
app.post('/:id/loans/:loanId/pay', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const loanId = c.req.param('loanId');
  const body = await c.req.parseBody();
  const result = memberTransactionSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors = Object.keys(errors).reduce((acc, key) => {
      acc[key] = errors[key][0];
      return acc;
    }, {});
    
    const member = await db.select().from(members).where(eq(members.id, memberId)).get();
    const loanResult = await db.select().from(loans).where(eq(loans.id, loanId)).limit(1);
    const loan = loanResult[0];
    const payments = await db.select().from(loanPayments).where(eq(loanPayments.loanId, loanId)).execute();
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    return c.html(<LoanRepaymentForm member={member} loan={loan} totalPaid={totalPaid} errors={formattedErrors} values={body} />);
  }

  const data = result.data;
  const paymentAmount = data.amount;

  await db.insert(loanPayments).values({
    id: `pay_${Math.random().toString(36).substring(2, 9)}`,
    loanId: loanId,
    amount: paymentAmount,
    date: data.date,
  }).execute();

  await db.insert(transactions).values({
    id: `txn_${Math.random().toString(36).substring(2, 9)}`,
    associationId: 'sacco-01',
    type: 'income',
    category: 'Loan Repayment',
    amount: paymentAmount,
    description: `Loan repayment from member ${memberId}`,
    date: data.date,
  }).execute();

  const loanResult = await db.select().from(loans).where(eq(loans.id, loanId)).limit(1);
  const loan = loanResult[0];

  const payments = await db.select().from(loanPayments).where(eq(loanPayments.loanId, loanId)).execute();
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const totalInterest = loan.principal * (loan.interestRate / 100) * loan.durationMonths;
  const totalDue = loan.principal + totalInterest;

  if (totalPaid >= totalDue) {
    await db.update(loans).set({ status: 'paid' }).where(eq(loans.id, loanId)).execute();
  }

  c.header('HX-Trigger', JSON.stringify({ showMessage: { message: totalPaid >= totalDue ? "Loan fully paid and closed!" : "Payment recorded!", type: 'success' } }));
  return c.redirect(`/dashboard/members/${memberId}`);
});

// GET /:id/shares/new ... Serve Share Purchase Form
app.get('/:id/shares/new', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const member = await db.select().from(members).where(eq(members.id, memberId)).get();
  const settingsResult = await db.select().from(sacco).limit(1).execute();
  const settings = settingsResult[0] || {};
  return c.html(<SharePurchaseForm member={member} defaults={settings} />);
});

// Member Specific Sub-Pages
app.get('/:id/savings', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const member = await db.select().from(members).where(eq(members.id, id)).get();
  if (!member) return c.text('Member not found', 404);
  const savingsList = await db.select().from(savings).where(eq(savings.memberId, id)).orderBy(desc(savings.date)).execute();
  return c.html(<MemberSavingsPage member={member} savings={savingsList} />);
});

app.get('/:id/shares', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const member = await db.select().from(members).where(eq(members.id, id)).get();
  if (!member) return c.text('Member not found', 404);
  const sharesList = await db.select().from(shares).where(eq(shares.memberId, id)).orderBy(desc(shares.date)).execute();
  const settings = await db.select().from(sacco).limit(1).get();
  return c.html(<MemberSharesPage member={member} shares={sharesList} sharePrice={settings?.sharePrice || 20000} />);
});

app.get('/:id/loans', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const member = await db.select().from(members).where(eq(members.id, id)).get();
  if (!member) return c.text('Member not found', 404);
  const rawLoans = await db.select().from(loans).where(eq(loans.memberId, id)).orderBy(desc(loans.issuedDate)).execute();
  
  const memberLoans = await Promise.all(rawLoans.map(async (loan) => {
    const payments = await db.select({ total: sql`sum(${loanPayments.amount})` })
      .from(loanPayments)
      .where(eq(loanPayments.loanId, loan.id))
      .execute();
    return { ...loan, totalPaid: payments[0].total || 0 };
  }));

  const stats = await getMemberStats(db, id);
  return c.html(<MemberLoansPage member={member} loans={memberLoans} loanLimit={stats.loanLimit} />);
});

// POST /:id/shares ... Handle Share Purchase
app.post('/:id/shares', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const body = await c.req.parseBody();
  const result = memberTransactionSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors = Object.keys(errors).reduce((acc, key) => {
      acc[key] = errors[key][0];
      return acc;
    }, {});
    
    const member = await db.select().from(members).where(eq(members.id, memberId)).get();
    const settingsResult = await db.select().from(sacco).limit(1).execute();
    const settings = settingsResult[0] || {};
    return c.html(<SharePurchaseForm member={member} errors={formattedErrors} values={body} defaults={settings} />);
  }

  const data = result.data;
  const amount = data.amount;

  await db.insert(shares).values({
    id: `shr_${Math.random().toString(36).substring(2, 9)}`,
    memberId: memberId,
    amount: amount,
    date: data.date,
  }).execute();

  await db.insert(transactions).values({
    id: `txn_${Math.random().toString(36).substring(2, 9)}`,
    associationId: 'sacco-01',
    type: 'income',
    category: 'Share Capital',
    amount: amount,
    description: `Share capital purchase from member ${memberId}`,
    date: data.date,
  }).execute();

  c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Shares purchased successfully!", type: 'success' } }));
  return c.redirect(`/dashboard/members/${memberId}`);
});

// GET /:id ... Member detail view
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  const member = result[0];
  if (!member) return c.text('Member not found', 404);

  const stats = await getMemberStats(db, id);
  const memberShares = await db.select().from(shares).where(eq(shares.memberId, id)).execute();
  const memberSavings = await db.select().from(savings).where(eq(savings.memberId, id)).execute();
  const rawLoans = await db.select().from(loans).where(eq(loans.memberId, id)).orderBy(desc(loans.issuedDate)).execute();
  
  // Enrich loans with payment data
  const memberLoans = await Promise.all(rawLoans.map(async (loan) => {
    const payments = await db.select({ total: sql`sum(${loanPayments.amount})` })
      .from(loanPayments)
      .where(eq(loanPayments.loanId, loan.id))
      .execute();
    return {
      ...loan,
      totalPaid: payments[0].total || 0
    };
  }));
  
  // Calculate 6-Month Trend for this member
  const trendData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mStart = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
    const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
    const label = d.toLocaleString('default', { month: 'short' });

    // Savings Net for the month
    const savInc = await db.select({ total: sql`sum(${savings.amount})` })
      .from(savings)
      .where(and(eq(savings.memberId, id), eq(savings.type, 'deposit'), sql`${savings.date} >= ${mStart} AND ${savings.date} <= ${mEnd}`))
      .execute();
    const savExp = await db.select({ total: sql`sum(${savings.amount})` })
      .from(savings)
      .where(and(eq(savings.memberId, id), eq(savings.type, 'withdrawal'), sql`${savings.date} >= ${mStart} AND ${savings.date} <= ${mEnd}`))
      .execute();

    // Loan Principle issued in the month
    const loanAmt = await db.select({ total: sql`sum(${loans.principal})` })
      .from(loans)
      .where(and(eq(loans.memberId, id), sql`${loans.issuedDate} >= ${mStart} AND ${loans.issuedDate} <= ${mEnd}`))
      .execute();

    trendData.push({
      month: label,
      savings: (savInc[0].total || 0) - (savExp[0].total || 0),
      loans: loanAmt[0].total || 0
    });
  }

  return c.html(<MemberDetailPage 
    member={member} 
    stats={stats} 
    loans={memberLoans} 
    savings={memberSavings} 
    shares={memberShares} 
    trendData={trendData}
  />);
});

// DELETE /:id ... Delete a member
app.delete('/:id', roleGuard(['super_admin', 'admin']), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  try {
    await db.delete(members).where(eq(members.id, id)).execute();
    c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Member deleted successfully.", type: 'success' } }));
    return c.redirect('/dashboard/members');
  } catch (e) {
    console.error('Failed to delete member:', e);
    c.header('HX-Trigger', JSON.stringify({ showMessage: { message: "Failed to delete member.", type: 'error' } }));
    return c.status(500);
  }
});

// PUT /:id - Update member details
app.put('/:id', 
  roleGuard(['super_admin', 'admin', 'manager']), 
  zValidator('form', updateMemberSchema, (result, c) => {
    if (!result.success) return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
  }),
  async (c) => {
    const db = c.get('db');
    const id = c.req.param('id');
    const body = c.req.valid('form');

        const updatedMember = {
          fullName: body.fullName,
          phone: body.phone,
          address: body.address,
          nextOfKinName: body.nextOfKinName,
          nextOfKinPhone: body.nextOfKinPhone,
          status: body.status,
        };
    
        await db.update(members).set(updatedMember).where(eq(members.id, id)).execute();
    
        const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
        const member = result[0];
    
        return c.html(
          <>
            <MemberDetailProfileForm id="member-profile-form" member={member} />
            <script dangerouslySetInnerHTML={{ __html: `
                (function(){
                  const toastContainer = document.getElementById('htmx-toast-container');
                  if (toastContainer) {
                    const toast = document.createElement('div');
                    toast.className = 'alert bg-success text-sm font-bold shadow-default rounded-sm text-white border-none py-3 px-6 z-[9999]';
                    toast.innerHTML = '<span>${member.fullName} updated successfully!</span>';
                    toastContainer.appendChild(toast);
                    setTimeout(() => toast.remove(), 5000); 
                  }
                  // Force page reload to update status badge in header
                  setTimeout(() => { window.location.reload(); }, 1500);
                })();
          ` }} />
        </>
      );
    }
    );
export default app;