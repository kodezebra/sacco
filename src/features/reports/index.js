import { Hono } from 'hono';
import ReportsPage from './Page';

const app = new Hono();

app.get('/', (c) => {
  return c.html(<ReportsPage />);
});

// Placeholder routes for specific reports
const placeholderHandler = (c) => {
  return c.html(
    <div class="p-10 text-center">
      <h1 class="text-2xl font-bold mb-4">Report Under Construction</h1>
      <p>This report logic will be implemented with D1 data.</p>
      <a href="/dashboard/reports" class="btn btn-primary mt-4">Back to Reports</a>
    </div>
  );
};

app.get('/:reportId', placeholderHandler);

export default app;
