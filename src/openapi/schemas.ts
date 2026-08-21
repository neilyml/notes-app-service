import { z } from 'zod';

import { USER_ROLES } from '../core/users/user.model';

const timestampSchema = z.iso.datetime();

export const errorResponseSchema = z.object({
  message: z.string(),
});

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  role: z.enum(USER_ROLES),
  interests: z.array(z.string()),
});

export const noteResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const postResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const paginationResponseSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  pages: z.number().int(),
});

export const notesListResponseSchema = z.object({
  data: z.array(noteResponseSchema),
  pagination: paginationResponseSchema,
});

export const postsListResponseSchema = z.object({
  data: z.array(postResponseSchema),
  pagination: paginationResponseSchema,
});

export const usersListResponseSchema = z.object({
  data: z.array(userResponseSchema),
  pagination: paginationResponseSchema,
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export const healthResponseSchema = z.object({
  ok: z.literal(true),
});

export const userPostsResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  posts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      createdAt: timestampSchema,
    }),
  ),
});

export const interestGroupsResponseSchema = z.array(
  z.object({
    interest: z.string(),
    users: z.array(
      z.object({
        id: z.string(),
        email: z.email(),
      }),
    ),
  }),
);
