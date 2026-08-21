import { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { createUser, deleteUser, listUsers, updateUser } from './admin-users.controller';

const router = Router();

router.use(authenticate, authorize('ADMIN'));
router.get('/', listUsers);
router.post('/', createUser);
router.patch('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;
