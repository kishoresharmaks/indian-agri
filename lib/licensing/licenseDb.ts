import connectToDatabase from '@/lib/db';
import LicenseSetting, { ILicenseSetting } from '@/models/LicenseSetting';
import { getConfiguredLicenseKey } from './licenseClient';

/**
 * Single Source of Truth for Store Licensing.
 * All license status, keys, and validation derive from MongoDB LicenseSetting.
 * If the database record is missing, it auto-seeds from environment fallback.
 */
export async function getActiveDatabaseLicense(): Promise<ILicenseSetting | null> {
  try {
    await connectToDatabase();
    let setting = await LicenseSetting.findOne({ key: 'current_license' });

    // Auto-seed from environment if database has no record or empty license key
    if (!setting || !setting.licenseKey) {
      const seedKey = getConfiguredLicenseKey();
      if (seedKey) {
        setting = await LicenseSetting.findOneAndUpdate(
          { key: 'current_license' },
          {
            $setOnInsert: {
              key: 'current_license',
              licenseKey: seedKey,
              status: 'ACTIVE',
              validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              issuedAt: new Date(),
              lastPingAt: new Date(),
            },
          },
          { upsert: true, new: true }
        );
      }
    }

    return setting;
  } catch (err) {
    console.error('Failed to get active database license:', err);
    return null;
  }
}

/**
 * Gets the current active license key from database as the single source of truth.
 * Falls back to environment variable if database is unseeded or inaccessible.
 */
export async function getActiveLicenseKey(): Promise<string> {
  const setting = await getActiveDatabaseLicense();
  if (setting?.licenseKey) {
    return setting.licenseKey.trim().toUpperCase();
  }
  return getConfiguredLicenseKey();
}
