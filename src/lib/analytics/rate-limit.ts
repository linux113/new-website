/**
 * In-memory rate limiter for the public collect endpoint.
 * 60 events / minute / IP — heartbeats are every 20s so a real
 * browser stays well under the cap.
 */

const WINDOW_MS = 60_000;
const MAX = 60;

interface Bucket {
  count: number;
  start: number;
}

const buckets = new Map<string, Bucket>();

export function allowCollect(ip: string): boolean {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (now - b.start > WINDOW_MS) buckets.delete(k);
    }
  }
  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.start > WINDOW_MS) {
    buckets.set(ip, { count: 1, start: now });
    return true;
  }
  if (bucket.count >= MAX) return false;
  bucket.count += 1;
  return true;
}
