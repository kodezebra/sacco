import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import landing from './features/landing';
import auth from './features/auth';
import dashboard from './features/dashboard';

const app = new Hono();

// Middleware to inject Drizzle DB into the context
app.use('*', async (c, next) => {
  // "DB" must match the binding name in your wrangler.toml
  const db = drizzle(c.env.DB);
  c.set('db', db);
  await next();
});

// Public routes
app.route('/', landing);
app.route('/auth', auth);

// Protected routes
app.route('/dashboard', dashboard);

export default app;
