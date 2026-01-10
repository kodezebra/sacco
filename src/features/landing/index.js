import { Hono } from 'hono';
import LandingPage from './Page';
import AboutPage from './About';

const app = new Hono();

app.get('/', (c) => {
  return c.html(<LandingPage />);
});

app.get('/about', (c) => {
  return c.html(<AboutPage />);
});

export default app;
