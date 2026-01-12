import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { staff, associations, users } from '../../db/schema';
import StaffList from './Page';
import NewStaffForm from './NewForm';
import EditStaffForm from './EditForm';
import UserForm from './UserForm';
import UserEditForm from './UserEditForm';
import { roleGuard } from '../auth/middleware';
import { hashPassword } from '../auth/utils';
import { createStaffSchema, updateStaffSchema, createUserSchema, updateUserSchema } from './validation';

const app = new Hono();

// 1. List All Staff
app.get('/', async (c) => {
  const db = c.get('db');
  const currentUser = c.get('user');
  
  const allAssociations = await db.select().from(associations).execute();
  const assocMap = new Map(allAssociations.map(a => [a.id, a]));

  const staffRaw = await db.select().from(staff).execute();
  
  const staffWithUnit = staffRaw.map(s => ({
    ...s,
    unitName: assocMap.get(s.associationId)?.name || 'Unknown Unit',
    unitType: assocMap.get(s.associationId)?.type || 'N/A'
  }));

  const staffIds = staffWithUnit.map(s => s.id);
  const existingUsers = await db.select().from(users).execute();
  const userMap = new Set(existingUsers.map(u => u.staffId));

  const staffFinal = staffWithUnit.map(s => ({
    ...s,
    hasAccount: userMap.has(s.id)
  }));

  return c.html(<StaffList staff={staffFinal} currentUser={currentUser} />);
});

// 2. New Staff Form
app.get('/new', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const activeAssociations = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
  return c.html(<NewStaffForm associations={activeAssociations} />);
});

// 3. Create Staff (Validated)
app.post('/', 
  roleGuard(['super_admin', 'admin', 'manager']), 
  zValidator('form', createStaffSchema, (result, c) => {
    if (!result.success) {
      return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
    }
  }),
  async (c) => {
    const db = c.get('db');
    const body = c.req.valid('form');
    const id = `staff_${Date.now()}`;
    
    await db.insert(staff).values({
      id,
      associationId: body.associationId,
      fullName: body.fullName,
      role: body.role,
      salary: body.salary,
      status: 'active'
    }).execute();
    
    return c.redirect('/dashboard/staff');
  }
);

// 4. Edit Form
app.get('/:id/edit', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  
  const employee = await db.select().from(staff).where(eq(staff.id, id)).get();
  if (!employee) return c.text('Staff not found', 404);
  
  const activeAssociations = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
  
  return c.html(<EditStaffForm staff={employee} associations={activeAssociations} />);
});

// 5. Update Staff (Validated)
app.post('/:id', 
  roleGuard(['super_admin', 'admin', 'manager']), 
  zValidator('form', updateStaffSchema, (result, c) => {
    if (!result.success) {
      return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
    }
  }),
  async (c) => {
    const db = c.get('db');
    const id = c.req.param('id');
    const body = c.req.valid('form');
    
    await db.update(staff).set({
      fullName: body.fullName,
      role: body.role,
      salary: body.salary,
      associationId: body.associationId,
      status: body.status
    }).where(eq(staff.id, id)).execute();
    
    return c.redirect('/dashboard/staff');
  }
);

// 6. User Account Form
app.get('/:id/user', roleGuard(['super_admin', 'admin']), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const employee = await db.select().from(staff).where(eq(staff.id, id)).get();
  if (!employee) return c.text('Staff not found', 404);

  const existingUser = await db.select().from(users).where(eq(users.staffId, id)).get();
  if (existingUser) return c.text('User account already exists for this staff member.', 400);

  return c.html(<UserForm staff={employee} />);
});

// 7. Create User Account (Validated)
app.post('/:id/user', 
  roleGuard(['super_admin', 'admin']), 
  zValidator('form', createUserSchema, (result, c) => {
    if (!result.success) {
      return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
    }
  }),
  async (c) => {
    const db = c.get('db');
    const staffId = c.req.param('id');
    const body = c.req.valid('form');
    const { identifier, password, role } = body;

    const hashedPassword = await hashPassword(password);
    const userId = `user_${Date.now()}`;

    try {
      await db.insert(users).values({
        id: userId,
        staffId: staffId,
        identifier: identifier,
        password: hashedPassword,
        role: role,
        status: 'active'
      }).execute();
    } catch (e) {
      return c.text('Error creating user. Identifier might already be in use.', 400);
    }

    return c.redirect('/dashboard/staff');
  }
);

// 8. Edit User Account Form
app.get('/:id/user/edit', roleGuard(['super_admin', 'admin']), async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');

  const employee = await db.select().from(staff).where(eq(staff.id, id)).get();
  if (!employee) return c.text('Staff not found', 404);

  const existingUser = await db.select().from(users).where(eq(users.staffId, id)).get();
  if (!existingUser) return c.text('User account does not exist for this staff member.', 404);

  return c.html(<UserEditForm staff={employee} user={existingUser} />);
});

// 9. Update User Account (Validated)
app.post('/:id/user/update', 
  roleGuard(['super_admin', 'admin']), 
  zValidator('form', updateUserSchema, (result, c) => {
    if (!result.success) {
      return c.text('Validation Error: ' + result.error.issues.map(i => i.message).join(', '), 400);
    }
  }),
  async (c) => {
    const db = c.get('db');
    const staffId = c.req.param('id');
    const body = c.req.valid('form');
    const { role, password } = body;

    const updateData = { role };

    if (password) {
      updateData.password = await hashPassword(password);
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.staffId, staffId))
      .execute();

    return c.redirect('/dashboard/staff');
  }
);

// 10. Revoke/Delete User Account
app.post('/:id/user/delete', roleGuard(['super_admin', 'admin']), async (c) => {
  const db = c.get('db');
  const staffId = c.req.param('id');

  await db.delete(users).where(eq(users.staffId, staffId)).execute();

  return c.redirect('/dashboard/staff');
});

export default app;
