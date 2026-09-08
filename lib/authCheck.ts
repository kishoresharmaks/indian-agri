import { NextRequest, NextResponse } from 'next/server';
import AdminSession from '@/models/AdminSession';

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CONCURRENT_SESSIONS = 3;

export async function isAuthenticatedAdmin(req: NextRequest | Request): Promise<boolean> {
  let sessionToken: string | undefined;

  if ('cookies' in req && typeof (req as NextRequest).cookies?.get === 'function') {
    sessionToken =
      (req as NextRequest).cookies.get('__Host-admin_token')?.value ||
      (req as NextRequest).cookies.get('admin_token')?.value;
  }

  if (!sessionToken) {
    const cookieHeader = req.headers.get('cookie') || '';
    const hostMatch = cookieHeader.match(/(?:^|;\s*)__Host-admin_token=([^;]+)/);
    if (hostMatch && hostMatch[1]) {
      sessionToken = decodeURIComponent(hostMatch[1]);
    } else {
      const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
      if (match && match[1]) {
        sessionToken = decodeURIComponent(match[1]);
      }
    }
  }

  if (!sessionToken) return false;

  try {
    const session = await AdminSession.findOne({
      sessionToken,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!session) return false;

    // Inactivity timeout — kill sessions idle > 30 minutes
    const now = new Date();
    const lastActive = new Date(session.lastActivityAt);
    if (now.getTime() - lastActive.getTime() > INACTIVITY_LIMIT_MS) {
      session.isRevoked = true;
      session.expiresAt = now;
      await session.save();
      return false;
    }

    // Update last activity (fire and forget)
    session.lastActivityAt = now;
    session.save().catch(() => {});
    return true;
  } catch {
    return false;
  }
}

export function unauthenticatedResponse() {
  return NextResponse.json(
    { success: false, message: 'Unauthorized. Admin session required.' },
    { status: 401 }
  );
}

export async function revokeSession(sessionToken: string): Promise<void> {
  await AdminSession.updateOne(
    { sessionToken },
    { $set: { isRevoked: true, expiresAt: new Date() } }
  );
}

export async function getActiveSessionCount(): Promise<number> {
  return AdminSession.countDocuments({
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });
}

export async function enforceMaxSessions(): Promise<void> {
  const count = await getActiveSessionCount();
  if (count >= MAX_CONCURRENT_SESSIONS) {
    const oldest = await AdminSession.findOne({
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: 1 });
    if (oldest) {
      oldest.isRevoked = true;
      oldest.expiresAt = new Date();
      await oldest.save();
    }
  }
}
