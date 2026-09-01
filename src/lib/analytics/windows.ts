/**
 * Analytics time windows in Asia/Kolkata (company HQ). Day/week/month
 * boundaries must not follow the server's TZ or UTC, otherwise "today"
 * flips at the wrong wall-clock time for Mumbai.
 */

export const ANALYTICS_TZ = "Asia/Kolkata";

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** Civil date YYYY-MM-DD in Asia/Kolkata. */
export function dayKeyInIST(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ANALYTICS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Midnight IST for a civil (y, m, d) as a UTC Date. Month is 1-based. */
export function istMidnightUtc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - IST_OFFSET_MS);
}

function ymd(date: Date): { y: number; m: number; d: number } {
  const [y, m, d] = dayKeyInIST(date).split("-").map(Number);
  return { y, m, d };
}

/** Add `delta` days to a YYYY-MM-DD civil key (calendar arithmetic). */
export function shiftDayKey(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  return dt.toISOString().slice(0, 10);
}

export type AnalyticsPeriod = "day" | "week" | "month" | "year";

/**
 * Start of today / ISO week (Monday) / month / year, in Asia/Kolkata,
 * returned as a UTC Date suitable for Prisma `gte` filters.
 */
export function startOfInIST(unit: AnalyticsPeriod, now = new Date()): Date {
  const { y, m, d } = ymd(now);
  if (unit === "year") return istMidnightUtc(y, 1, 1);
  if (unit === "month") return istMidnightUtc(y, m, 1);
  if (unit === "day") return istMidnightUtc(y, m, d);

  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: ANALYTICS_TZ,
    weekday: "short",
  }).format(now);
  const fromMonday: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  const offset = fromMonday[weekday] ?? 0;
  const monday = new Date(Date.UTC(y, m - 1, d - offset));
  return istMidnightUtc(monday.getUTCFullYear(), monday.getUTCMonth() + 1, monday.getUTCDate());
}
