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

describe('POST /api/products authentication', () => {
  it('should return 401 Unauthorized when no admin session token cookie is provided', async () => {
    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacked Product',
        description: 'Test',
        image: 'test.jpg',
        mrp: 100,
        price: 80,
        quantity: 10,
        gst: 5,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('Admin session required');
  });
});
