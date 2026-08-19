import request from 'supertest';
import { describe, it, expect } from 'vitest';

import app from '../../src/app';

describe('GET /api/v1health', () => {
  it('returns 200 and the API status', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ok: true,
    });
  });
});
