import { Hono } from 'hono';
import { like, or, eq, desc, sql } from 'drizzle-orm';
import { members, shares, savings, loans, loanPayments, transactions } from '../../db/schema';
import MembersPage, { MembersList, MemberRow } from './List';
import NewMemberForm from './NewForm';
import MemberDetailPage, { 
  MemberDetailStats, 
  MemberDetailSavingsTab, 
  MemberDetailLoansTab, 
  MemberDetailProfileForm 
} from './Detail';
import { Toast } from '../../components/Toast';
import DepositForm from './DepositForm';
import LoanForm from './LoanForm';
import LoanRepaymentForm from './LoanRepaymentForm';

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
  
  // Get all payments for all loans of this member
  const loanIds = memberLoans.map(l => l.id);
  let allPayments = [];
  if (loanIds.length > 0) {
    // For simplicity in SQLite/D1 without complex joins in one go:
    allPayments = await db.select().from(loanPayments).execute();
    allPayments = allPayments.filter(p => loanIds.includes(p.loanId));
  }

  const totalShares = memberShares.reduce((acc, s) => acc + s.amount, 0);
  const savingsBalance = memberSavings.reduce((acc, s) => s.type === 'deposit' ? acc + s.amount : acc - s.amount, 0);
  
  // Calculate Loan Balance: (Principal + Flat Interest) - Payments
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

  if (c.req.header('hx-request')) {
    return c.html(<MembersList members={data} page={page} totalPages={totalPages} search={search} />);
  }
  return c.html(<MembersPage members={data} page={page} totalPages={totalPages} search={search} />);
});

// GET /new ... Form for creating a new member
app.get('/new', (c) => {
  return c.html(<NewMemberForm />);
});

// POST / ... Create a new member
app.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
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
  c.header('HX-Trigger', 'closeModal');
  return c.html(
    <>
      <MemberRow member={newMember} />
      <Toast message={`${newMember.fullName} added successfully`} />
    </>
  );
});

// GET /export ... CSV export
app.get('/export', async (c) => {
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
app.post('/:id/savings', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const body = await c.req.parseBody();
  await db.insert(savings).values({
    id: `sav_${Math.random().toString(36).substring(2, 9)}`,
    memberId: memberId,
    type: 'deposit',
    amount: parseInt(body.amount),
    date: body.date,
  }).execute();

  const stats = await getMemberStats(db, memberId);
  const memberSavings = await db.select().from(savings).where(eq(savings.memberId, memberId)).orderBy(desc(savings.date)).execute();

  c.header('HX-Trigger', 'closeModal');
  return c.html(
    <>
      <MemberDetailStats id="member-stats-container" stats={stats} />
      <MemberDetailSavingsTab id="member-savings-history" savings={memberSavings} />
      <Toast message="Deposit recorded successfully!" />
    </>
  );
});

// GET /:id/loans/new ... Serve Loan Form
app.get('/:id/loans/new', (c) => {
  const memberId = c.req.param('id');
  return c.html(<LoanForm memberId={memberId} />);
});

// POST /:id/loans ... Create Loan
app.post('/:id/loans', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const body = await c.req.parseBody();

  const newLoan = {
    id: `loan_${Math.random().toString(36).substring(2, 9)}`,
    memberId: memberId,
    principal: parseInt(body.principal),
    interestRate: parseFloat(body.interestRate),
    durationMonths: parseInt(body.durationMonths),
    issuedDate: body.issuedDate,
    status: 'active',
  };

  await db.insert(loans).values(newLoan).execute();

  // Record Transaction (Disbursement)
  await db.insert(transactions).values({
    id: `txn_${Math.random().toString(36).substring(2, 9)}`,
    associationId: 'sacco-01', // Using default SACCO ID for now
    type: 'expense',
    category: 'Loan Disbursement',
    amount: parseInt(body.principal),
    description: `Loan disbursement to member ${memberId}`,
    date: body.issuedDate,
  }).execute();

  const stats = await getMemberStats(db, memberId);
  const updatedLoans = await db.select().from(loans).where(eq(loans.memberId, memberId)).orderBy(desc(loans.issuedDate)).execute();

  c.header('HX-Trigger', 'closeModal');
  return c.html(
    <>
      <MemberDetailStats id="member-stats-container" stats={stats} />
      <MemberDetailLoansTab id="member-loans-history" loans={updatedLoans} />
      <Toast message="Loan issued successfully!" />
    </>
  );
});

