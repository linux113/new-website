import "server-only";

/**
 * In-memory login rate limiter (per key = IP + email).
 * 5 attempts per 15 minutes, then lockout until the window passes.
 *
 * Note: per-instance memory — sufficient for a single-node deploy.
 * For multi-instance production, replace the Map with Redis/DB; the
 * call-site contract stays identical.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface Bucket {
  count: number;
  first: number;
}

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 1000) return;
  for (const [k, b] of buckets) {
    if (now - b.first > WINDOW_MS) buckets.delete(k);
  }
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMin: number } {
  const now = Date.now();
  prune(now);
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.first > WINDOW_MS) {
    return { allowed: true, retryAfterMin: 0 };
  }
  if (bucket.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterMin: Math.ceil((bucket.first + WINDOW_MS - now) / 60000),
    };
  }
  return { allowed: true, retryAfterMin: 0 };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.first > WINDOW_MS) {
    buckets.set(key, { count: 1, first: now });
  } else {
    bucket.count += 1;
  }
}

export function clearAttempts(key: string): void {
  buckets.delete(key);
}
