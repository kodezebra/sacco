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

app.post('/contact', async (c) => {
  const body = await c.req.parseBody();
  console.log('Contact Inquiry:', body);
  
  // Return a success fragment that replaces the form
  return c.html(
    <div class="p-16 text-center animate-fadeIn">
       <div class="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
       </div>
       <h3 class="text-3xl font-black text-slate-900 mb-2">Message Sent!</h3>
       <p class="text-slate-500 max-w-xs mx-auto">Thank you, {body.fullName}. We've received your inquiry and our team will be in touch shortly.</p>
       <button 
         onclick="window.location.reload()" 
         class="mt-8 text-primary font-bold hover:underline"
       >
         Send another message
       </button>
    </div>
  );
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
