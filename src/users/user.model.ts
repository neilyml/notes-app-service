import { Schema, model } from 'mongoose';

export const USER_ROLES = ['USER', 'ADMIN'] as const;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: 'USER',
      required: true,
    },

    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });

export const User = model('User', userSchema);
