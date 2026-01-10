import { Hono } from 'hono';
import DashboardHome from './Page';
import members from '../members';
import loans from '../loans';
import transactions from '../transactions';
import shares from '../shares';
import associations from '../associations';
import staff from '../staff';
import payroll from '../payroll';
import reports from '../reports';
import sacco from '../sacco';

const app = new Hono();

// Dashboard Home
app.get('/', (c) => {
  return c.html(<DashboardHome />);
});

// Mount Sub-features
app.route('/members', members);
app.route('/loans', loans);
app.route('/transactions', transactions);
app.route('/shares', shares);
app.route('/associations', associations);
app.route('/staff', staff);
app.route('/payroll', payroll);
app.route('/reports', reports);
app.route('/sacco', sacco);

export default app;