# Authentication & Authorization System

## Overview
This document outlines the security architecture for the SACCO management system. The system uses a multi-role, session-based SSR (Server Side Rendering) authentication model designed to handle users with varying levels of digital literacy.

---

## User Identity & Registration
Users are identified by a unique **Identifier** (Email or Phone Number).

### 1. Registration Flow (Staff-Only)
- **Closed System**: To maintain security, public registration is disabled.
- **Administrative Action**: Accounts are created by a **Super Admin** within the Staff Management module.
- **Creation Process**:
  1. Admin selects an existing Staff record.
  2. Admin assigns an identifier and a temporary password.
  3. System hashes the password and creates a record in the `users` table linked to the `staff_id`.

### 2. Bootstrapping the First Admin
To resolve the "Chicken and Egg" problem (needing an admin to create users), the system supports **First User Bootstrapping**:
- **Empty State Detection**: If the `users` table is empty, the system allows a one-time setup of the primary **Super Admin** account.
- **Seeding**: Alternatively, a default admin can be injected via the `seed.sql` script during database initialization.

---

## Technical Workflow (SSR)

### 1. The Login Flow (Server-Side)
1. **Request**: User submits the login form (`POST /auth/login`).
2. **Lookup**: The server queries the `users` table for the matching identifier.
3. **Verify**: The server hashes the provided password and compares it with the stored hash.
4. **Session Creation**:
   - A cryptographically secure random `session_id` is generated.
   - A record is created in the `sessions` table.
5. **Cookie Injection**: The server sends a response with a `Set-Cookie` header:
   - `auth_session=[session_id]`
   - `HttpOnly`: Prevents JS access.
   - `Secure`: HTTPS only.
   - `SameSite=Lax`: Balances security and UX.
6. **Redirect**: User is redirected to `/dashboard`.

### 2. Authorization Middleware (The Gatekeeper)
Every request to `/dashboard/*` is intercepted by a Hono middleware:
1. **Cookie Check**: Reads the `auth_session` cookie.
2. **DB Validation**: Checks if the ID exists in the `sessions` table and is not expired.
3. **User Injection**: Fetches the associated `user` object and attaches it to the request context (`c.set('user', user)`).
4. **Failure Handling**: If invalid, the user is redirected back to `/auth/login` with an error message.

### 3. Role-Based Access Control (RBAC)
Inside specific dashboard routes, we enforce role limits:
```javascript
const user = c.get('user');
if (user.role !== 'super_admin') {
  return c.html(<UnauthorizedPage />, 403);
}
```

---

## Session Lifecycle
- **Duration**: Sessions last 24 hours.
- **Logout**: A `POST /auth/logout` request deletes the DB record and clears the client cookie.
- **Revocation**: Deleting a record from the `sessions` table instantly logs that user out across all devices.

---

## Validation & Security Logic
- **Form Validation**: Using `zod` schema validation on the server before processing any auth request.
- **Rate Limiting**: (Planned) Prevent brute-force attacks by limiting login attempts per IP/Identifier.
- **SSR Advantage**: Since no tokens are stored in `localStorage`, the app is significantly more resistant to XSS attacks.
