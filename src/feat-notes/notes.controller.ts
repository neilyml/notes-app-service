import type { Request, Response } from 'express';

import { ApiError } from '../shared/api-error';
import { findNotesByUser, saveNote } from './notes.service';
import { createNoteSchema, paginationSchema } from './notes.validation';

export async function createNote(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const input = createNoteSchema.parse(req.body);
  const note = await saveNote(req.user.id, input);

  res.status(201).json({
    id: note.id,
    userId: note.userId,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });
}

export async function listNotes(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const pagination = paginationSchema.parse(req.query);
  const result = await findNotesByUser(req.user.id, pagination);

  res.status(200).json({
    data: result.notes.map((note) => ({
      id: note.id,
      userId: note.userId,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })),
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: result.total,
      pages: Math.ceil(result.total / pagination.limit),
    },
  });
}
