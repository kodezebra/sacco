import { Hono } from 'hono';
import { sql, eq, desc } from 'drizzle-orm';
import { members, loans, transactions, shares, savings } from '../../db/schema';
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

  // 1. Total Members
  const membersResult = await db.select({ count: sql`count(*)` }).from(members).execute();
  const totalMembers = membersResult[0].count;

  // 2. Total Assets (Shares + Net Savings)
  const sharesResult = await db.select({ total: sql`sum(${shares.amount})` }).from(shares).execute();
  const totalShares = sharesResult[0].total || 0;

  const savingsDeposits = await db.select({ total: sql`sum(${savings.amount})` }).from(savings).where(eq(savings.type, 'deposit')).execute();
  const savingsWithdrawals = await db.select({ total: sql`sum(${savings.amount})` }).from(savings).where(eq(savings.type, 'withdrawal')).execute();
  const netSavings = (savingsDeposits[0].total || 0) - (savingsWithdrawals[0].total || 0);
  
  const totalAssets = totalShares + netSavings;

  // 3. Active Loan Portfolio
  const loansResult = await db.select({ total: sql`sum(${loans.principal})` }).from(loans).where(eq(loans.status, 'active')).execute();
  const loanPortfolio = loansResult[0].total || 0;

  // 4. Cash on Hand (Net Transactions)
  // For simplicity, we can reuse the transaction ledger or recalculate from primary sources.
  // Using transactions table is faster if it's kept in sync correctly.
  const incomeResult = await db.select({ total: sql`sum(${transactions.amount})` }).from(transactions).where(eq(transactions.type, 'income')).execute();
  const expenseResult = await db.select({ total: sql`sum(${transactions.amount})` }).from(transactions).where(eq(transactions.type, 'expense')).execute();
  const cashOnHand = (incomeResult[0].total || 0) - (expenseResult[0].total || 0);

  // 5. Recent Activity
  const recentActivity = await db.select()
    .from(transactions)
    .orderBy(desc(transactions.date)) // Secondary sort by ID would be good if schema supported createdAt
    .limit(5)
    .execute();

  const stats = {
    totalMembers,
    totalAssets,
    loanPortfolio,
    cashOnHand
  };

  return c.html(<DashboardHome stats={stats} recentActivity={recentActivity} />);
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