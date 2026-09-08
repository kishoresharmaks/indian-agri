import { NextRequest, NextResponse } from 'next/server';
import AdminSession from '@/models/AdminSession';
import { cookies } from 'next/headers';
import { isAuthenticatedAdmin, unauthenticatedResponse } from '@/lib/authCheck';

export async function GET(request: NextRequest) {
  if (!isAuthenticatedAdmin(request)) {
    return unauthenticatedResponse();
  }
  try {
    const cookieStore = cookies();
    const currentToken = cookieStore.get('admin_token')?.value;

    const sessions = await AdminSession.find({
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .select('ipAddress userAgent createdAt lastActivityAt expiresAt')
      .lean();

    return NextResponse.json({
      success: true,
      data: sessions.map((s: any) => ({
        _id: String(s._id),
        isCurrent: s.sessionToken === currentToken,
        ipAddress: s.ipAddress,
        userAgent: s.userAgent,
        createdAt: s.createdAt,
        lastActivityAt: s.lastActivityAt,
        expiresAt: s.expiresAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to load sessions' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const currentToken = cookieStore.get('admin_token')?.value;

    await AdminSession.updateMany(
      {
        sessionToken: { $ne: currentToken },
        isRevoked: false,
      },
      { $set: { isRevoked: true, expiresAt: new Date() } }
    );

    return NextResponse.json({ success: true, message: 'All other sessions revoked' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to revoke sessions' },
      { status: 500 }
    );
  }
}
