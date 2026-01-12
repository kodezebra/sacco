import { Hono } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { eq } from 'drizzle-orm';
import { users, sessions } from '../../db/schema';
import { verifyPassword, generateSessionId } from './utils';
import LoginPage from './Login';

const app = new Hono();

app.get('/login', (c) => {
  return c.html(<LoginPage />);
});

app.post('/login', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  const { identifier, password } = body;

  try {
    // 1. Find User
    const user = await db.select().from(users).where(eq(users.identifier, identifier)).get();
    
    if (!user) {
      return c.html(<LoginPage error="Invalid identifier or password." />, 401);
    }

    // 2. Verify Password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return c.html(<LoginPage error="Invalid identifier or password." />, 401);
    }

    // 3. Create Session
    const sessionId = generateSessionId();
    const expiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours

    await db.insert(sessions).values({
      id: sessionId,
      userId: user.id,
      expiresAt: expiresAt
    }).execute();

    // 4. Set Cookie
    setCookie(c, 'auth_session', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true, // Should be true in production
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60
    });

    return c.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return c.html(<LoginPage error="An internal error occurred. Please try again." />, 500);
  }
});

app.get('/logout', async (c) => {
  const db = c.get('db');
  const sessionId = getCookie(c, 'auth_session');

  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId)).execute();
    deleteCookie(c, 'auth_session');
  }

  return c.redirect('/auth/login');
});

export default app;
