import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { listUserInterestGroups } from './admin-interest-groups.controller';

const router = Router();

router.use(authenticate, authorize('ADMIN'));
router.get('/', listUserInterestGroups);

export default router;
