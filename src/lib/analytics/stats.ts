import "server-only";
import { db } from "@/lib/db";
import { dayKeyInIST, shiftDayKey, startOfInIST } from "./windows";
import type { AnalyticsSnapshot, DayPoint, PeriodStats, TopPage } from "./types";

export type { AnalyticsSnapshot, DayPoint, PeriodStats, TopPage };

const LIVE_WINDOW_MS = 5 * 60 * 1000;
const EMPTY: PeriodStats = { visits: 0, visitors: 0, pageviews: 0 };

function emptySnapshot(): AnalyticsSnapshot {
  const todayKey = dayKeyInIST();
  const fromKey = shiftDayKey(todayKey, -13);
  const last14Days: DayPoint[] = Array.from({ length: 14 }, (_, i) => ({
    date: shiftDayKey(fromKey, i),
    visits: 0,
    visitors: 0,
    pageviews: 0,
  }));
  return {
    live: 0,
    today: EMPTY,
    week: EMPTY,
    month: EMPTY,
    year: EMPTY,
    all: EMPTY,
    last14Days,
    topPages: [],
    generatedAt: Date.now(),
  };
}

function tally(rows: { visitorId: string; sessionId: string }[]): PeriodStats {
  const visitors = new Set<string>();
  const visits = new Set<string>();
  for (const row of rows) {
    visitors.add(row.visitorId);
    visits.add(row.sessionId);
  }
  return { visits: visits.size, visitors: visitors.size, pageviews: rows.length };
}

function tallySince(
  rows: { visitorId: string; sessionId: string; createdAt: Date }[],
  since: Date | null,
): PeriodStats {
  if (!since) return tally(rows);
  const t = since.getTime();
  return tally(rows.filter((r) => r.createdAt.getTime() >= t));
}

/** Live + period traffic from PageView / VisitorPresence. */
export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  try {
    return await loadSnapshot();
  } catch {
    return emptySnapshot();
  }
}

async function loadSnapshot(): Promise<AnalyticsSnapshot> {
  const now = new Date();
  const liveSince = new Date(now.getTime() - LIVE_WINDOW_MS);
  const yearStart = startOfInIST("year", now);
  const todayKey = dayKeyInIST(now);
  const fromKey = shiftDayKey(todayKey, -13);

  const [live, yearRows, allTimePageviews, visitorGroups, sessionGroups, topGrouped] = await Promise.all([
    db.visitorPresence.count({ where: { lastSeenAt: { gte: liveSince } } }),
    db.pageView.findMany({
      where: { createdAt: { gte: yearStart } },
      select: { visitorId: true, sessionId: true, createdAt: true, dayKey: true },
    }),
    db.pageView.count(),
    db.pageView.groupBy({ by: ["visitorId"], _count: { _all: true } }),
    db.pageView.groupBy({ by: ["sessionId"], _count: { _all: true } }),
    db.pageView.groupBy({
      by: ["path"],
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
  ]);

  const all: PeriodStats = allTimePageviews
    ? {
        pageviews: allTimePageviews,
        visitors: visitorGroups.length,
        visits: sessionGroups.length,
      }
    : EMPTY;

  const todayStart = startOfInIST("day", now);
  const weekStart = startOfInIST("week", now);
  const monthStart = startOfInIST("month", now);

  const byDay = new Map<string, { visitors: Set<string>; visits: Set<string>; pageviews: number }>();
  for (let i = 0; i < 14; i++) {
    const key = shiftDayKey(fromKey, i);
    byDay.set(key, { visitors: new Set(), visits: new Set(), pageviews: 0 });
  }
  for (const row of yearRows) {
    const bucket = byDay.get(row.dayKey);
    if (!bucket) continue;
    bucket.pageviews += 1;
    bucket.visitors.add(row.visitorId);
    bucket.visits.add(row.sessionId);
  }

  const last14Days: DayPoint[] = [...byDay.entries()].map(([date, b]) => ({
    date,
    pageviews: b.pageviews,
    visitors: b.visitors.size,
    visits: b.visits.size,
  }));

  const topPages: TopPage[] = topGrouped.map((row) => ({
    path: row.path,
    pageviews: row._count._all,
  }));

  return {
    live,
    today: tallySince(yearRows, todayStart),
    week: tallySince(yearRows, weekStart),
    month: tallySince(yearRows, monthStart),
    year: tally(yearRows),
    all,
    last14Days,
    topPages,
    generatedAt: now.getTime(),
  };
}
