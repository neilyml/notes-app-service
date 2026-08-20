import mongoose from 'mongoose';
import { describe, it, expect } from 'vitest';

describe('MongoDB test container', () => {
  it('connects to MongoDB', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('can write and read data', async () => {
    const collection = mongoose.connection.collection('test');

    await collection.insertOne({
      message: 'hello',
    });

    const result = await collection.findOne({
      message: 'hello',
    });

    expect(result?.message).toBe('hello');
  });
});
