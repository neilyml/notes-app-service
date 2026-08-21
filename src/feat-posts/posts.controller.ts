import type { Request, Response } from 'express';

import { ApiError } from '../shared/api-error';
import { findPosts, savePost } from './posts.service';
import { createPostSchema, postsPaginationSchema } from './posts.validation';

export async function createPost(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const input = createPostSchema.parse(req.body);
  const post = await savePost(req.user.id, input);

  res.status(201).json({
    id: post.id,
    userId: post.userId,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  });
}

export async function listPosts(req: Request, res: Response): Promise<void> {
  const pagination = postsPaginationSchema.parse(req.query);
  const result = await findPosts(pagination);

  res.status(200).json({
    data: result.posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })),
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: result.total,
      pages: Math.ceil(result.total / pagination.limit),
    },
  });
}
