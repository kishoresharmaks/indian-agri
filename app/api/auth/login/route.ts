import { NextResponse } from 'next/server';
import { rateLimit, getClientIP } from '@/lib/rateLimit';

export async function POST(request: Request) {
  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = getClientIP(request);
  const { success, remaining, reset } = rateLimit(ip);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many login attempts. Please try again in ${reset} seconds.`,
        retryAfter: reset,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(reset),
          'X-RateLimit-Remaining': String(remaining),
        },
      }
    );
  }

  try {
    const { username, password } = await request.json();

    // Admin credentials MUST be set in environment variables — no hardcoded fallbacks
    const ADMIN_USER = process.env.ADMIN_USERNAME;
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    if (!ADMIN_USER || !ADMIN_PASS) {
      console.error('ADMIN_USERNAME or ADMIN_PASSWORD environment variables are not set');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const sessionToken = process.env.ADMIN_SESSION_TOKEN;
      if (!sessionToken) {
        console.error('ADMIN_SESSION_TOKEN environment variable is not set');
        return NextResponse.json(
          { success: false, message: 'Server configuration error' },
          { status: 500 }
        );
      }

      const response = NextResponse.json(
        { success: true, message: 'Authentication successful' },
        { status: 200 }
      );

      // Set cookie for session
      response.cookies.set('admin_token', sessionToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
