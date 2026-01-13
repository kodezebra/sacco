import { Hono } from 'hono';
import { like, or, eq, desc, sql, and } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { members, shares, savings, loans, loanPayments, transactions, sacco } from '../../db/schema';
import MembersPage, { MembersList, MemberRow } from './List';
import NewMemberForm from './NewForm';
import MemberDetailPage, { 
  MemberDetailStats, 
  MemberDetailSavingsTab, 
  MemberDetailLoansTab, 
  MemberDetailSharesTab, 
  MemberDetailProfileForm 
} from './Detail';
import { Toast } from '../../components/Toast';
import DepositForm from './DepositForm';
import LoanForm from './LoanForm';
import LoanRepaymentForm from './LoanRepaymentForm';
import SharePurchaseForm from './SharePurchaseForm';
import WithdrawForm from './WithdrawForm';
import { roleGuard } from '../auth/middleware';
import { createMemberSchema, updateMemberSchema, memberTransactionSchema, memberLoanSchema } from './validation';

const app = new Hono();

// Helper to get members with pagination
const getMembers = async (db, search = '', page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  let query = db.select().from(members);
  let countQuery = db.select({ count: sql`count(*)` }).from(members);

  if (search) {
    const searchPattern = `%${search}%`;
    const whereClause = or(like(members.fullName, searchPattern), like(members.phone, searchPattern), like(members.memberNumber, searchPattern));
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
  
  const loanIds = memberLoans.map(l => l.id);
  let allPayments = [];
  if (loanIds.length > 0) {
    allPayments = await db.select().from(loanPayments).execute();
    allPayments = allPayments.filter(p => loanIds.includes(p.loanId));
  }

  const totalShares = memberShares.reduce((acc, s) => acc + s.amount, 0);
  const savingsBalance = memberSavings.reduce((acc, s) => s.type === 'deposit' ? acc + s.amount : acc - s.amount, 0);
  
  const loanBalance = memberLoans.filter(l => l.status === 'active').reduce((acc, l) => {
    const totalInterest = l.principal * (l.interestRate / 100) * l.durationMonths;
    const totalDue = l.principal + totalInterest;
    const paidForThisLoan = allPayments.filter(p => p.loanId === l.id).reduce((sum, p) => sum + p.amount, 0);
    return acc + (totalDue - paidForThisLoan);
  }, 0);

  return { totalShares, savingsBalance, loanBalance };
};

// GET / ... Main members list
app.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search') || '';
  const page = parseInt(c.req.query('page') || '1');
  const { data, totalPages } = await getMembers(db, search, page);

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
    return c.html(<MembersList members={data} page={page} totalPages={totalPages} search={search} />);
  }
  return c.html(<MembersPage members={data} page={page} totalPages={totalPages} search={search} stats={directoryStats} />);
});

// GET /new ... Form for creating a new member
app.get('/new', (c) => {
  return c.html(<NewMemberForm />);
});

// POST / ... Create a new member
app.post('/', 
  zValidator('form', createMemberSchema, (result, c) => {
    if (!result.success) return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
  }),
  async (c) => {
    const db = c.get('db');
    const body = c.req.valid('form');
    const newMember = {
      id: `mbr_${Math.random().toString(36).substring(2, 9)}`,
      saccoId: 'sacco-01',
      fullName: body.fullName,
      phone: body.phone,
      address: body.address,
      nextOfKinName: body.nextOfKinName,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      memberNumber: `MBR${Math.floor(1000 + Math.random() * 9000)}`,
    };
    await db.insert(members).values(newMember).execute();
    c.header('HX-Trigger', JSON.stringify({ closeModal: true }));
    return c.html(
      <>
        <MemberRow member={newMember} />
        <Toast message={`${newMember.fullName} added successfully`} />
      </>
    );
  }
);

