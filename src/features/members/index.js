import { Hono } from 'hono';
import { like, or, eq, desc } from 'drizzle-orm';
import { members } from '../../db/schema';
import MembersPage, { MembersTable, MemberRow } from './List';
import NewMemberForm from './NewForm';
import MemberDetailPage from './Detail';
import { Toast } from '../../components/Toast';

const app = new Hono();

const getMembers = async (db, search = '') => {
  let query = db.select().from(members);
  
  if (search) {
    const searchPattern = `%${search}%`;
    query = query.where(
      or(
        like(members.fullName, searchPattern),
        like(members.phone, searchPattern),
        like(members.memberNumber, searchPattern)
      )
    );
  }
  
  return await query.orderBy(desc(members.createdAt)).execute();
};

app.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search') || '';
  const isHtmx = c.req.header('hx-request');

  const data = await getMembers(db, search);

  if (isHtmx) {
    return c.html(<MembersTable members={data} />);
  }

  return c.html(<MembersPage members={data} search={search} />);
});

app.get('/new', (c) => {
  return c.html(<NewMemberForm />);
});

app.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  
  const newMember = {
    id: `mbr_${Math.random().toString(36).substring(2, 9)}`,
    saccoId: 'sacco-01',
    fullName: body.fullName,
    phone: body.phone,
    address: body.address,
    nextOfKinName: body.nextOfKinName,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'active',
    memberNumber: `MBR${Math.floor(1000 + Math.random() * 9000)}`, 
  };

  await db.insert(members).values(newMember).execute();

  return c.html(
    <>
      <MemberRow member={newMember} />
      <Toast message={`${newMember.fullName} added successfully`} />
      <script>document.getElementById('htmx-modal').close()</script>
    </>
  );
});

app.get('/export', async (c) => {
  const db = c.get('db');
  const data = await db.select().from(members).execute();

  const headers = ['ID', 'Full Name', 'Phone', 'Member Number', 'Status', 'Joined Date', 'Address', 'Next of Kin'];
  const rows = data.map(m => [
    m.id,
    `"${m.fullName}"`,
    m.phone,
    m.memberNumber,
    m.status,
    m.createdAt,
    `"${m.address || ''}"`,
    `"${m.nextOfKinName || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  return c.text(csvContent, 200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename="members_list.csv"',
  });
});

app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  const member = result[0];

  if (!member) {
     return c.text('Member not found', 404);
  }

  return c.html(<MemberDetailPage member={member} />);
});

app.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  
  try {
    await db.delete(members).where(eq(members.id, id)).execute();
  } catch (e) {
    console.error('Failed to delete member:', e);
    return c.text('Failed to delete member', 500);
  }

  return c.body(null, 200);
});

export default app;
