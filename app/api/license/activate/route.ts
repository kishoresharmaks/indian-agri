import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import LicenseSetting from '@/models/LicenseSetting';
import { getLicensingServerUrl, computeClientLicenseState } from '@/lib/licensing/licenseClient';
import { invalidateLicenseCache } from '@/lib/licensing/validateLicenseRoute';
import { isAuthenticatedAdmin, unauthenticatedResponse } from '@/lib/authCheck';

export async function POST(request: NextRequest) {
  if (!(await isAuthenticatedAdmin(request))) return unauthenticatedResponse();
  try {
    const body = await request.json();
    const { licenseKey } = body;

    if (!licenseKey || !licenseKey.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid License Key.' },
        { status: 400 }
      );
    }

    const cleanKey = String(licenseKey).trim().toUpperCase();
    const host = request.headers.get('host') || 'localhost';
    const licensingServerUrl = getLicensingServerUrl();

    // Ping standalone Licensing Server to activate
    let serverRes: Response;
    try {
      serverRes = await fetch(`${licensingServerUrl}/api/license/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: cleanKey,
          domain: host,
        }),
        cache: 'no-store',
      });
    } catch (netErr: any) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot connect to Licensing Authority Server at ${licensingServerUrl}. Make sure the licensing server is online.`,
        },
        { status: 503 }
      );
    }

    const serverData = await serverRes.json();

    if (!serverRes.ok || !serverData.success) {
      return NextResponse.json(
        { success: false, message: serverData.message || 'License activation rejected by server.' },
        { status: serverRes.status || 400 }
      );
    }

    const lic = serverData.license;

    // Save activated license into e-commerce store database
    await connectToDatabase();
    const updatedSetting = await LicenseSetting.findOneAndUpdate(
      { key: 'current_license' },
      {
        licenseKey: lic.licenseKey,
        businessName: lic.businessName,
        domain: lic.clientDomain,
        status: lic.status || 'ACTIVE',
        validUntil: new Date(lic.validUntil),
        issuedAt: new Date(lic.issuedAt),
        lastPingAt: new Date(),
        signedToken: serverData.token || '',
        activatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    invalidateLicenseCache();

    const clientState = computeClientLicenseState({
      licenseKey: updatedSetting.licenseKey,
      businessName: updatedSetting.businessName,
      domain: updatedSetting.domain,
      status: updatedSetting.status,
      validUntil: updatedSetting.validUntil,
      issuedAt: updatedSetting.issuedAt,
      lastPingAt: updatedSetting.lastPingAt,
      token: updatedSetting.signedToken,
    });

    const maskedKey = cleanKey.length > 8 ? `${cleanKey.slice(0, 4)}****${cleanKey.slice(-4)}` : '****';
    console.log(`✅ Store activated. Key: ${maskedKey} | Business: ${lic.businessName}`);

    return NextResponse.json({
      success: true,
      message: 'License activated successfully! Welcome to INDIAN AGRICULTURE.',
      license: clientState,
    });
  } catch (error: any) {
    console.error('Activation Error in Store:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to activate license.' },
      { status: 500 }
    );
  }
}
