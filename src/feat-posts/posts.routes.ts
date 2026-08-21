import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate';
import { createPost, listPosts } from './posts.controller';

const router = Router();

router.get('/', listPosts);
router.post('/', authenticate, createPost);

export default router;
