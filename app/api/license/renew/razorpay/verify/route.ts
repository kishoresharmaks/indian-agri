import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import LicenseSetting from '@/models/LicenseSetting';
import { getConfiguredLicenseKey, getLicensingServerUrl } from '@/lib/licensing/licenseClient';
import { getActiveDatabaseLicense } from '@/lib/licensing/licenseDb';
import { invalidateLicenseCache } from '@/lib/licensing/validateLicenseRoute';
import { isAuthenticatedAdmin, unauthenticatedResponse } from '@/lib/authCheck';

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdmin(request)) return unauthenticatedResponse();
  try {
    const body = await request.json();
    const {
      planId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      transactionId,
    } = body;
    let licenseKey = body.licenseKey;

    if (!licenseKey) {
      const activeLicense = await getActiveDatabaseLicense();
      licenseKey = activeLicense?.licenseKey || getConfiguredLicenseKey();
    }

    const licensingServerUrl = getLicensingServerUrl() || 'http://localhost:4000';

    const res = await fetch(`${licensingServerUrl}/api/license/renew/razorpay/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        transactionId,
        licenseKey,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success && data.license) {
      try {
        await connectToDatabase();
        await LicenseSetting.findOneAndUpdate(
          { key: 'current_license' },
          {
            licenseKey: data.license.licenseKey,
            status: data.license.status || 'ACTIVE',
            validUntil: new Date(data.license.validUntil),
            planName: data.license.planName,
            billingCycle: data.license.billingCycle,
            features: data.license.features,
            signedToken: data.token || '',
            lastPingAt: new Date(),
          },
          { upsert: true }
        );
        invalidateLicenseCache();
      } catch (dbErr) {
        console.error('Failed to sync renewed license to local DB:', dbErr);
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to verify payment with Licensing Server' },
      { status: 500 }
    );
  }
}
