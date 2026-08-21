import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { listAllNotes } from './admin-notes.controller';

const router = Router();

router.use(authenticate, authorize('ADMIN'));
router.get('/', listAllNotes);

export default router;
