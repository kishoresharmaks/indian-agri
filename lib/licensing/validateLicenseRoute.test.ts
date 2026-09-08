/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';

const originalEnv = { ...process.env };

beforeAll(() => {
  process.env = {
    ...originalEnv,
    LICENSING_SERVER_URL: 'https://nexusnation.in/',
    LICENSE_KEY: 'NEX-LIC-8036-516F-8943',
    ADMIN_SESSION_TOKEN: 'test_token',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('validateLicenseRequest', () => {
  it('should validate successfully for active license key NEX-LIC-8036-516F-8943', async () => {
    const { validateLicenseRequest } = await import('./validateLicenseRoute');
    const req = new NextRequest('http://localhost/api/billing/purchase');
    const result = await validateLicenseRequest(req);

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.status).toBe('ACTIVE');
    expect(result.daysRemaining).toBeGreaterThan(0);
  }, 25000);
});
