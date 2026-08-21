import type { Request, Response } from 'express';

import { ApiError } from '../shared/api-error';
import { getCurrentUser } from './users.service';

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const user = await getCurrentUser(req.user.id);

  res.status(200).json({
    id: user.id,
    email: user.email,
    role: user.role,
    interests: user.interests,
  });
}
