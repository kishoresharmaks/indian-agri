/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';

describe('GET /api/orders/track query sanitization', () => {
  it('should return 400 when query is empty or missing', async () => {
    const { GET } = await import('./route');
    const request = new NextRequest('http://localhost/api/orders/track?query=');

    const response = await GET(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should return 400 when query is less than 4 characters to prevent scraping', async () => {
    const { GET } = await import('./route');
    const request = new NextRequest('http://localhost/api/orders/track?query=a');

    const response = await GET(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('Search term is too short');
  });
});
