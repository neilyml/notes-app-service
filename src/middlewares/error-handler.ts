import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { ApiError } from '../shared/api-error';
import { isProduction } from '../configs/environment';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  req.log.error({ err }, 'request failed');

  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({
    message: isProduction ? 'Something went wrong' : err.message,
  });
};
