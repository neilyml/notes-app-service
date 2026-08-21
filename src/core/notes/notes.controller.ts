import type { Request, Response } from 'express';

import { ApiError } from '../../shared/api-error';
import {
  deleteNoteByUser,
  findNoteByUser,
  findNotesByUser,
  saveNote,
  updateNoteByUser,
} from './notes.service';
import {
  createNoteSchema,
  noteIdSchema,
  paginationSchema,
  updateNoteSchema,
} from './notes.validation';

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

export async function getNote(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const noteId = noteIdSchema.parse(req.params.noteId);
  const note = await findNoteByUser(noteId, req.user.id);

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  res.status(200).json({
    id: note.id,
    userId: note.userId,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });
}

export async function updateNote(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const noteId = noteIdSchema.parse(req.params.noteId);
  const input = updateNoteSchema.parse(req.body);
  const note = await updateNoteByUser(noteId, req.user.id, input);

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  res.status(200).json({
    id: note.id,
    userId: note.userId,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });
}

export async function deleteNote(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const noteId = noteIdSchema.parse(req.params.noteId);
  const note = await deleteNoteByUser(noteId, req.user.id);

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  res.status(204).send();
}
