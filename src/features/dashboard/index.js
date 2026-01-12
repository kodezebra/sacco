import { Hono } from 'hono';
import { sql, eq, desc } from 'drizzle-orm';
import { members, loans, transactions, shares, savings, sacco } from '../../db/schema';
import DashboardHome from './Page';
import membersApp from '../members';
import loansApp from '../loans';
import transactionsApp from '../transactions';
import sharesApp from '../shares';
import associationsApp from '../associations';
import staffApp from '../staff';
import payrollApp from '../payroll';
import reportsApp from '../reports';
import saccoApp from '../sacco';
import savingsApp from '../savings';

const app = new Hono();

// Dashboard Home
app.get('/', async (c) => {
  const db = c.get('db');
  const currentUser = c.get('user');

  // 0. SACCO Details
  const saccoResult = await db.select().from(sacco).limit(1).execute();
  const saccoInfo = saccoResult[0] || { name: 'My SACCO' };

  // Dates for Monthly P&L
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  // 1. Total Members
  const membersResult = await db.select({ count: sql`count(*)` }).from(members).execute();
  const totalMembers = membersResult[0].count;

  // 2. Global Financial Position (This Month)
  const monthIncomeRes = await db.select({ total: sql`sum(${transactions.amount})` })
    .from(transactions)
    .where(sql`${transactions.type} = 'income' AND ${transactions.date} >= ${firstDay} AND ${transactions.date} <= ${lastDay}`)
    .execute();

  const monthExpenseRes = await db.select({ total: sql`sum(${transactions.amount})` })
    .from(transactions)
    .where(sql`${transactions.type} = 'expense' AND ${transactions.date} >= ${firstDay} AND ${transactions.date} <= ${lastDay}`)
    .execute();

  const monthIncome = monthIncomeRes[0].total || 0;
  const monthExpense = monthExpenseRes[0].total || 0;

  // 3. Global Assets (Shares + Net Savings)
  const sharesResult = await db.select({ total: sql`sum(${shares.amount})` }).from(shares).execute();
  const totalShares = sharesResult[0].total || 0;

  const savingsDeposits = await db.select({ total: sql`sum(${savings.amount})` }).from(savings).where(eq(savings.type, 'deposit')).execute();
  const savingsWithdrawals = await db.select({ total: sql`sum(${savings.amount})` }).from(savings).where(eq(savings.type, 'withdrawal')).execute();
  const netSavings = (savingsDeposits[0].total || 0) - (savingsWithdrawals[0].total || 0);
  
  const totalAssets = totalShares + netSavings;

  // 4. Active Loan Portfolio
  const loansResult = await db.select({ total: sql`sum(${loans.principal})` }).from(loans).where(eq(loans.status, 'active')).execute();
  const loanPortfolio = loansResult[0].total || 0;

  // 5. Cash on Hand (Net All Transactions)
  const incomeResult = await db.select({ total: sql`sum(${transactions.amount})` }).from(transactions).where(eq(transactions.type, 'income')).execute();
  const expenseResult = await db.select({ total: sql`sum(${transactions.amount})` }).from(transactions).where(eq(transactions.type, 'expense')).execute();
  const cashOnHand = (incomeResult[0].total || 0) - (expenseResult[0].total || 0);

  // 6. Global 6-Month Trend
  const trendData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mStart = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
    const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
    const label = d.toLocaleString('default', { month: 'short' });

    const inc = await db.select({ total: sql`sum(${transactions.amount})` })
      .from(transactions)
      .where(sql`${transactions.type} = 'income' AND ${transactions.date} >= ${mStart} AND ${transactions.date} <= ${mEnd}`)
      .execute();

    const exp = await db.select({ total: sql`sum(${transactions.amount})` })
      .from(transactions)
      .where(sql`${transactions.type} = 'expense' AND ${transactions.date} >= ${mStart} AND ${transactions.date} <= ${mEnd}`)
      .execute();

    trendData.push({
      month: label,
      income: inc[0].total || 0,
      expense: exp[0].total || 0
    });
  }

  // 7. Recent Activity
  const recentActivity = await db.select()
    .from(transactions)
    .orderBy(desc(transactions.date))
    .limit(8)
    .execute();

  const stats = {
    totalMembers,
    totalAssets,
    loanPortfolio,
    cashOnHand,
    thisMonthIncome: monthIncome,
    thisMonthExpense: monthExpense,
    thisMonthNet: monthIncome - monthExpense
  };

  return c.html(<DashboardHome 
    stats={stats} 
    recentActivity={recentActivity} 
    sacco={saccoInfo} 
    trendData={trendData}
    currentUser={currentUser} 
  />);
});

// Mount Sub-features
app.route('/members', membersApp);
app.route('/loans', loansApp);
app.route('/transactions', transactionsApp);
app.route('/shares', sharesApp);
app.route('/associations', associationsApp);
app.route('/staff', staffApp);
app.route('/payroll', payrollApp);
app.route('/reports', reportsApp);
app.route('/sacco', saccoApp);
app.route('/savings', savingsApp);

export default app;