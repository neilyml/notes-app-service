import type { Request, Response } from 'express';

import {
  createUserByAdmin,
  deleteUserByAdmin,
  findUsers,
  updateUserByAdmin,
} from './admin-users.service';
import {
  adminUsersPaginationSchema,
  createAdminUserSchema,
  updateAdminUserSchema,
  userIdSchema,
} from './admin-users.validation';

export async function listUsers(req: Request, res: Response): Promise<void> {
  const pagination = adminUsersPaginationSchema.parse(req.query);
  const result = await findUsers(pagination);

  res.status(200).json({
    data: result.users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      interests: user.interests,
    })),
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: result.total,
      pages: Math.ceil(result.total / pagination.limit),
    },
  });
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const input = createAdminUserSchema.parse(req.body);
  const user = await createUserByAdmin(input);

  res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
    interests: user.interests,
  });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const userId = userIdSchema.parse(req.params.userId);
  const input = updateAdminUserSchema.parse(req.body);
  const user = await updateUserByAdmin(userId, input);

  res.status(200).json({
    id: user.id,
    email: user.email,
    role: user.role,
    interests: user.interests,
  });
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const userId = userIdSchema.parse(req.params.userId);

  await deleteUserByAdmin(userId);

  res.status(204).send();
}
