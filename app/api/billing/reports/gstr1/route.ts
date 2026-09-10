import { NextRequest, NextResponse } from 'next/server';
import { calculateGstr1 } from '@/lib/gstr1Engine';
import { isAuthenticatedAdmin, unauthenticatedResponse } from '@/lib/authCheck';
import { validateLicenseRequest } from '@/lib/licensing/validateLicenseRoute';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthenticatedAdmin(req)) return unauthenticatedResponse();
  const license = await validateLicenseRequest(req);
  if (license.error) return license.error;

  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const monthStr = searchParams.get('month');
    const yearStr = searchParams.get('year');

    const month = monthStr ? parseInt(monthStr, 10) : undefined;
    const year = yearStr ? parseInt(yearStr, 10) : undefined;

    const report = await calculateGstr1({ startDate, endDate, month, year });
    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error('GSTR-1 report generation error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to generate GSTR-1 report' }, { status: 500 });
  }
}
