import { Hono } from 'hono';
import LandingPage from './Page';
import AboutPage from './About';
import ServicesPage from './Services';
import ContactPage from './Contact';

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

app.get('/contact', (c) => {
  return c.html(<ContactPage />);
});

export default app;
