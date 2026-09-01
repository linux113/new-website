"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Eye, MousePointerClick, Users } from "lucide-react";
import type { AnalyticsSnapshot, PeriodStats } from "@/lib/analytics/types";
import { Sparkline } from "./charts";
import { Reveal } from "./widgets";

/** Traffic widgets. Server snapshot, then poll /api/admin/analytics every 15s. */

const POLL_MS = 15_000;

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

function PeriodCard({
  label,
  stats,
  hint,
}: {
  label: string;
  stats: PeriodStats;
  hint: string;
}) {
  return (
    <div className="adm-glow-card p-4">
      <p className="text-[0.8125rem] font-medium tracking-[0.06em] text-slate uppercase">{label}</p>
      <p className="mt-2 font-display text-[1.85rem] leading-none font-semibold tracking-tight text-ink tabular-nums">
        {stats.visits.toLocaleString("en-IN")}
      </p>
      <p className="mt-1.5 text-[0.8125rem] text-mist">visits</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
        <div>
          <dt className="text-[0.75rem] font-medium tracking-[0.04em] text-mist uppercase">Visitors</dt>
          <dd className="mt-0.5 text-[1.05rem] font-semibold text-ink tabular-nums">
            {stats.visitors.toLocaleString("en-IN")}
          </dd>
        </div>
        <div>
          <dt className="text-[0.75rem] font-medium tracking-[0.04em] text-mist uppercase">Pageviews</dt>
          <dd className="mt-0.5 text-[1.05rem] font-semibold text-ink tabular-nums">
            {stats.pageviews.toLocaleString("en-IN")}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-[0.75rem] text-mist">{hint}</p>
    </div>
  );
}

export function LiveTraffic({
  initial,
  variant = "dashboard",
}: {
  initial: AnalyticsSnapshot;
  variant?: "dashboard" | "full";
}) {
  const [data, setData] = useState(initial);
  const [tick, setTick] = useState(initial.generatedAt);

  useEffect(() => {
    let cancelled = false;
    const pull = async () => {
      try {
        const res = await fetch("/api/admin/analytics", { cache: "no-store", credentials: "same-origin" });
        if (!res.ok) return;
        const next = (await res.json()) as AnalyticsSnapshot;
        if (!cancelled) {
          setData(next);
          setTick(Date.now());
        }
      } catch {
        /* keep last good snapshot */
      }
    };
    const id = window.setInterval(pull, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const sparkVisits = data.last14Days.map((d) => d.visits);
  const sparkViews = data.last14Days.map((d) => d.pageviews);

  return (
    <Reveal>
      <section aria-label="Website traffic" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.8125rem] font-medium tracking-[0.08em] text-accent uppercase">Live traffic</p>
            <h2 className="mt-1 font-display text-[1.35rem] font-semibold tracking-tight text-ink">
              Visitors &amp; visits
            </h2>
          </div>
          <p className="text-[0.8125rem] text-mist">
            Asia/Kolkata · refreshed {formatTime(tick)} IST · updates every 15s
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="adm-glow-card relative overflow-hidden p-4 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[0.8125rem] font-medium tracking-[0.06em] text-slate uppercase">Live now</p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success-tint px-2 py-0.5 text-[0.75rem] font-medium text-success">
                <span className="adm-pulse size-1.5 rounded-full bg-success" aria-hidden />
                Live
              </span>
            </div>
            <p className="mt-3 flex items-baseline gap-2 font-display text-[2.35rem] leading-none font-semibold tracking-tight text-ink tabular-nums">
              {data.live.toLocaleString("en-IN")}
              <Eye size={18} strokeWidth={1.6} className="text-accent" aria-hidden />
            </p>
            <p className="mt-2 text-[0.8125rem] text-mist">people on the website right now</p>
            <p className="mt-3 flex items-center gap-1.5 text-[0.75rem] text-slate">
              <Activity size={13} strokeWidth={1.8} aria-hidden />
              Active in the last 5 minutes
            </p>
          </div>

          <PeriodCard label="Today" stats={data.today} hint="Since midnight IST" />
          <PeriodCard label="This week" stats={data.week} hint="Monday 00:00 IST → now" />
          <PeriodCard label="This month" stats={data.month} hint="1st of month IST → now" />
          <PeriodCard label="This year" stats={data.year} hint="1 Jan IST → now" />
        </div>

        {variant === "full" ? (
          <>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <div className="adm-glow-card p-5 xl:col-span-2">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-[1.05rem] font-semibold text-ink">Last 14 days</h3>
                  <span className="text-[0.8125rem] text-mist">Visits vs pageviews</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 flex items-center gap-1.5 text-[0.8125rem] font-medium text-slate">
                      <Users size={14} aria-hidden /> Visits
                    </p>
                    <Sparkline points={sparkVisits} color="#38bdf8" />
                  </div>
                  <div>
                    <p className="mb-1 flex items-center gap-1.5 text-[0.8125rem] font-medium text-slate">
                      <MousePointerClick size={14} aria-hidden /> Pageviews
                    </p>
                    <Sparkline points={sparkViews} color="#34d399" />
                  </div>
                </div>
                <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-7">
                  {data.last14Days.map((d) => (
                    <li key={d.date} className="flex flex-col border-t border-line pt-2">
                      <span className="text-[0.7rem] font-medium tracking-wide text-mist uppercase">
                        {d.date.slice(5)}
                      </span>
                      <span className="text-[0.9rem] font-semibold text-ink tabular-nums">{d.visits}</span>
                      <span className="text-[0.75rem] text-mist tabular-nums">{d.visitors} vis</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="adm-glow-card p-5">
                <h3 className="text-[1.05rem] font-semibold text-ink">Top pages</h3>
                <p className="mt-0.5 text-[0.8125rem] text-mist">All-time pageviews</p>
                {data.topPages.length === 0 ? (
                  <p className="mt-6 text-center text-[0.875rem] text-mist">No pageviews recorded yet.</p>
                ) : (
                  <ol className="mt-4 space-y-2.5">
                    {data.topPages.map((p, i) => (
                      <li key={p.path} className="flex items-baseline justify-between gap-3">
                        <span className="min-w-0 truncate text-[0.9rem] text-ink">
                          <span className="mr-2 text-[0.75rem] text-mist tabular-nums">{i + 1}.</span>
                          {p.path}
                        </span>
                        <span className="shrink-0 text-[0.9rem] font-semibold text-ink tabular-nums">
                          {p.pageviews.toLocaleString("en-IN")}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>

            <p className="text-[0.8125rem] text-mist">
              All-time: {data.all.visits.toLocaleString("en-IN")} visits ·{" "}
              {data.all.visitors.toLocaleString("en-IN")} unique visitors ·{" "}
              {data.all.pageviews.toLocaleString("en-IN")} pageviews.
            </p>
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.8125rem] text-mist">
              All-time {data.all.visits.toLocaleString("en-IN")} visits ·{" "}
              {data.all.visitors.toLocaleString("en-IN")} unique visitors
            </p>
            <Link href="/admin/analytics" className="text-[0.875rem] font-medium text-accent hover:text-accent-hover">
              Open traffic dashboard →
            </Link>
          </div>
        )}
      </section>
    </Reveal>
  );
}
