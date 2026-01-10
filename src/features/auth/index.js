import { Hono } from 'hono';
import LoginPage from './Login';

const app = new Hono();

app.get('/login', (c) => {
  return c.html(<LoginPage />);
});

app.post('/login', async (c) => {
  // TODO: Implement actual authentication logic
  return c.redirect('/dashboard');
});

export default app;
