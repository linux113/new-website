"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Recent enquiries — premium data table with client-side search,
 * status filter, date sort and pagination over the latest rows
 * (server passes real DB data). Cards below md.
 */

export interface EnquiryRow {
  id: string;
  company: string;
  contact: string;
  product: string;
  status: string;
  /** epoch ms — serialisable across the RSC boundary */
  createdAt: number;
}

const STATUS_STYLE: Record<string, string> = {
  NEW: "bg-info-tint text-info border-info/25",
  IN_PROGRESS: "bg-warning-tint text-warning border-warning/25",
  CONTACTED: "bg-accent-tint text-accent border-accent/25",
  CLOSED: "bg-success-tint text-success border-success/25",
  SPAM: "bg-error-tint text-error border-error/25",
};

const FILTERS = ["ALL", "NEW", "IN_PROGRESS", "CONTACTED", "CLOSED"] as const;
const PAGE_SIZE = 6;

function StatusPill({ status }: { status: string }) {
  return (
    <span className={cn("inline-block rounded-full border px-2 py-0.5 text-mono-micro whitespace-nowrap", STATUS_STYLE[status] ?? "border-line bg-ink-soft text-slate")}>
      {status.replace("_", " ")}
    </span>
  );
}

export function RecentEnquiries({ rows }: { rows: EnquiryRow[] }) {
  const reduced = useReducedMotion();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [desc, setDesc] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = rows.filter(
      (r) =>
        (filter === "ALL" || r.status === filter) &&
        (!needle || `${r.company} ${r.contact} ${r.product}`.toLowerCase().includes(needle)),
    );
    out = [...out].sort((a, b) => (desc ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
    return out;
  }, [rows, q, filter, desc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const fmt = (ms: number) =>
    new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-0 flex-1 sm:max-w-56">
          <Search size={14} strokeWidth={1.5} aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-mist" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Filter enquiries…"
            aria-label="Filter enquiries"
            className="h-9 w-full rounded-xs border border-line bg-paper-sunken/70 pr-3 pl-8 text-body-sm text-ink placeholder:text-mist focus-visible:border-accent/50 focus-visible:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={cn(
                "rounded-full border px-2.5 py-1 text-mono-micro transition-colors",
                filter === f
                  ? "border-accent/40 bg-accent-tint text-accent"
                  : "border-line text-mist hover:text-ink",
              )}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDesc((v) => !v)}
          className="ml-auto flex items-center gap-1.5 rounded-xs border border-line px-2.5 py-1.5 text-mono-micro text-slate hover:text-ink"
          aria-label={`Sort by date, currently ${desc ? "newest first" : "oldest first"}`}
        >
          <ArrowUpDown size={12} strokeWidth={1.5} aria-hidden />
          {desc ? "Newest" : "Oldest"}
        </button>
      </div>

      {/* Table ≥ md */}
      <div className="mt-4 hidden overflow-hidden rounded-xs border border-line md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-line bg-ink-soft/60">
              {["Company", "Contact", "Product", "Status", "Date", ""].map((h, i) => (
                <th key={h + i} scope="col" className="px-4 py-2.5 text-left text-mono-micro font-normal text-mist">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <AnimatePresence mode="popLayout" initial={false}>
            <tbody>
              {visible.map((r) => (
                <motion.tr
                  key={r.id}
                  layout={reduced ? false : true}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.25 }}
                  className="border-b border-line last:border-b-0 hover:bg-ink-soft/50"
                >
                  <td className="px-4 py-3 text-body-sm font-medium text-ink">{r.company}</td>
                  <td className="px-4 py-3 text-body-sm text-slate">{r.contact}</td>
                  <td className="max-w-44 truncate px-4 py-3 text-body-sm text-slate">{r.product}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-mono-micro text-mist whitespace-nowrap">{fmt(r.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/enquiries/${r.id}`}
                      className="inline-flex items-center gap-1 text-body-sm text-accent hover:text-accent-hover"
                    >
                      View <ArrowRight size={13} strokeWidth={1.5} aria-hidden />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
        {visible.length === 0 ? (
          <p className="px-4 py-10 text-center text-body-sm text-mist">No enquiries match this filter.</p>
        ) : null}
      </div>

      {/* Cards < md */}
      <ul className="mt-4 space-y-2.5 md:hidden">
        {visible.map((r) => (
          <li key={r.id}>
            <Link href={`/admin/enquiries/${r.id}`} className="adm-card block p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-body-sm font-medium text-ink">{r.company}</span>
                <StatusPill status={r.status} />
              </div>
              <p className="mt-1 truncate text-body-sm text-slate">
                {r.contact} · {r.product}
              </p>
              <p className="mt-1 text-mono-micro text-mist">{fmt(r.createdAt)}</p>
            </Link>
          </li>
        ))}
        {visible.length === 0 ? (
          <li className="py-8 text-center text-body-sm text-mist">No enquiries match this filter.</li>
        ) : null}
      </ul>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-mono-micro text-mist tabular-nums">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xs border border-line px-3 py-1.5 text-body-sm text-slate hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-mono-micro text-mist tabular-nums">
            {safePage} / {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage >= pageCount}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xs border border-line px-3 py-1.5 text-body-sm text-slate hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
