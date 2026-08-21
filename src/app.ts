import express from 'express';
import { customPinoHttpLogger } from './middlewares/request-logger';

import authRoutes from './auth/auth.routes';
import usersRoutes from './feat-users/users.routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(express.json());
app.use(customPinoHttpLogger);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);

app.get('/api/v1/health', (_req, res) => {
  // Always return 200 for health instead of 304
  res.set('Cache-Control', 'no-store');

  res.status(200).json({ ok: true });
});

app.use(errorHandler);

export default app;
