import cors from 'cors';
import express from 'express';

import { environment } from './configs/environment';
import { customPinoHttpLogger } from './middlewares/request-logger';

import adminInterestGroupsRoutes from './core/admin-interest-groups/admin-interest-groups.routes';
import adminNotesRoutes from './core/admin-notes/admin-notes.routes';
import adminUsersRoutes from './core/admin-users/admin-users.routes';
import authRoutes from './core/auth/auth.routes';
import notesRoutes from './core/notes/notes.routes';
import postsRoutes from './core/posts/posts.routes';
import userPostsRoutes from './core/user-posts/user-posts.routes';
import usersRoutes from './core/users/users.routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(cors({ origin: [environment.CORS_ORIGIN] }));
app.use(express.json());
app.use(customPinoHttpLogger);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin/user-interest-groups', adminInterestGroupsRoutes);
app.use('/api/v1/admin/notes', adminNotesRoutes);
app.use('/api/v1/admin/users', adminUsersRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/users', userPostsRoutes);
app.use('/api/v1/users', usersRoutes);

app.get('/api/v1/health', (_req, res) => {
  // Always return 200 for health instead of 304
  res.set('Cache-Control', 'no-store');

  res.status(200).json({ ok: true });
});

app.use(errorHandler);

export default app;
