import express from 'express';
import { customPinoHttpLogger } from './middlewares/request-logger';

const app = express();

app.use(express.json());
app.use(customPinoHttpLogger);

app.get('/api/v1/health', (_req, res) => {
  // Always return 200 for health instead of 304
  res.set('Cache-Control', 'no-store');

  res.status(200).json({ ok: true });
});

export default app;
