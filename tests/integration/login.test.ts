import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';

import app from '../../src/app';

const credentials = {
  email: 'user@example.com',
  password: 'password123',
};

async function registerUser() {
  await request(app).post('/api/v1/auth/register').send(credentials);
}

describe('POST /api/v1/auth/login', () => {
  beforeEach(registerUser);

  it('returns 200 and an access token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(credentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');

    const payload = jwt.verify(
      response.body.accessToken,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;

    expect(payload.sub).toEqual(expect.any(String));
    expect(payload.role).toBe('USER');
  });

  it('returns a non-empty string token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(credentials);

    expect(typeof response.body.accessToken).toBe('string');
    expect(response.body.accessToken.length).toBeGreaterThan(0);
  });

  it('returns 401 for an incorrect password', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: credentials.email,
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid email or password' });
  });

  it('returns 401 for an unknown email', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'unknown@example.com',
      password: credentials.password,
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid email or password' });
  });

  it('returns the same error for an incorrect password and an unknown email', async () => {
    const wrongPassword = await request(app).post('/api/v1/auth/login').send({
      email: credentials.email,
      password: 'wrong-password',
    });

    const unknownEmail = await request(app).post('/api/v1/auth/login').send({
      email: 'unknown@example.com',
      password: credentials.password,
    });

    expect(wrongPassword.status).toBe(unknownEmail.status);
    expect(wrongPassword.body.message).toBe(unknownEmail.body.message);
  });

  it('returns 400 for an invalid request body', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'not-an-email',
      password: '',
    });

    expect(response.status).toBe(400);
  });
});
