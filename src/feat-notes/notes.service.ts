import { Note } from './note.model';
import type { CreateNoteInput, PaginationInput, UpdateNoteInput } from './notes.validation';

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

export async function findNoteByUser(noteId: string, userId: string) {
  return Note.findOne({
    _id: noteId,
    userId,
  });
}

export async function updateNoteByUser(noteId: string, userId: string, input: UpdateNoteInput) {
  return Note.findOneAndUpdate(
    {
      _id: noteId,
      userId,
    },
    { $set: input },
    { returnDocument: 'after' },
  );
}

export async function deleteNoteByUser(noteId: string, userId: string) {
  return Note.findOneAndDelete({
    _id: noteId,
    userId,
  });
}
