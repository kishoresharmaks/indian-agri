import { NextResponse } from 'next/server';
import { rateLimit, getClientIP } from '@/lib/rateLimit';

export async function POST(request: Request) {
  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = getClientIP(request);
  const { success, reset } = rateLimit(ip);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many attempts. Please try again in ${reset} seconds.`,
        retryAfter: reset,
      },
      { status: 429, headers: { 'Retry-After': String(reset) } }
    );
  }

  try {
    const { password } = await request.json();
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASS) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (password === ADMIN_PASS) {
      return NextResponse.json({ success: true, message: 'Password verified' });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid Admin Password. Access Denied.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
