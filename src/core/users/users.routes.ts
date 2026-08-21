import { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate';
import { getMe } from './users.controller';

const router = Router();

router.get('/me', authenticate, getMe);

export default router;
