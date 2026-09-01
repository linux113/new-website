/** Shared analytics types — safe to import from client components. */

export interface PeriodStats {
  visits: number;
  visitors: number;
  pageviews: number;
}

export interface DayPoint {
  date: string;
  visits: number;
  visitors: number;
  pageviews: number;
}

export interface TopPage {
  path: string;
  pageviews: number;
}

export interface AnalyticsSnapshot {
  live: number;
  today: PeriodStats;
  week: PeriodStats;
  month: PeriodStats;
  year: PeriodStats;
  all: PeriodStats;
  last14Days: DayPoint[];
  topPages: TopPage[];
  generatedAt: number;
}
