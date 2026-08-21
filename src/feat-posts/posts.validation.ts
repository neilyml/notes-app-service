import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
});

export const postsPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type PostsPagination = z.infer<typeof postsPaginationSchema>;
