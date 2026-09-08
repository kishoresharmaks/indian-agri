/**
 * In-memory rate limiter for API routes.
 * Tracks request counts per IP with automatic expiry.
 * For single-instance deployments (no Redis needed).
 *
 * Usage:
 *   import { rateLimit } from '@/lib/rateLimit';
 *   const { success, remaining, reset } = rateLimit(ip);
 *   if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix ms
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every minute
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // seconds until reset
}

/**
 * Check and record a request from the given IP.
 * @param identifier - IP address or unique identifier
 * @param limit - Max requests allowed per window (default: 5)
 * @param windowMs - Time window in ms (default: 15 minutes)
 */
export function rateLimit(
  identifier: string,
  limit = 5,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
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
 * Extract client IP from a Next.js Request.
 * Handles X-Forwarded-For header for proxied deployments.
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return (forwarded.split(',')[0] ?? '127.0.0.1').trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}
