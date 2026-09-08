import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // If ADMIN_SESSION_TOKEN is not configured, redirect to login anyway
    // (the login API will also fail if env vars are missing)
    const adminToken = request.cookies.get('admin_token')?.value;

    if (adminToken !== ADMIN_SESSION_TOKEN) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
