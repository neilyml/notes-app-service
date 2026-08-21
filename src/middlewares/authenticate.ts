import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { environment } from '../configs/environment';
import { ApiError } from '../shared/api-error';
import { USER_ROLES, type UserRole } from '../core/users/user.model';

function unauthorized(): ApiError {
  return new ApiError(401, 'Unauthorized');
}

export const authenticate: RequestHandler = (req, _res, next) => {
  const authorization = req.get('Authorization');

  if (!authorization) {
    throw unauthorized();
  }

  const parts = authorization.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    throw unauthorized();
  }

  const token = parts[1];

  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, environment.JWT_SECRET);
  } catch {
    throw unauthorized();
  }

  if (
    typeof payload === 'string' ||
    typeof payload.sub !== 'string' ||
    typeof payload.role !== 'string' ||
    !USER_ROLES.includes(payload.role as UserRole)
  ) {
    throw unauthorized();
  }

  req.user = {
    id: payload.sub,
    role: payload.role as UserRole,
  };

  next();
};
