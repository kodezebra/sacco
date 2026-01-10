import { Hono } from 'hono';
import MembersPage from './List';
import MemberDetailPage from './Detail';

const app = new Hono();

// Mock data
const mockMembers = [
  { id: '1', fullName: 'John Doe', phone: '0700123456', memberNumber: 'M001', status: 'active', createdAt: '2025-01-01' },
  { id: '2', fullName: 'Jane Smith', phone: '0700654321', memberNumber: 'M002', status: 'active', createdAt: '2025-01-05' },
];

app.get('/', (c) => {
  return c.html(<MembersPage members={mockMembers} />);
});

app.get('/:id', (c) => {
  const id = c.req.param('id');
  const member = mockMembers.find(m => m.id === id);
  return c.html(<MemberDetailPage member={member} />);
});

export default app;
