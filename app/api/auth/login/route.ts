import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import connectToDatabase from '@/lib/db';
import AdminSession from '@/models/AdminSession';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { enforceMaxSessions } from '@/lib/authCheck';

export async function POST(request: Request) {
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

    const ADMIN_USER = process.env.ADMIN_USERNAME;
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;
    const ADMIN_SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN;

    if (!ADMIN_USER || !ADMIN_PASS) {
      console.error('ADMIN_USERNAME or ADMIN_PASSWORD environment variables are not set');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (!ADMIN_SESSION_TOKEN) {
      console.error('ADMIN_SESSION_TOKEN environment variable is not set');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    await connectToDatabase();

    // Enforce max 3 concurrent sessions — kick out oldest
    await enforceMaxSessions();

    // Create a DB-backed session record for this login
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

    await AdminSession.create({
      sessionToken,
      expiresAt,
      lastActivityAt: new Date(),
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || '',
      isRevoked: false,
    });

    const response = NextResponse.json(
      { success: true, message: 'Authentication successful' },
      { status: 200 }
    );

    // Set __Host- prefixed cookie (always secure, path=/)
    response.cookies.set('__Host-admin_token', sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 8 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