// GET /export ... CSV export
app.get('/export', roleGuard(['super_admin', 'admin', 'manager', 'auditor']), async (c) => {
  const db = c.get('db');
  const data = await db.select().from(members).execute();
  const headers = ['ID', 'Full Name', 'Phone', 'Member Number', 'Status', 'Joined Date', 'Address', 'Next of Kin'];
  const rows = data.map(m => [ m.id, `"${m.fullName}"`, m.phone, m.memberNumber, m.status, m.createdAt, `"${m.address || ''}"`, `"${m.nextOfKinName || ''}"` ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  return c.text(csvContent, 200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename="members_list.csv"',
  });
});

// GET /:id/deposit ... Serves the deposit form
app.get('/:id/deposit', (c) => {
  const memberId = c.req.param('id');
  return c.html(<DepositForm memberId={memberId} />);
});

// POST /:id/savings ... Handles the savings deposit
app.post('/:id/savings', 
  zValidator('form', memberTransactionSchema, (result, c) => {
    if (!result.success) return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
  }),
  async (c) => {
    const db = c.get('db');
    const memberId = c.req.param('id');
    const body = c.req.valid('form');
    await db.insert(savings).values({
      id: `sav_${Math.random().toString(36).substring(2, 9)}`,
      memberId: memberId,
      type: 'deposit',
      amount: body.amount,
      date: body.date,
    }).execute();

    // Record Transaction (Savings Deposit)
    await db.insert(transactions).values({
      id: `txn_${Math.random().toString(36).substring(2, 9)}`,
      associationId: 'sacco-01',
      type: 'income',
      category: 'Savings Deposit',
      amount: body.amount,
      description: `Savings deposit from member ${memberId}`,
      date: body.date,
    }).execute();

    const stats = await getMemberStats(db, memberId);
    const memberSavings = await db.select().from(savings).where(eq(savings.memberId, memberId)).orderBy(desc(savings.date)).execute();

    c.header('HX-Trigger', JSON.stringify({ closeModal: true }));
    return c.html(
      <>
        <MemberDetailStats id="member-stats-container" stats={stats} />
        <MemberDetailSavingsTab id="member-savings-history" memberId={memberId} savings={memberSavings} />
        <Toast message="Deposit recorded successfully!" />
      </>
    );
  }
);

// GET /:id/withdraw ... Serve Withdrawal Form
app.get('/:id/withdraw', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  
  const stats = await getMemberStats(db, memberId);
  return c.html(<WithdrawForm memberId={memberId} maxAmount={stats.savingsBalance} />);
});

// POST /:id/withdraw ... Handle Withdrawal
app.post('/:id/withdraw', 
  roleGuard(['super_admin', 'admin', 'manager']), 
  zValidator('form', memberTransactionSchema, (result, c) => {
    if (!result.success) return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
  }),
  async (c) => {
    const db = c.get('db');
    const memberId = c.req.param('id');
    const body = c.req.valid('form');
    const amount = body.amount;

    const stats = await getMemberStats(db, memberId);
    if (amount > stats.savingsBalance) {
      return c.html(<Toast message="Insufficient savings balance!" type="error" />);
    }

    await db.insert(savings).values({
      id: `sav_${Math.random().toString(36).substring(2, 9)}`,
      memberId: memberId,
      type: 'withdrawal',
      amount: amount,
      date: body.date,
    }).execute();

    await db.insert(transactions).values({
      id: `txn_${Math.random().toString(36).substring(2, 9)}`,
      associationId: 'sacco-01',
      type: 'expense',
      category: 'Savings Withdrawal',
      amount: amount,
      description: `Savings withdrawal by member ${memberId}`,
      date: body.date,
    }).execute();

    const newStats = await getMemberStats(db, memberId);
    const memberSavings = await db.select().from(savings).where(eq(savings.memberId, memberId)).orderBy(desc(savings.date)).execute();

    c.header('HX-Trigger', JSON.stringify({ closeModal: true }));
    return c.html(
      <>
        <MemberDetailStats id="member-stats-container" stats={newStats} />
        <MemberDetailSavingsTab id="member-savings-history" memberId={memberId} savings={memberSavings} />
        <Toast message="Withdrawal processed successfully!" />
      </>
    );
  }
);

// GET /:id/loans/new ... Serve Loan Form
app.get('/:id/loans/new', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  
  const settingsResult = await db.select().from(sacco).limit(1);
  const settings = settingsResult[0] || {};

  return c.html(<LoanForm memberId={memberId} defaults={settings} />);
});

// POST /:id/loans ... Create Loan
app.post('/:id/loans', 
  roleGuard(['super_admin', 'admin', 'manager']), 
  zValidator('form', memberLoanSchema, (result, c) => {
    if (!result.success) return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
  }),
  async (c) => {
    const db = c.get('db');
    const memberId = c.req.param('id');
    const body = c.req.valid('form');

    const newLoan = {
      id: `loan_${Math.random().toString(36).substring(2, 9)}`,
      memberId: memberId,
      principal: body.principal,
      interestRate: body.interestRate,
      durationMonths: body.durationMonths,
      issuedDate: body.issuedDate,
      status: 'active',
    };

    await db.insert(loans).values(newLoan).execute();

    await db.insert(transactions).values({
      id: `txn_${Math.random().toString(36).substring(2, 9)}`,
      associationId: 'sacco-01',
      type: 'expense',
      category: 'Loan Disbursement',
      amount: body.principal,
      description: `Loan disbursement to member ${memberId}`,
      date: body.issuedDate,
    }).execute();

    const stats = await getMemberStats(db, memberId);
    const updatedLoans = await db.select().from(loans).where(eq(loans.memberId, memberId)).orderBy(desc(loans.issuedDate)).execute();

    c.header('HX-Trigger', JSON.stringify({ closeModal: true }));
    return c.html(
      <>
        <MemberDetailStats id="member-stats-container" stats={stats} />
        <MemberDetailLoansTab id="member-loans-history" memberId={memberId} loans={updatedLoans} />
        <Toast message="Loan issued successfully!" />
      </>
    );
  }
);

