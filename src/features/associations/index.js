import { Hono } from 'hono';
import Page from './Home';

const app = new Hono();

app.get('/', (c) => {
  return c.html(<Page />);
});

export default app;
