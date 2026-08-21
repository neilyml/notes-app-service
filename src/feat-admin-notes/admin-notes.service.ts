import { Note } from '../feat-notes/note.model';
import type { AdminNotesPagination } from './admin-notes.validation';

export async function findAllNotes(pagination: AdminNotesPagination) {
  const skip = (pagination.page - 1) * pagination.limit;

  const [notes, total] = await Promise.all([
    Note.find().sort({ createdAt: -1, _id: -1 }).skip(skip).limit(pagination.limit),
    Note.countDocuments(),
  ]);

  return { notes, total };
}
