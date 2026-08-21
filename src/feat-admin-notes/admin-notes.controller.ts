import type { Request, Response } from 'express';

import { findAllNotes } from './admin-notes.service';
import { adminNotesPaginationSchema } from './admin-notes.validation';

export async function listAllNotes(req: Request, res: Response): Promise<void> {
  const pagination = adminNotesPaginationSchema.parse(req.query);
  const result = await findAllNotes(pagination);

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
