import { Hono } from 'hono';
import Page from './Page';

const app = new Hono();

app.get('/', (c) => {
  return c.html(<Page />);
});

export default app;
