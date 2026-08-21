import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
