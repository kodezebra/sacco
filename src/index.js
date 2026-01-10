import { Hono } from 'hono';
import landing from './features/landing';
import auth from './features/auth';
import dashboard from './features/dashboard';

const app = new Hono();

// Public routes
app.route('/', landing);
app.route('/auth', auth);

// Protected routes
app.route('/dashboard', dashboard);

export default app;
