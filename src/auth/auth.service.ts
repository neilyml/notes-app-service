import bcrypt from 'bcrypt';

import { User } from '../users/user.model';
import type { RegisterInput } from './auth.validation';

const SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput) {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    email: input.email,
    passwordHash,
    interests: input.interests,
    role: 'USER',
  });

  return user;
}
