import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;
    const validToken = process.env.ADMIN_SESSION_TOKEN;

    if (!validToken) {
      // Auth not configured — fail secure
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (token === validToken) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
