import { Hono } from 'hono';
import { eq, desc, sql, like, or } from 'drizzle-orm';
import { loans, members, loanPayments, shares, savings, transactions, associations, staff } from '../../db/schema';
import ReportsPage, { MemberSearchList } from './Page';
import LoanPortfolioReport from './LoanPortfolioReport';
import MemberStatement from './MemberStatement';
import CashFlowReport from './CashFlowReport';
import ProjectReport from './ProjectReport';
import { roleGuard } from '../auth/middleware';

const app = new Hono();

// List Reports (Restricted to Managers/Admins/Auditors)
app.get('/', roleGuard(['super_admin', 'admin', 'manager', 'auditor']), async (c) => {
  const db = c.get('db');
  const search = c.req.query('search') || '';
  
  const allAssociations = await db.select().from(associations).execute();

  let searchedMembers = [];
  if (search) {
    searchedMembers = await db.select()
      .from(members)
      .where(or(like(members.fullName, `%${search}%`), like(members.memberNumber, `%${search}%`)))
      .limit(5)
      .execute();
  }

  if (c.req.header('hx-request')) {
    return c.html(<MemberSearchList members={searchedMembers} />);
  }

  return c.html(<ReportsPage searchedMembers={searchedMembers} search={search} associations={allAssociations} />);
});

// GET /projects/:id ... Business Unit Detailed Performance
app.get('/projects/:id', roleGuard(['super_admin', 'admin', 'manager', 'auditor']), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const assoc = await db.select().from(associations).where(eq(associations.id, id)).get();
  if (!assoc) return c.text('Association not found', 404);

  const txs = await db.select()
    .from(transactions)
    .where(eq(transactions.associationId, id))
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
    <ProjectReport 
      association={assoc} 
      stats={stats} 
      categories={Object.values(categoryMap)}
      staffCount={staffRes[0].count || 0}
    />
  );
});

// GET /cash-flow ... Cash Flow Statement
app.get('/cash-flow', roleGuard(['super_admin', 'admin', 'manager', 'auditor']), async (c) => {
  const db = c.get('db');
  
  const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.date)).execute();

  const income = allTransactions.filter(t => t.type === 'income');
  const expense = allTransactions.filter(t => t.type === 'expense');

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expense.reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalIncome - totalExpense;

  // Group by category
  const breakdown = allTransactions.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { name: t.category, type: t.type, amount: 0, count: 0 };
    acc[t.category].amount += t.amount;
    acc[t.category].count += 1;
    return acc;
  }, {});

  const categories = Object.values(breakdown).sort((a, b) => b.amount - a.amount);

  return c.html(<CashFlowReport 
    transactions={allTransactions} 
    stats={{ totalIncome, totalExpense, netCashFlow }}
    categories={categories}
  />);
});

// GET /loans-active ... Active Loan Portfolio Report
app.get('/loans-active', roleGuard(['super_admin', 'admin', 'manager', 'auditor']), async (c) => {
  const db = c.get('db');

  const activeLoans = await db.select({
    id: loans.id,
    principal: loans.principal,
    interestRate: loans.interestRate,
    durationMonths: loans.durationMonths,
    issuedDate: loans.issuedDate,
    memberName: members.fullName,
    memberNumber: members.memberNumber,
  })
  .from(loans)
  .leftJoin(members, eq(loans.memberId, members.id))
  .where(eq(loans.status, 'active'))
  .orderBy(desc(loans.issuedDate))
  .execute();

  const loanIds = activeLoans.map(l => l.id);
  let payments = [];
  if (loanIds.length > 0) {
    payments = await db.select().from(loanPayments).execute();
    payments = payments.filter(p => loanIds.includes(p.loanId));
  }

  const reportData = activeLoans.map(loan => {
    const totalInterest = loan.principal * (loan.interestRate / 100) * loan.durationMonths;
    const totalDue = loan.principal + totalInterest;
    const totalPaid = payments.filter(p => p.loanId === loan.id).reduce((sum, p) => sum + p.amount, 0);
    const balance = totalDue - totalPaid;

    return {
      ...loan,
      totalDue,
      totalPaid,
      balance
    };
  });

  return c.html(<LoanPortfolioReport data={reportData} />);
});

// GET /member-statement/:id ... Member Detailed Statement
app.get('/member-statement/:id', roleGuard(['super_admin', 'admin', 'manager', 'auditor']), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const memberResult = await db.select().from(members).where(eq(members.id, id)).limit(1);
  const member = memberResult[0];
  if (!member) return c.text('Member not found', 404);

  const memberSavings = await db.select().from(savings).where(eq(savings.memberId, id)).execute();
  const memberShares = await db.select().from(shares).where(eq(shares.memberId, id)).execute();
  const memberLoans = await db.select().from(loans).where(eq(loans.memberId, id)).execute();
  
  const loanIds = memberLoans.map(l => l.id);
  let payments = [];
  if (loanIds.length > 0) {
    payments = await db.select().from(loanPayments).execute();
    payments = payments.filter(p => loanIds.includes(p.loanId));
  }

  const ledger = [
    ...memberSavings.map(s => ({ date: s.date, type: 'Savings', category: s.type, amount: s.amount, impact: s.type === 'deposit' ? 'credit' : 'debit' })),
    ...memberShares.map(s => ({ date: s.date, type: 'Shares', category: 'Investment', amount: s.amount, impact: 'credit' })),
    ...payments.map(p => ({ date: p.date, type: 'Loan Repay', category: 'Payment', amount: p.amount, impact: 'credit' })),
    ...memberLoans.map(l => ({ date: l.issuedDate, type: 'Loan Issue', category: 'Disbursement', amount: l.principal, impact: 'debit' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return c.html(<MemberStatement member={member} ledger={ledger} />);
});

// Placeholder routes for remaining reports
const placeholderHandler = (c) => {
  return c.html(
    <div class="p-10 text-center">
      <h1 class="text-2xl font-bold mb-4">Report Under Construction</h1>
      <p>This report logic is being implemented.</p>
      <a href="/dashboard/reports" class="btn btn-primary mt-4">Back to Reports</a>
    </div>
  );
};

app.get('/:reportId', placeholderHandler);

export default app;