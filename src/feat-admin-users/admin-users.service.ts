import bcrypt from 'bcrypt';
import { mongo } from 'mongoose';

import { ApiError } from '../shared/api-error';
import { User } from '../users/user.model';
import type {
  AdminUsersPagination,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from './admin-users.validation';

const SALT_ROUNDS = 12;

function handleDuplicateEmail(error: unknown): never {
  if (error instanceof mongo.MongoServerError && error.code === 11000) {
    throw new ApiError(409, 'Email already exists');
  }

  throw error;
}

export async function findUsers(pagination: AdminUsersPagination) {
  const skip = (pagination.page - 1) * pagination.limit;

  const [users, total] = await Promise.all([
    User.find()
      .select('email role interests')
      .sort({ email: 1 })
      .skip(skip)
      .limit(pagination.limit),
    User.countDocuments(),
  ]);

  return { users, total };
}

export async function createUserByAdmin(input: CreateAdminUserInput) {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  try {
    return await User.create({
      email: input.email,
      passwordHash,
      role: input.role,
      interests: input.interests,
    });
  } catch (error) {
    handleDuplicateEmail(error);
  }
}

export async function updateUserByAdmin(userId: string, input: UpdateAdminUserInput) {
  const updates: Record<string, unknown> = {};

  if (input.email !== undefined) updates.email = input.email;
  if (input.role !== undefined) updates.role = input.role;
  if (input.interests !== undefined) updates.interests = input.interests;
  if (input.password !== undefined) {
    updates.passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  } catch (error) {
    handleDuplicateEmail(error);
  }
}

export async function deleteUserByAdmin(userId: string): Promise<void> {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
}
