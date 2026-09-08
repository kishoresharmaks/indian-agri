'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { IClientLicenseState } from '@/lib/licensing/licenseTypes';
import LicenseActivationModal from './LicenseActivationModal';
import LicenseLockScreen from './LicenseLockScreen';
import { startLicenseHeartbeat } from '@/lib/licensing/licenseHeartbeat';

interface LicenseGateProps {
  children: React.ReactNode;
}

/**
 * LicenseGate — silently checks license in the background and renders children immediately.
 *
 * - Renders children right away while license check happens in background
 * - Shows LicenseActivationModal only if license is not activated
 * - Shows LicenseLockScreen only if license is expired, suspended, or invalid
 * - Starts 5-minute heartbeat once license is confirmed active
 */
export default function LicenseGate({ children }: LicenseGateProps) {
  const [licenseState, setLicenseState] = useState<IClientLicenseState | null>(null);

  const fetchLicense = useCallback(async () => {
    try {
      const res = await fetch('/api/license/status', { cache: 'no-store' });
      const data = await res.json();

      if (data.success && data.license) {
        const state: IClientLicenseState = {
          isActivated: data.license.isActivated ?? data.license.status !== 'UNLICENSED',
          isValid: data.license.isValid ?? false,
          isLocked: data.license.isLocked ?? false,
          isGracePeriod: data.license.isGracePeriod ?? false,
          serverOnline: data.license.serverOnline ?? true,
          status: data.license.status ?? 'UNLICENSED',
          licenseKey: data.license.licenseKey ?? '',
          businessName: data.license.businessName ?? '',
          domain: data.license.domain ?? '',
          planName: data.license.planName ?? 'Pro Subscription',
          billingCycle: data.license.billingCycle ?? 'YEARLY',
          features: data.license.features,
          validUntil: data.license.validUntil,
          issuedAt: data.license.issuedAt,
          daysRemaining: data.license.daysRemaining ?? 0,
          lastPingAt: data.license.lastPingAt,
          token: data.license.token,
          message: data.license.message,
          supportPhone: data.license.supportPhone,
          supportEmail: data.license.supportEmail,
          licensingServerUrl: data.license.licensingServerUrl,
        };
        setLicenseState(state);
      } else {
        setLicenseState({
          isActivated: false,
          isValid: false,
          isLocked: true,
          status: 'UNLICENSED',
          licenseKey: '',
          businessName: '',
          domain: '',
          planName: 'Pro Subscription',
          billingCycle: 'YEARLY',
          daysRemaining: 0,
          serverOnline: data.serverOnline ?? false,
        });
      }
    } catch {
      setLicenseState({
        isActivated: false,
        isValid: false,
        isLocked: true,
        status: 'UNLICENSED',
        licenseKey: '',
        businessName: '',
        domain: '',
        planName: 'Pro Subscription',
        billingCycle: 'YEARLY',
        daysRemaining: 0,
      });
    }
  }, []);

  useEffect(() => {
    fetchLicense();
  }, [fetchLicense]);

  // Start heartbeat once license is activated and valid
  useEffect(() => {
    if (licenseState?.isActivated && licenseState?.token) {
      startLicenseHeartbeat(licenseState.token, licenseState.licenseKey);
    }
  }, [licenseState?.isActivated, licenseState?.token, licenseState?.licenseKey]);

  // While license is still being checked (null), render children silently
  if (licenseState === null) {
    return <>{children}</>;
  }

  // Unlicensed or never activated — show activation modal over the store
  if (!licenseState.isActivated || licenseState.status === 'UNLICENSED') {
    return (
      <LicenseActivationModal
        license={licenseState}
        onActivated={() => {
          fetchLicense();
        }}
      />
    );
  }

  // Expired, suspended, or locked — show lock screen over the store
  if (licenseState.isLocked || licenseState.status === 'EXPIRED' || licenseState.status === 'SUSPENDED' || !licenseState.isValid) {
    return (
      <LicenseLockScreen
        license={licenseState}
        onUnlocked={() => {
          fetchLicense();
        }}
      />
    );
  }

  // Grace period — show store with warning banner
  if (licenseState.isGracePeriod) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center">
          <p className="text-xs sm:text-sm text-amber-800 font-sans">
            ⚠️ Subscription expired on{' '}
            <strong>{licenseState.validUntil ? new Date(licenseState.validUntil).toLocaleDateString('en-IN') : 'N/A'}</strong>
            . Store is in grace period. Please renew to avoid service interruption.
          </p>
        </div>
        {children}
      </div>
    );
  }

  // License is active and valid — render children
  return <>{children}</>;
}
