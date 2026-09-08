import { NextRequest, NextResponse } from 'next/server';

export function isAuthenticatedAdmin(req: NextRequest | Request): boolean {
  const adminSessionToken = process.env.ADMIN_SESSION_TOKEN;
  if (!adminSessionToken) {
    console.warn('ADMIN_SESSION_TOKEN environment variable is not set — admin sessions disabled');
    return false;
  }

  // 1. NextRequest with cookies helper
  if ('cookies' in req && typeof (req as NextRequest).cookies?.get === 'function') {
    const adminToken = (req as NextRequest).cookies.get('admin_token')?.value;
    if (adminToken === adminSessionToken) return true;
  }

  // 2. Standard Request with Cookie header
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]) === adminSessionToken;
  }

  return false;
}

export function unauthenticatedResponse() {
  return NextResponse.json(
    { success: false, message: 'Unauthorized. Admin session required.' },
    { status: 401 }
  );
}
