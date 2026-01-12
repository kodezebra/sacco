import { getCookie, deleteCookie } from 'hono/cookie';
import { eq, and, gt } from 'drizzle-orm';
import { sessions, users } from '../../db/schema';

/**
 * Authentication Middleware
 * Protects routes and injects user context
 */
export const authMiddleware = async (c, next) => {
  const db = c.get('db');
  const sessionId = getCookie(c, 'auth_session');

  if (!sessionId) {
    return c.redirect('/auth/login');
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    
    // Find session and join with user
    const sessionData = await db.select({
      session: sessions,
      user: users
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.id, sessionId),
        gt(sessions.expiresAt, now),
        eq(users.status, 'active')
      )
    )
    .get();

    if (!sessionData) {
      // Invalid or expired session
      deleteCookie(c, 'auth_session');
      return c.redirect('/auth/login');
    }

    // Attach user to context for use in downstream routes
    c.set('user', sessionData.user);
    
    await next();
  } catch (error) {
    console.error('Middleware Auth Error:', error);
    return c.redirect('/auth/login');
  }
};

/**
 * Role-Based Access Control Middleware
 * @param {string[]} allowedRoles 
 */
export const roleGuard = (allowedRoles) => {
  return async (c, next) => {
    const user = c.get('user');
    
    if (!user || !allowedRoles.includes(user.role)) {
      return c.html(
        <div class="min-h-screen flex items-center justify-center bg-base-200">
          <div class="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-200">
            <h1 class="text-4xl font-black text-slate-900 mb-4">403</h1>
            <p class="text-slate-500 mb-6 font-medium">You do not have permission to access this area.</p>
            <a href="/dashboard" class="btn btn-primary rounded-xl px-8">Back to Safety</a>
          </div>
        </div>, 
        403
      );
    }
    
    await next();
  };
};
