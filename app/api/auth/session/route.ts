import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAuthenticatedAdmin } from '@/lib/authCheck';

export async function GET(request: NextRequest) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
    return NextResponse.json({ authenticated: isAuth });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
