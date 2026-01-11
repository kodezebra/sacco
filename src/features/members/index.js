import { Hono } from 'hono';
import { like, or, eq, desc, sql } from 'drizzle-orm';
import { members, shares, savings, loans } from '../../db/schema';
import MembersPage, { MembersList, MemberRow } from './List';
import NewMemberForm from './NewForm';
import MemberDetailPage, { MemberDetailStats, MemberDetailSavingsTab, MemberDetailProfileForm } from './Detail';
import { Toast } from '../../components/Toast';
import DepositForm from './DepositForm';

const app = new Hono();

// Helper function to get members with pagination
const getMembers = async (db, search = '', page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  let query = db.select().from(members);
  let countQuery = db.select({ count: sql`count(*)` }).from(members);

  if (search) {
    const searchPattern = `%${search}%`;
    const whereClause = or(like(members.fullName, searchPattern), like(members.phone, searchPattern), like(members.memberNumber, searchPattern));
    query = query.where(whereClause);
    countQuery = countQuery.where(whereClause);
  }

  const data = await query.orderBy(desc(members.createdAt)).limit(limit).offset(offset).execute();
  const totalResult = await countQuery.execute();
  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / limit);

  return { data, total, page, totalPages };
};

// GET / ... Main members list
app.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search') || '';
  const page = parseInt(c.req.query('page') || '1');
  const { data, totalPages } = await getMembers(db, search, page);

  if (c.req.header('hx-request')) {
    return c.html(<MembersList members={data} page={page} totalPages={totalPages} search={search} />);
  }
  return c.html(<MembersPage members={data} page={page} totalPages={totalPages} search={search} />);
});

// GET /new ... Form for creating a new member
app.get('/new', (c) => {
  return c.html(<NewMemberForm />);
});

// POST / ... Create a new member
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
  c.header('HX-Trigger', 'closeModal');
  return c.html(
    <>
      <MemberRow member={newMember} />
      <Toast message={`${newMember.fullName} added successfully`} />
    </>
  );
});

// GET /export ... CSV export
app.get('/export', async (c) => {
  const db = c.get('db');
  const data = await db.select().from(members).execute();
  const headers = ['ID', 'Full Name', 'Phone', 'Member Number', 'Status', 'Joined Date', 'Address', 'Next of Kin'];
  const rows = data.map(m => [ m.id, `"${m.fullName}"`, m.phone, m.memberNumber, m.status, m.createdAt, `"${m.address || ''}"`, `"${m.nextOfKinName || ''}"` ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  return c.text(csvContent, 200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename="members_list.csv"',
  });
});

// GET /:id/deposit ... Serves the deposit form
app.get('/:id/deposit', (c) => {
  const memberId = c.req.param('id');
  return c.html(<DepositForm memberId={memberId} />);
});

// POST /:id/savings ... Handles the savings deposit
app.post('/:id/savings', async (c) => {
  const db = c.get('db');
  const memberId = c.req.param('id');
  const body = await c.req.parseBody();
  await db.insert(savings).values({
    id: `sav_${Math.random().toString(36).substring(2, 9)}`,
    memberId: memberId,
    type: 'deposit',
    amount: parseInt(body.amount),
    date: body.date,
  }).execute();

  // Re-fetch all data to return updated components
  const memberSavings = await db.select().from(savings).where(eq(savings.memberId, memberId)).execute();
  const memberLoans = await db.select().from(loans).where(eq(loans.memberId, memberId)).execute();
  const memberShares = await db.select().from(shares).where(eq(shares.memberId, memberId)).execute();

  const savingsBalance = memberSavings.reduce((acc, s) => s.type === 'deposit' ? acc + s.amount : acc - s.amount, 0);
  const loanBalance = memberLoans.filter(l => l.status === 'active').reduce((acc, l) => acc + l.principal, 0);
  const totalShares = memberShares.reduce((acc, s) => acc + s.amount, 0);
  const stats = { totalShares, savingsBalance, loanBalance };

  c.header('HX-Trigger', 'closeModal');
  return c.html(
    <>
      <MemberDetailStats id="member-stats-container" stats={stats} />
      <MemberDetailSavingsTab id="member-savings-history" savings={memberSavings} />
      <Toast message="Deposit recorded successfully!" />
    </>
  );
});

// GET /:id ... Member detail view
app.get('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  const member = result[0];
  if (!member) return c.text('Member not found', 404);

  const memberShares = await db.select().from(shares).where(eq(shares.memberId, id)).execute();
  const memberSavings = await db.select().from(savings).where(eq(savings.memberId, id)).execute();
  const memberLoans = await db.select().from(loans).where(eq(loans.memberId, id)).execute();
  
  const totalShares = memberShares.reduce((acc, s) => acc + s.amount, 0);
  const savingsBalance = memberSavings.reduce((acc, s) => s.type === 'deposit' ? acc + s.amount : acc - s.amount, 0);
  const loanBalance = memberLoans.filter(l => l.status === 'active').reduce((acc, l) => acc + l.principal, 0);
  const stats = { totalShares, savingsBalance, loanBalance };

  return c.html(<MemberDetailPage member={member} stats={stats} loans={memberLoans} savings={memberSavings} shares={memberShares} />);
});

// DELETE /:id ... Delete a member
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

// PUT /:id - Update member details
app.put('/:id', async (c) => {
  const db = c.get('db');
  const id = c.req.param('id');
  const body = await c.req.parseBody();

  const updatedMember = {
    fullName: body.fullName,
    phone: body.phone,
    address: body.address,
    nextOfKinName: body.nextOfKinName,
    nextOfKinPhone: body.nextOfKinPhone,
  };

  await db.update(members).set(updatedMember).where(eq(members.id, id)).execute();

  // Re-fetch the member to return updated data
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  const member = result[0];

  c.header('HX-Trigger', 'memberUpdated'); // Optional: trigger a custom event
  return c.html(
    <>
      <MemberDetailProfileForm id="member-profile-form" member={member} />
      <Toast message={`${member.fullName} updated successfully!`} />
    </>
  );
});

export default app;
