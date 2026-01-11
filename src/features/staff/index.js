import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { staff, associations } from '../../db/schema';
import StaffList from './Page';
import NewStaffForm from './NewForm';
import EditStaffForm from './EditForm';

const app = new Hono();

// 1. List All Staff
app.get('/', async (c) => {
  const db = c.get('db');
  
  // Join staff with associations to get unit names
  // We fetch all associations and map them in JS (efficient enough for small datasets).
  const allAssociations = await db.select().from(associations).execute();
  const assocMap = new Map(allAssociations.map(a => [a.id, a]));

  const staffRaw = await db.select().from(staff).execute();
  
  const staffWithUnit = staffRaw.map(s => ({
    ...s,
    unitName: assocMap.get(s.associationId)?.name || 'Unknown Unit',
    unitType: assocMap.get(s.associationId)?.type || 'N/A'
  }));

  return c.html(<StaffList staff={staffWithUnit} />);
});

// 2. New Staff Form
app.get('/new', async (c) => {
  const db = c.get('db');
  const activeAssociations = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
  return c.html(<NewStaffForm associations={activeAssociations} />);
});

// 3. Create Staff
app.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  const id = `staff_${Date.now()}`;
  
  await db.insert(staff).values({
    id,
    associationId: body.associationId,
    fullName: body.fullName,
    role: body.role,
    salary: parseInt(body.salary),
    status: 'active'
  }).execute();
  
  return c.redirect('/dashboard/staff');
});

// 4. Edit Form
app.get('/:id/edit', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  
  const employee = await db.select().from(staff).where(eq(staff.id, id)).get();
  if (!employee) return c.text('Staff not found', 404);
  
  const activeAssociations = await db.select().from(associations).where(eq(associations.status, 'active')).execute();
  
  return c.html(<EditStaffForm staff={employee} associations={activeAssociations} />);
});

// 5. Update Staff
app.post('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  
  await db.update(staff).set({
    fullName: body.fullName,
    role: body.role,
    salary: parseInt(body.salary),
    associationId: body.associationId,
    status: body.status
  }).where(eq(staff.id, id)).execute();
  
  return c.redirect('/dashboard/staff');
});

export default app;
