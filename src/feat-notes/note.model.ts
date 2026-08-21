import { Schema, model } from 'mongoose';

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

noteSchema.index({ userId: 1, createdAt: -1, _id: -1 });
noteSchema.index({ createdAt: -1, _id: -1 });

export const Note = model('Note', noteSchema);
