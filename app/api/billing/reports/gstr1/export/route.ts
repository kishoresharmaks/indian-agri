import { NextRequest, NextResponse } from 'next/server';
import { calculateGstr1 } from '@/lib/gstr1Engine';
import { generateGstr1ExcelBuffer } from '@/lib/gstr1ExcelGenerator';
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

    const reportData = await calculateGstr1({ startDate, endDate, month, year });
    const excelBuffer = await generateGstr1ExcelBuffer(reportData);

    const sDate = new Date(reportData.period.startDate);
    const eDate = new Date(reportData.period.endDate);

    const pad = (n: number) => String(n).padStart(2, '0');
    const fromStr = `${pad(sDate.getDate())}-${pad(sDate.getMonth() + 1)}-${sDate.getFullYear()}`;
    const toStr = `${pad(eDate.getDate())}-${pad(eDate.getMonth() + 1)}-${eDate.getFullYear()}`;
    const filename = `GSTR_1_Report_${fromStr}_to_${toStr}.xlsx`;

    return new NextResponse(excelBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('GSTR-1 export error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to export GSTR-1 excel' }, { status: 500 });
  }
}
