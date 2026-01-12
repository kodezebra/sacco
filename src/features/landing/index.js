import { Hono } from 'hono';
import LandingPage from './Page';
import AboutPage from './About';
import ServicesPage from './Services';
import ContactPage from './Contact';
import PrivacyPage from './Privacy';
import TermsPage from './Terms';
import SecurityPage from './Security';

import { sacco } from '../../db/schema';

const app = new Hono();

app.get('/', (c) => {
  return c.html(<LandingPage />);
});

app.get('/about', (c) => {
  return c.html(<AboutPage />);
});

app.get('/services', (c) => {
  return c.html(<ServicesPage />);
});

app.get('/contact', async (c) => {
  const db = c.get('db');
  const saccoInfo = await db.select().from(sacco).limit(1).get();
  return c.html(<ContactPage sacco={saccoInfo} />);
});

app.get('/privacy', (c) => {
  return c.html(<PrivacyPage />);
});

app.get('/terms', (c) => {
  return c.html(<TermsPage />);
});

app.get('/security', (c) => {
  return c.html(<SecurityPage />);
});

export default app;
