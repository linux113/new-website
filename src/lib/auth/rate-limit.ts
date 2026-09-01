import "server-only";

/**
 * Multi-tier login rate limiter.
 *
 * Provides three distinct defense tiers:
 *   1. Account tier: Max 5 failed attempts per 15 min per target email
 *      (stops distributed brute force / botnets targeting one admin).
 *   2. IP tier: Max 20 failed attempts per 15 min per IP address
 *      (stops password spraying across multiple admin accounts).
 *   3. Pair tier: Max 5 failed attempts per 15 min for (IP + email).
 *
 * Automatically prunes expired buckets on each check to keep memory bounded.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS_PER_EMAIL = 5;
const MAX_ATTEMPTS_PER_IP = 20;
const MAX_ATTEMPTS_PER_PAIR = 5;

interface Bucket {
  count: number;
  first: number;
}

const emailBuckets = new Map<string, Bucket>();
const ipBuckets = new Map<string, Bucket>();
const pairBuckets = new Map<string, Bucket>();

function pruneMap(map: Map<string, Bucket>, now: number): void {
  for (const [k, b] of map) {
    if (now - b.first > WINDOW_MS) {
      map.delete(k);
    }
  }
}

function pruneAll(now: number): void {
  if (emailBuckets.size > 2000) pruneMap(emailBuckets, now);
  if (ipBuckets.size > 2000) pruneMap(ipBuckets, now);
  if (pairBuckets.size > 2000) pruneMap(pairBuckets, now);
}

function checkBucket(
  bucket: Bucket | undefined,
  maxAttempts: number,
  now: number,
): { allowed: boolean; retryAfterMin: number } {
  if (!bucket || now - bucket.first > WINDOW_MS) {
    return { allowed: true, retryAfterMin: 0 };
  }
  if (bucket.count >= maxAttempts) {
    const retryAfterMin = Math.max(
      1,
      Math.ceil((bucket.first + WINDOW_MS - now) / 60000),
    );
    return { allowed: false, retryAfterMin };
  }
  return { allowed: true, retryAfterMin: 0 };
}

function recordBucket(map: Map<string, Bucket>, key: string, now: number): void {
  const bucket = map.get(key);
  if (!bucket || now - bucket.first > WINDOW_MS) {
    map.set(key, { count: 1, first: now });
  } else {
    bucket.count += 1;
  }
}

export interface RateLimitContext {
  ip: string;
  email: string;
}

export function checkRateLimit(ctx: RateLimitContext): {
  allowed: boolean;
  retryAfterMin: number;
} {
  const now = Date.now();
  pruneAll(now);

  const pairKey = `${ctx.ip}:${ctx.email}`;

  // Check Pair
  const pairResult = checkBucket(pairBuckets.get(pairKey), MAX_ATTEMPTS_PER_PAIR, now);
  if (!pairResult.allowed) return pairResult;

  // Check Target Email
  const emailResult = checkBucket(emailBuckets.get(ctx.email), MAX_ATTEMPTS_PER_EMAIL, now);
  if (!emailResult.allowed) return emailResult;

  // Check Origin IP
  const ipResult = checkBucket(ipBuckets.get(ctx.ip), MAX_ATTEMPTS_PER_IP, now);
  if (!ipResult.allowed) return ipResult;

  return { allowed: true, retryAfterMin: 0 };
}

export function recordFailedAttempt(ctx: RateLimitContext): void {
  const now = Date.now();
  const pairKey = `${ctx.ip}:${ctx.email}`;

  recordBucket(pairBuckets, pairKey, now);
  recordBucket(emailBuckets, ctx.email, now);
  recordBucket(ipBuckets, ctx.ip, now);
}

export function clearAttempts(ctx: RateLimitContext): void {
  const pairKey = `${ctx.ip}:${ctx.email}`;
  pairBuckets.delete(pairKey);
  emailBuckets.delete(ctx.email);
}
