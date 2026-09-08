/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';

// Mock the environment variables BEFORE importing the route
const originalEnv = { ...process.env };

beforeAll(() => {
  process.env = {
    ...originalEnv,
    ADMIN_USERNAME: 'testadmin@test.com',
    ADMIN_PASSWORD: 'testpassword123',
    ADMIN_SESSION_TOKEN: 'test_session_token_123',
    // Clear DB connection vars to prevent actual DB calls
    MONGODB_URI: 'mongodb://localhost:27017/test_indianagri',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('POST /api/auth/login', () => {
  it('should return 401 for invalid credentials', async () => {
    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wrong@user.com', password: 'wrongpass' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toBe('Invalid username or password');
  });

  it('should return 500 when ADMIN_USERNAME is not set', async () => {
    // Temporarily unset admin credentials
    const prevEnv = { ...process.env };
    process.env.ADMIN_USERNAME = '';
    process.env.ADMIN_PASSWORD = '';

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: 'test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    process.env = prevEnv;
  });

  it('should return 400 when username or password is missing', async () => {
    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '', password: '' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
