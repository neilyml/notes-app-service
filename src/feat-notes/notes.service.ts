import { Note } from './note.model';
import type { CreateNoteInput, PaginationInput } from './notes.validation';

export async function saveNote(userId: string, input: CreateNoteInput) {
  return Note.create({
    userId,
    title: input.title,
    content: input.content,
  });
}

export async function findNotesByUser(userId: string, pagination: PaginationInput) {
  const skip = (pagination.page - 1) * pagination.limit;

  const [notes, total] = await Promise.all([
    Note.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(pagination.limit),
    Note.countDocuments({ userId }),
  ]);

  return {
    notes,
    total,
  };
}
