/**
 * Server-side license validation helper for API routes.
 *
 * Import this in any API route handler that needs license protection:
 *
 *   import { validateLicenseRequest } from '@/lib/licensing/validateLicenseRoute';
 *
 *   export async function POST(req: NextRequest) {
 *     const auth = isAuthenticatedAdmin(req);
 *     if (!auth) return unauthenticatedResponse();
 *
 *     const license = await validateLicenseRequest(req);
 *     if (license.error) return license.error;
 *
 *     // proceed — license.valid === true and license.status is available
 *   }
 *
 * This is the API-route equivalent of the client-side LicenseGate component.
 * Returns { valid: true, status, daysRemaining } on success.
 * Returns { valid: false, error: NextResponse } on failure.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLicensingServerUrl, getConfiguredLicenseKey } from './licenseClient';
import LicenseSetting, { ILicenseSetting } from '@/models/LicenseSetting';
import connectToDatabase from '@/lib/db';
import { getActiveDatabaseLicense } from './licenseDb';

export interface LicenseValidationResult {
  valid: boolean;
  status?: string;
  daysRemaining?: number;
  error?: NextResponse;
}

interface CachedValidation {
  result: LicenseValidationResult;
  timestamp: number;
}

let validationCache: CachedValidation | null = null;
const CACHE_TTL_MS = 60_000; // 1 minute cache to avoid redundant network pings per request

export function invalidateLicenseCache(): void {
  validationCache = null;
}

export async function validateLicenseRequest(_req: NextRequest): Promise<LicenseValidationResult> {
  const now = Date.now();

  // 1. Fast Path: Return fresh in-memory cached validation
  if (validationCache && (now - validationCache.timestamp < CACHE_TTL_MS)) {
    return validationCache.result;
  }

  const serverUrl = getLicensingServerUrl();

  // 2. Database is the sole source of truth for the active license
  let dbLicense: ILicenseSetting | null = null;
  try {
    dbLicense = await getActiveDatabaseLicense();
  } catch (err) {
    console.error('Failed to get active database license in validateLicenseRequest:', err);
  }

  const licenseKey = (dbLicense?.licenseKey || getConfiguredLicenseKey()).trim().toUpperCase();

  // Check if store has local active license in DB with future validity
  const validUntilMs = dbLicense?.validUntil ? new Date(dbLicense.validUntil).getTime() : 0;
  const isLocallyValid = Boolean(dbLicense && dbLicense.status === 'ACTIVE' && validUntilMs > now);

  // No licensing server configured — allow through (development mode or local DB active)
  if (!serverUrl || !licenseKey) {
    if (isLocallyValid) {
      const daysRemaining = Math.max(0, Math.ceil((validUntilMs - now) / (1000 * 60 * 60 * 24)));
      const res: LicenseValidationResult = { valid: true, status: 'ACTIVE', daysRemaining };
      validationCache = { result: res, timestamp: now };
      return res;
    }
    const res = { valid: true, status: 'DEV_MODE', daysRemaining: 999 };
    validationCache = { result: res, timestamp: now };
    return res;
  }

  // 3. Network Heartbeat Check
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${serverUrl}/api/license/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (response.ok && data?.success && data?.isAlive) {
      const res: LicenseValidationResult = {
        valid: true,
        status: data.status,
        daysRemaining: data.daysRemaining ?? 0,
      };
      validationCache = { result: res, timestamp: now };

      // Silently sync last ping timestamp to database
      if (dbLicense) {
        dbLicense.lastPingAt = new Date();
        if (data.status && data.status !== dbLicense.status) {
          dbLicense.status = data.status;
        }
        await dbLicense.save().catch(() => null);
      }
      return res;
    }

    // Grace period — still allowed, but with a warning
    if (data?.status === 'GRACE_PERIOD') {
      const res: LicenseValidationResult = {
        valid: true,
        status: 'GRACE_PERIOD',
        daysRemaining: data.daysRemaining ?? 0,
      };
      validationCache = { result: res, timestamp: now };
      return res;
    }

    if (
      response.status === 404 ||
      data?.status === 'EXPIRED' ||
      data?.status === 'SUSPENDED' ||
      data?.status === 'INVALID'
    ) {
      const res: LicenseValidationResult = {
        valid: false,
        error: NextResponse.json(
          {
            success: false,
            code: 'LICENSE_INVALID',
            message: data?.message || 'Your subscription is not active. Please renew to continue.',
            status: data?.status || 'INVALID',
            daysRemaining: data?.daysRemaining ?? 0,
          },
          { status: 403 }
        ),
      };
      validationCache = { result: res, timestamp: now };
      return res;
    }

    // Server returned other status — attempt fallback to local DB check
    return await fallbackLocalLicenseCheck(dbLicense);
  } catch (err) {
    // Network error / timeout — attempt fallback to local DB check
    return await fallbackLocalLicenseCheck(dbLicense);
  }
}

async function fallbackLocalLicenseCheck(existingLicense?: ILicenseSetting | null): Promise<LicenseValidationResult> {
  const now = Date.now();
  try {
    let saved: ILicenseSetting | null = existingLicense ?? null;
    if (!saved) {
      await connectToDatabase();
      saved = await LicenseSetting.findOne({ key: 'current_license' });
    }
    if (saved && saved.status === 'ACTIVE') {
      const validUntil = saved.validUntil ? new Date(saved.validUntil).getTime() : 0;
      if (validUntil > now) {
        const daysRemaining = Math.max(0, Math.ceil((validUntil - now) / (1000 * 60 * 60 * 24)));
        const res: LicenseValidationResult = {
          valid: true,
          status: 'ACTIVE',
          daysRemaining,
        };
        validationCache = { result: res, timestamp: now };
        return res;
      }
    }
  } catch {
    // Local DB check failed
  }

  return {
    valid: false,
    error: NextResponse.json(
      {
        success: false,
        code: 'LICENSE_SERVER_UNREACHABLE',
        message: 'Could not reach licensing server and local license verification failed.',
      },
      { status: 503 }
    ),
  };
}
