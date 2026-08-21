import { isObjectIdOrHexString } from 'mongoose';
import { z } from 'zod';

export const userPostsUserIdSchema = z.string().refine((userId) => isObjectIdOrHexString(userId));
