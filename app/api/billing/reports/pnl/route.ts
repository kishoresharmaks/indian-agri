import { NextRequest, NextResponse } from 'next/server';
import { calculatePnL } from '@/lib/pnlEngine';
import { isAuthenticatedAdmin, unauthenticatedResponse } from '@/lib/authCheck';
import { validateLicenseRequest } from '@/lib/licensing/validateLicenseRoute';

export async function GET(req: NextRequest) {
  if (!isAuthenticatedAdmin(req)) return unauthenticatedResponse();
  const license = await validateLicenseRequest(req);
  if (license.error) return license.error;
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const report = await calculatePnL(startDate, endDate);
    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
