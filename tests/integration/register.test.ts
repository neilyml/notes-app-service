import bcrypt from 'bcrypt';
import request from 'supertest';
import { describe, it, expect } from 'vitest';

import app from '../../src/app';
import { User } from '../../src/core/users/user.model';

describe('POST /api/v1/auth/register', () => {
  it('registers a new user and hashes the password', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'user@example.com',
        password: 'password123',
        interests: ['reading', 'chess'],
      });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      email: 'user@example.com',
      role: 'USER',
      interests: ['reading', 'chess'],
    });

    expect(response.body.password).toBeUndefined();
    expect(response.body.passwordHash).toBeUndefined();

    const user = await User.findOne({
      email: 'user@example.com',
    }).select('+passwordHash');

    expect(user).not.toBeNull();
    expect(user!.passwordHash).not.toBe('password123');

    const matches = await bcrypt.compare('password123', user!.passwordHash);

    expect(matches).toBe(true);
  });

  it('returns 400 for invalid input', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'invalid-email',
      password: '123',
    });

    expect(response.status).toBe(400);
  });

  it('returns 500 when email already exists', async () => {
    const payload = {
      email: 'user@example.com',
      password: 'password123',
    };

    await request(app).post('/api/v1/auth/register').send(payload);

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(payload);

    expect(response.status).toBe(500);
  });
});
