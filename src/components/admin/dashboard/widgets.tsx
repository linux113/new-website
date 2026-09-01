"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  FilePlus2,
  FileText,
  FolderPlus,
  Image as ImageIcon,
  Inbox,
  Minus,
  Package,
  PackagePlus,
  Sparkles,
  Tags,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { CountUp, Sparkline } from "./charts";

/**
 * Dashboard widgets — KPI cards, staggered reveal wrappers, quick
 * actions and activity timeline. All values are real DB numbers
 * passed from the server component.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------- Reveal (stagger container / item) ---------------- */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- KPI card ---------------- */

/** Icons resolved client-side — Lucide components can't cross the RSC boundary. */
const KPI_ICONS: Record<string, LucideIcon> = {
  inbox: Inbox,
  sparkles: Sparkles,
  package: Package,
  users: Users,
  tags: Tags,
  file: FileText,
};

export interface KpiCardProps {
  label: string;
  value: number;
  href: string;
  icon: keyof typeof KPI_ICONS;
  /** % change vs previous period; null → no comparison shown. */
  change: number | null;
  compareText: string;
  spark: number[];
  index: number;
}

export function KpiCard({ label, value, href, icon, change, compareText, spark, index }: KpiCardProps) {
  const Icon = KPI_ICONS[icon] ?? Inbox;
  const reduced = useReducedMotion();
  const up = change != null && change > 0;
  const flat = change == null || change === 0;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.08 + index * 0.07, ease: EASE }}
    >
      <Link href={href} className="adm-glow-card adm-glow-hover group block p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        <span aria-hidden className="adm-sheen"><span style={{ animationDelay: `${index * 1.1}s` }} /></span>
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.8125rem] font-medium tracking-[0.04em] text-slate">{label}</p>
          <span className="adm-icon-glow flex size-9 shrink-0 items-center justify-center rounded-xs text-accent">
            <Icon size={16} strokeWidth={1.5} aria-hidden />
          </span>
        </div>

        <p className="mt-3 font-display text-[2rem] leading-none font-semibold tracking-tight text-ink">
          <CountUp value={value} />
        </p>

        <div className="mt-2.5 flex items-center gap-1.5">
          {flat ? (
            <span className="flex items-center gap-1 text-mono-micro text-mist">
              <Minus size={12} strokeWidth={2} aria-hidden /> —
            </span>
          ) : (
            <span
              className={cn(
                "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-mono-micro tabular-nums",
                up ? "bg-success-tint text-success" : "bg-error-tint text-error",
              )}
            >
              {up ? <ArrowUpRight size={11} strokeWidth={2.2} aria-hidden /> : <ArrowDownRight size={11} strokeWidth={2.2} aria-hidden />}
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
          <span className="text-mono-micro text-mist">{compareText}</span>
        </div>

        <div className="mt-3 -mb-1">
          <Sparkline points={spark} color={flat ? "#5f6b86" : up ? "#38bdf8" : "#f87171"} />
        </div>
      </Link>
    </motion.div>
  );
}

/* ---------------- Quick actions ---------------- */

const ACTIONS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Add product", href: "/admin/products/new", icon: PackagePlus },
  { label: "Add category", href: "/admin/categories/new", icon: FolderPlus },
  { label: "View enquiries", href: "/admin/enquiries", icon: Inbox },
  { label: "Add customer", href: "/admin/customers/new", icon: UserPlus },
  { label: "Create blog", href: "/admin/blogs/new", icon: FilePlus2 },
  { label: "Upload media", href: "/admin/media", icon: ImageIcon },
];

export function QuickActions() {
  const reduced = useReducedMotion();
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
      {ACTIONS.map((a, i) => {
        const Icon = a.icon;
        return (
          <motion.div
            key={a.href + a.label}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
          >
            <Link
              href={a.href}
              className="adm-glow-card adm-glow-hover flex items-center gap-2.5 px-3.5 py-3 text-body-sm text-slate hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Icon size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-accent" />
              <span className="truncate">{a.label}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------------- Activity timeline ---------------- */

export interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  href: string;
  kind: "enquiry" | "contact" | "vendor" | "product" | "blog";
}

const KIND_COLOR: Record<ActivityItem["kind"], string> = {
  enquiry: "#38bdf8",
  contact: "#818cf8",
  vendor: "#34d399",
  product: "#fbbf24",
  blog: "#f472b6",
};

const KIND_LABEL: Record<ActivityItem["kind"], string> = {
  enquiry: "Enquiry received",
  contact: "Contact message",
  vendor: "Vendor request",
  product: "Product updated",
  blog: "Post updated",
};

export function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-body-sm text-mist">No recent activity yet.</p>;
  }
  return (
    <ol className="relative space-y-0">
      {items.map((item, i) => (
        <li
          key={item.id}
          className="adm-rise relative pb-4 pl-6 last:pb-0"
          style={{ "--adm-delay": `${150 + i * 90}ms` } as React.CSSProperties}
        >
          {/* Rail */}
          {i < items.length - 1 ? <span aria-hidden className="absolute top-3 left-[5px] h-full w-px bg-(--color-line)" /> : null}
          {/* Dot */}
          <span
            aria-hidden
            className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-(--color-paper-raised)"
            style={{ backgroundColor: KIND_COLOR[item.kind], boxShadow: `0 0 8px ${KIND_COLOR[item.kind]}55` }}
          />
          <Link href={item.href} className="group block">
            <p className="text-mono-micro" style={{ color: KIND_COLOR[item.kind] }}>
              {KIND_LABEL[item.kind]}
            </p>
            <p className="mt-0.5 truncate text-body-sm text-ink group-hover:text-accent">{item.title}</p>
            <p className="text-mono-micro text-mist">{item.meta}</p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
