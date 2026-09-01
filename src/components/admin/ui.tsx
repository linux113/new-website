import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Admin UI kit — server-safe building blocks.
 * Utilitarian: information density, clarity, token-driven.
 */

/* ---------------- AdminPageHeader + Breadcrumbs ---------------- */

export interface AdminCrumb {
  label: string;
  href?: string;
}

export function AdminBreadcrumbs({ items }: { items: AdminCrumb[] }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-mono-micro text-slate">
        {items.map((crumb, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {crumb.href && !last ? (
                <Link href={crumb.href} className="hover:text-ink">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-ink")}>
                  {crumb.label}
                </span>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function AdminPageHeader({
  title,
  crumbs,
  actions,
}: {
  title: string;
  crumbs?: AdminCrumb[];
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        {crumbs ? <AdminBreadcrumbs items={crumbs} /> : null}
        <h1 className="text-display-md text-ink">{title}</h1>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </header>
  );
}

/* ---------------- AdminCard ---------------- */

export function AdminCard({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("adm-card overflow-hidden", className)}>
      {title ? (
        <h2 className="border-b border-line px-4 py-3 text-[0.9375rem] font-medium tracking-[0.04em] text-slate">
          {title}
        </h2>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}

/* ---------------- AdminStatusBadge ---------------- */

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "border-success/25 bg-success-tint text-success",
  DRAFT: "border-line bg-paper-sunken text-slate",
  ARCHIVED: "border-line bg-paper-sunken text-mist",
  NEW: "border-info/25 bg-info-tint text-info",
  IN_PROGRESS: "border-warning/25 bg-warning-tint text-warning",
  CONTACTED: "border-accent/25 bg-accent-tint text-accent",
  CLOSED: "border-success/25 bg-success-tint text-success",
  SPAM: "border-error/25 bg-error-tint text-error",
  ACTIVE: "border-success/25 bg-success-tint text-success",
  SUSPENDED: "border-error/25 bg-error-tint text-error",
};

export function AdminStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2 py-0.5 text-mono-micro whitespace-nowrap",
        STATUS_STYLES[status] ?? "border-line bg-paper-sunken text-slate",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}

/* ---------------- Empty / Loading / Error states ---------------- */

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-line bg-paper-raised px-6 py-16 text-center">
      <p className="text-heading-sm text-ink">{title}</p>
      {description ? <p className="text-body-sm text-slate max-w-105">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function AdminLoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div aria-busy="true" className="adm-card flex flex-col gap-2 p-4">
      <span className="sr-only">{label}</span>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} aria-hidden className="h-10 animate-pulse rounded-xs bg-paper-sunken motion-reduce:animate-none" />
      ))}
    </div>
  );
}

export function AdminErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-xs border border-error/30 bg-error-tint px-4 py-3 text-body-sm text-error">
      {message}
    </div>
  );
}

/* ---------------- Buttons (admin scale) ---------------- */

export function AdminButtonLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-xs px-4 text-label",
        "transition-colors duration-(--duration-fast)",
        variant === "primary"
          ? "bg-accent font-semibold text-[#04101f] hover:bg-accent-hover"
          : "border border-line bg-paper-raised text-ink hover:bg-ink-soft",
      )}
    >
      {children}
    </Link>
  );
}
