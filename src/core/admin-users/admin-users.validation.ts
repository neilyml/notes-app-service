import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

import { USER_ROLES } from '../users/user.model';

const passwordSchema = z.string().min(8).max(128);
const interestsSchema = z.array(z.string().trim().min(1));

export const adminUsersPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const userIdSchema = z.string().refine((userId) => isObjectIdOrHexString(userId));

export const createAdminUserSchema = z.object({
  email: z.email(),
  password: passwordSchema,
  role: z.enum(USER_ROLES),
  interests: interestsSchema.default([]),
});

export const updateAdminUserSchema = z
  .object({
    email: z.email().optional(),
    password: passwordSchema.optional(),
    role: z.enum(USER_ROLES).optional(),
    interests: interestsSchema.optional(),
  })
  .refine(
    (input) =>
      input.email !== undefined ||
      input.password !== undefined ||
      input.role !== undefined ||
      input.interests !== undefined,
    { message: 'At least one field is required' },
  );

export type AdminUsersPagination = z.infer<typeof adminUsersPaginationSchema>;
export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
