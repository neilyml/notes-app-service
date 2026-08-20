import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
  interests: z.array(z.string().min(1)).default([]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
