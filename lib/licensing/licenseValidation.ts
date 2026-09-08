import { NextRequest } from 'next/server';
import { validateLicenseRequest, LicenseValidationResult } from './validateLicenseRoute';

export type { LicenseValidationResult };

/**
 * Server-Side License Validation Middleware
 * Delegates to validateLicenseRequest which uses MongoDB LicenseSetting as the single source of truth.
 */
export async function validateLicense(request: NextRequest): Promise<LicenseValidationResult> {
  return validateLicenseRequest(request);
}
