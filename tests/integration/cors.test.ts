import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../src/app';

describe('CORS', () => {
  it('allows preflight requests from the configured origin', async () => {
    const response = await request(app)
      .options('/api/v1/auth/login')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type,authorization');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(response.headers['access-control-allow-methods']).toContain('POST');
    expect(response.headers['access-control-allow-headers']).toBe('content-type,authorization');
  });

  it('does not allow an unconfigured origin', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .set('Origin', 'https://untrusted.example.com');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
