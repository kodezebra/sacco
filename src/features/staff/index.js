import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { staff, associations, users, members } from '../../db/schema';
import StaffPage from './Page';
import NewStaffForm from './NewForm';
import EditStaffForm from './EditForm';
import BulkStaffHirePage from './BulkForm';
import UserForm from './UserForm';
import UserEditForm from './UserEditForm';
import { roleGuard } from '../auth/middleware';
import { createStaffSchema, updateStaffSchema, createUserSchema, updateUserSchema } from './validation';
import { zValidator } from '@hono/zod-validator';
import { hashPassword } from '../auth/utils';

const app = new Hono();

// 1. List Staff
app.get('/', async (c) => {
  const db = c.get('db');
  
  // Fetch staff with association names and check if they have accounts
  const allStaff = await db.select({
    id: staff.id,
    fullName: staff.fullName,
    role: staff.role,
    salary: staff.salary,
    status: staff.status,
    associationId: staff.associationId,
    unitName: associations.name
  })
  .from(staff)
  .leftJoin(associations, eq(staff.associationId, associations.id))
  .orderBy(desc(staff.status))
  .execute();

  const allUsers = await db.select().from(users).execute();
  const usersMap = new Map(allUsers.map(u => [u.staffId, u]));

  const staffWithAccountStatus = allStaff.map(s => ({
    ...s,
    hasAccount: usersMap.has(s.id),
    accountRole: usersMap.get(s.id)?.role
  }));

  return c.html(<StaffPage staff={staffWithAccountStatus} currentUser={c.get('user')} />);
});

// 2. Bulk Hiring Routes
app.get('/bulk', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const activeAssocs = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
  const allMembers = await db.select().from(members).where(eq(members.status, 'active')).execute();
  return c.html(<BulkStaffHirePage associations={activeAssocs} members={allMembers} />);
});

app.post('/bulk', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  const hires = [];
  const regex = /^hires\[(\d+)\]\[(\w+)\]$/;
  
  for (const [key, value] of Object.entries(body)) {
    const match = key.match(regex);
    if (match) {
      const index = parseInt(match[1]);
      const field = match[2];
      if (!hires[index]) hires[index] = {};
      hires[index][field] = value;
    }
  }

  const validHires = hires.filter(h => h && h.fullName && h.role && h.associationId && h.salary);
  if (validHires.length === 0) return c.redirect('/dashboard/staff/bulk');

  try {
    const ops = validHires.map(h => {
        return db.insert(staff).values({
            id: `stf_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            fullName: h.fullName,
            role: h.role,
            associationId: h.associationId,
            salary: parseInt(h.salary),
            status: 'active'
        }).execute();
    });
    await Promise.all(ops);

    c.header('HX-Trigger', JSON.stringify({ showMessage: { message: `Successfully hired ${validHires.length} staff members!`, type: 'success' } }));
    return c.redirect('/dashboard/staff');
  } catch (e) {
    console.error(e);
    return c.redirect('/dashboard/staff/bulk');
  }
});

// 3. Single Create (Modal)
app.get('/new', roleGuard(['super_admin', 'admin', 'manager']), async (c) => {
  const db = c.get('db');
  const activeAssocs = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
  return c.html(<NewStaffForm associations={activeAssocs} />);
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
