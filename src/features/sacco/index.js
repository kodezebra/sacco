import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { sacco } from '../../db/schema';
import SaccoPage, { SaccoForm } from './Page';

const app = new Hono();

app.get('/', async (c) => {
  const db = c.get('db');
  let data;
  
  try {
    const result = await db.select().from(sacco).limit(1);
    data = result[0];
  } catch (e) {
    console.error(e);
  }

  // Fallback if DB is empty or fails
  if (!data) {
    data = { id: 'sacco-01', name: 'Pearl of Africa SACCO', createdAt: '2025-01-01' };
  }
  
  return c.html(<SaccoPage sacco={data} />);
});

app.put('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.parseBody();
  
  const updateData = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    address: body.address,
    currency: body.currency,
    defaultInterestRate: parseFloat(body.defaultInterestRate || '0'),
    defaultLoanDuration: parseInt(body.defaultLoanDuration || '6'),
    sharePrice: parseInt(body.sharePrice || '0'),
    registrationFee: parseInt(body.registrationFee || '0'),
    createdAt: body.createdAt
  };

  // Update DB
  await db.update(sacco)
    .set(updateData)
    .where(eq(sacco.id, 'sacco-01'))
    .execute();

  // Return ONLY the updated form component with success state
  return c.html(<SaccoForm sacco={updateData} success={true} />);
});

export default app;