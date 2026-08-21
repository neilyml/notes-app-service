import { ApiError } from '../../shared/api-error';
import { User } from './user.model';

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId).select('email role interests');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
}
