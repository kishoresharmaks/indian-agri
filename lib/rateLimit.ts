/**
 * Distributed rate limiter using MongoDB for serverless deployments.
 * Falls back to in-memory store if DB is unavailable.
 *
 * Usage:
 *   const { success, remaining, reset } = await rateLimit(ip);
 */

import connectToDatabase from '@/lib/db';
import RateLimit from '@/models/RateLimit';

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

const MEMORY_STORE_MAX = 500;
const memoryStore = new Map<string, { count: number; resetAt: number }>();

async function mongoRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  try {
    await connectToDatabase();
    const now = Date.now();
    const windowKey = Math.floor(now / windowMs).toString();
    const docId = `${identifier}:${windowKey}`;

    // Atomic upsert: increment count or start at 1
    const entry = await RateLimit.findOneAndUpdate(
      { _id: docId },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date(now + windowMs) },
      },
      { upsert: true, new: true }
    );

    const count = entry!.count;
    const resetAt = entry!.expiresAt.getTime();
    const remaining = Math.max(0, limit - count);

    return {
      success: count <= limit,
      remaining,
      reset: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    };
  } catch {
    return memoryRateLimit(identifier, limit, windowMs);
  }
}

function memoryRateLimit(identifier: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  // Prevent unbounded memory growth
  if (memoryStore.size > MEMORY_STORE_MAX) {
    for (const [key, entry] of memoryStore) {
      if (now > entry.resetAt) memoryStore.delete(key);
    }
  }

  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    memoryStore.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, reset: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= limit) {
    const reset = Math.ceil((entry.resetAt - now) / 1000);
    return { success: false, remaining: 0, reset };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, reset: Math.ceil((entry.resetAt - now) / 1000) };
}

/**
 * Check and record a request from the given IP.
 * Uses MongoDB for distributed rate limiting across serverless instances.
 * Falls back to in-memory if DB is unavailable.
 */
export async function rateLimit(
  identifier: string,
  limit = 5,
  windowMs = 15 * 60 * 1000
): Promise<RateLimitResult> {
  return mongoRateLimit(identifier, limit, windowMs);
}

/**
 * Extract client IP from a Next.js Request.
 * Prefers X-Real-IP (set by Vercel/proxies, trustworthy) over
 * X-Forwarded-For (can be spoofed by the client).
 */
export function getClientIP(request: Request): string {
  // X-Real-IP is set by the proxy/gateway and is trustworthy
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // X-Forwarded-For can be spoofed — only use first IP if present
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return (forwarded.split(',')[0] ?? '127.0.0.1').trim();
  }

  return '127.0.0.1';
}
