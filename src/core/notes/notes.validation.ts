import { z } from 'zod';
import { isObjectIdOrHexString } from 'mongoose';

export const createNoteSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const noteIdSchema = z.string().refine((noteId) => isObjectIdOrHexString(noteId));

export const updateNoteSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    content: z.string().trim().min(1).optional(),
  })
  .refine((input) => input.title !== undefined || input.content !== undefined, {
    message: 'At least one field is required',
  });

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
