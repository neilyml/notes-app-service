import type { RequestHandler } from 'express';

import { ApiError } from '../shared/api-error';
import type { UserRole } from '../core/users/user.model';

export function authorize(requiredRole: UserRole): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (req.user.role !== requiredRole) {
      throw new ApiError(403, 'Forbidden');
    }

    next();
  };
}
