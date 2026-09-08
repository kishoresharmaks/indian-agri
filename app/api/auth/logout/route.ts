import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revokeSession } from '@/lib/authCheck';

export async function POST() {
  const cookieStore = cookies();
  const token =
    cookieStore.get('__Host-admin_token')?.value ||
    cookieStore.get('admin_token')?.value;

  if (token) {
    await revokeSession(token).catch(() => {});
  }

  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete('__Host-admin_token');
  response.cookies.delete('admin_token');
  return response;
}
