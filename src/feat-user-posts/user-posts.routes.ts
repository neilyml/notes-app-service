import { Router } from 'express';

import { getUserPosts } from './user-posts.controller';

const router = Router();

router.get('/:userId/posts', getUserPosts);

export default router;