// GET /:id/loans/:loanId/pay ... Serve Repayment Form
app.get('/:id/loans/:loanId/pay', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const loanId = c.req.param('loanId');
  
  const result = await db.select().from(loans).where(eq(loans.id, loanId)).limit(1);
  const loan = result[0];
  
  if (!loan) return c.text('Loan not found', 404);

  // Calculate existing payments
  const payments = await db.select().from(loanPayments).where(eq(loanPayments.loanId, loanId)).execute();
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return c.html(<LoanRepaymentForm memberId={memberId} loan={loan} totalPaid={totalPaid} />);
});

// POST /:id/loans/:loanId/pay ... Handle Repayment
app.post('/:id/loans/:loanId/pay', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const loanId = c.req.param('loanId');
  const body = await c.req.parseBody();
  const paymentAmount = parseInt(body.amount);

  // 1. Record Payment
  await db.insert(loanPayments).values({
    id: `pay_${Math.random().toString(36).substring(2, 9)}`,
    loanId: loanId,
    amount: paymentAmount,
    date: body.date,
  }).execute();

  // Record Transaction (Repayment)
  await db.insert(transactions).values({
    id: `txn_${Math.random().toString(36).substring(2, 9)}`,
    associationId: 'sacco-01',
    type: 'income',
    category: 'Loan Repayment',
    amount: paymentAmount,
    description: `Loan repayment from member ${memberId}`,
    date: body.date,
  }).execute();

  // 2. Check Balance & Close Loan if paid
  // Fetch loan details to calculate total due
  const loanResult = await db.select().from(loans).where(eq(loans.id, loanId)).limit(1);
  const loan = loanResult[0];

  // Fetch all payments for this loan
  const payments = await db.select().from(loanPayments).where(eq(loanPayments.loanId, loanId)).execute();
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  // Total Due = Principal + Interest (Flat)
  const totalInterest = loan.principal * (loan.interestRate / 100) * loan.durationMonths;
  const totalDue = loan.principal + totalInterest;

  if (totalPaid >= totalDue) {
    await db.update(loans).set({ status: 'paid' }).where(eq(loans.id, loanId)).execute();
  }

  // 3. Update UI
  const stats = await getMemberStats(db, memberId);
  const updatedLoans = await db.select().from(loans).where(eq(loans.memberId, memberId)).orderBy(desc(loans.issuedDate)).execute();

  c.header('HX-Trigger', 'closeModal');
  return c.html(
    <>
      <MemberDetailStats id="member-stats-container" stats={stats} />
      <MemberDetailLoansTab id="member-loans-history" loans={updatedLoans} />
      <Toast message={totalPaid >= totalDue ? "Payment recorded & Loan Closed!" : "Payment recorded successfully!"} />
    </>
  );
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
  const memberLoans = await db.select().from(loans).where(eq(loans.memberId, id)).orderBy(desc(loans.issuedDate)).execute();
  
  return c.html(<MemberDetailPage member={member} stats={stats} loans={memberLoans} savings={memberSavings} shares={memberShares} />);
});

// DELETE /:id ... Delete a member
app.delete('/:id', async (c) => {
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
app.put('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.parseBody();

  const updatedMember = {
    fullName: body.fullName,
    phone: body.phone,
    address: body.address,
    nextOfKinName: body.nextOfKinName,
    nextOfKinPhone: body.nextOfKinPhone,
  };

  await db.update(members).set(updatedMember).where(eq(members.id, id)).execute();

  // Re-fetch the member to return updated data
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  const member = result[0];

  c.header('HX-Trigger', 'memberUpdated'); // Optional: trigger a custom event
  return c.html(
    <>
      <MemberDetailProfileForm id="member-profile-form" member={member} />
      <Toast message={`${member.fullName} updated successfully!`} />
    </>
  );
});

export default app;