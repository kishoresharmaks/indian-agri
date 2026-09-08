import { NextRequest, NextResponse } from 'next/server';

const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  // 'self' covers same-origin API routes; Razorpay is called server-side
  "connect-src 'self' https://api.razorpay.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Content-Security-Policy', CSP_HEADER);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Apply security headers to admin pages
  if (pathname.startsWith('/admin')) {
    // Lightweight auth check: cookie must exist and be a non-empty value
    // The authoritative per-session validation happens in API routes (lib/authCheck.ts)
    if (!pathname.startsWith('/admin/login')) {
      const adminToken =
        request.cookies.get('__Host-admin_token')?.value ||
        request.cookies.get('admin_token')?.value;
      if (!adminToken || adminToken.length < 32) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    return applySecurityHeaders(response);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
