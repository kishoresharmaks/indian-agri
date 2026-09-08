/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';

const originalEnv = { ...process.env };

beforeAll(() => {
  process.env = {
    ...originalEnv,
    ADMIN_USERNAME: 'testadmin@test.com',
    ADMIN_PASSWORD: 'testpassword123',
    ADMIN_SESSION_TOKEN: 'secure_test_session_token_123',
    MONGODB_URI: 'mongodb://localhost:27017/test_indianagri',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('GET /api/orders authentication', () => {
  it('should return 401 Unauthorized when no admin session token cookie is provided', async () => {
    const { GET } = await import('./route');
    const request = new NextRequest('http://localhost/api/orders', {
      method: 'GET',
    });

    const response = await GET(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('Admin session required');
  });

  it('should return 401 Unauthorized when an invalid admin token is provided', async () => {
    const { GET } = await import('./route');
    const request = new NextRequest('http://localhost/api/orders', {
      method: 'GET',
      headers: {
        cookie: '__Host-admin_token=fake_invalid_token',
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});