// GET /:id/loans/:loanId/pay ... Serve Repayment Form
app.get('/:id/loans/:loanId/pay', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const loanId = c.req.param('loanId');
  
  const result = await db.select().from(loans).where(eq(loans.id, loanId)).limit(1);
  const loan = result[0];
  
  if (!loan) return c.text('Loan not found', 404);

  const payments = await db.select().from(loanPayments).where(eq(loanPayments.loanId, loanId)).execute();
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return c.html(<LoanRepaymentForm memberId={memberId} loan={loan} totalPaid={totalPaid} />);
});

// POST /:id/loans/:loanId/pay ... Handle Repayment
app.post('/:id/loans/:loanId/pay', 
  roleGuard(['super_admin', 'admin', 'manager']), 
  zValidator('form', memberTransactionSchema, (result, c) => {
    if (!result.success) return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
  }),
  async (c) => {
    const db = c.get('db');
    const memberId = c.req.param('id');
    const loanId = c.req.param('loanId');
    const body = c.req.valid('form');
    const paymentAmount = body.amount;

    await db.insert(loanPayments).values({
      id: `pay_${Math.random().toString(36).substring(2, 9)}`,
      loanId: loanId,
      amount: paymentAmount,
      date: body.date,
    }).execute();

    await db.insert(transactions).values({
      id: `txn_${Math.random().toString(36).substring(2, 9)}`,
      associationId: 'sacco-01',
      type: 'income',
      category: 'Loan Repayment',
      amount: paymentAmount,
      description: `Loan repayment from member ${memberId}`,
      date: body.date,
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

    const stats = await getMemberStats(db, memberId);
    const updatedLoans = await db.select().from(loans).where(eq(loans.memberId, memberId)).orderBy(desc(loans.issuedDate)).execute();

    c.header('HX-Trigger', JSON.stringify({ closeModal: true }));
    return c.html(
      <>
        <MemberDetailStats id="member-stats-container" stats={stats} />
        <MemberDetailLoansTab id="member-loans-history" memberId={memberId} loans={updatedLoans} />
        <Toast message={totalPaid >= totalDue ? "Payment recorded & Loan Closed!" : "Payment recorded successfully!"} />
      </>
    );
  }
);

// GET /:id/shares/new ... Serve Share Purchase Form
app.get('/:id/shares/new', (c) => {
  const memberId = c.req.param('id');
  return c.html(<SharePurchaseForm memberId={memberId} />);
});

// POST /:id/shares ... Handle Share Purchase
app.post('/:id/shares', 
  roleGuard(['super_admin', 'admin', 'manager']), 
  zValidator('form', memberTransactionSchema, (result, c) => {
    if (!result.success) return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
  }),
  async (c) => {
    const db = c.get('db');
    const memberId = c.req.param('id');
    const body = c.req.valid('form');
    const amount = body.amount;

    await db.insert(shares).values({
      id: `shr_${Math.random().toString(36).substring(2, 9)}`,
      memberId: memberId,
      amount: amount,
      date: body.date,
    }).execute();

    await db.insert(transactions).values({
      id: `txn_${Math.random().toString(36).substring(2, 9)}`,
      associationId: 'sacco-01',
      type: 'income',
      category: 'Share Capital',
      amount: amount,
      description: `Share capital purchase from member ${memberId}`,
      date: body.date,
    }).execute();

    const stats = await getMemberStats(db, memberId);
    const updatedShares = await db.select().from(shares).where(eq(shares.memberId, memberId)).orderBy(desc(shares.date)).execute();

    c.header('HX-Trigger', JSON.stringify({ closeModal: true }));
    return c.html(
      <>
        <MemberDetailStats id="member-stats-container" stats={stats} />
        <MemberDetailSharesTab id="member-shares-history" memberId={memberId} shares={updatedShares} />
        <Toast message="Shares purchased successfully!" />
      </>
    );
  }
);

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
  const memberLoans = await db.select().from(loans).where(eq(loans.memberId, id)).orderBy(desc(loans.issuedDate)).execute();
  
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
  } catch (e) {
    console.error('Failed to delete member:', e);
    return c.text('Failed to delete member', 500);
  }
  return c.body(null, 200);
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
    };

    await db.update(members).set(updatedMember).where(eq(members.id, id)).execute();

    const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
    const member = result[0];

    c.header('HX-Trigger', JSON.stringify({ memberUpdated: true })); 
    return c.html(
      <>
        <MemberDetailProfileForm id="member-profile-form" member={member} />
        <Toast message={`${member.fullName} updated successfully!`} />
      </>
    );
  }
);

export default app;