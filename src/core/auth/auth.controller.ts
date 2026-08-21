import type { Request, Response } from 'express';

import { registerSchema, loginSchema } from './auth.validation';
import { registerUser, loginUser } from './auth.service';

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
  const input = loginSchema.parse(req.body);

  const accessToken = await loginUser(input);

  res.status(200).json({ accessToken });
}
