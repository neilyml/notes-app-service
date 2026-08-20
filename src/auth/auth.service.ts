import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../users/user.model';
import { ApiError } from '../shared/api-error';
import { environment } from '../configs/environment';
import type { RegisterInput, LoginInput } from './auth.validation';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRES_IN = '1h';
const INVALID_CREDENTIALS = 'Invalid email or password';

export async function registerUser(input: RegisterInput) {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  return User.create({
    email: input.email,
    passwordHash,
    interests: input.interests,
    role: 'USER',
  });
}

export async function loginUser(input: LoginInput): Promise<string> {
  const user = await User.findOne({ email: input.email }).select('+passwordHash');

  if (!user) {
    throw new ApiError(401, INVALID_CREDENTIALS);
  }

  const matches = await bcrypt.compare(input.password, user.passwordHash);

  if (!matches) {
    throw new ApiError(401, INVALID_CREDENTIALS);
  }

  return jwt.sign({ role: user.role }, environment.JWT_SECRET, {
    subject: user._id.toString(),
    expiresIn: TOKEN_EXPIRES_IN,
  });
}
