import type { Request, Response } from 'express';

import { registerSchema, loginSchema } from './auth.validation';
import { registerUser, loginUser } from './auth.service';
import { ApiError } from '../shared/api-error';

export async function register(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);

  const user = await registerUser(input);

  res.status(201).json({
    id: user._id,
    email: user.email,
    role: user.role,
    interests: user.interests,
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, 'Invalid request body');
  }

  const accessToken = await loginUser(parsed.data);

  res.status(200).json({ accessToken });
}
