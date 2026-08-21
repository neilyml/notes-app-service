import type { Request, Response } from 'express';

import { ApiError } from '../../shared/api-error';
import { findUserWithPosts } from './user-posts.service';
import { userPostsUserIdSchema } from './user-posts.validation';

export async function getUserPosts(req: Request, res: Response): Promise<void> {
  const userId = userPostsUserIdSchema.parse(req.params.userId);
  const user = await findUserWithPosts(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(user);
}
