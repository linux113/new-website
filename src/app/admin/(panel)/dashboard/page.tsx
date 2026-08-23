import Link from "next/link";
import { db } from "@/lib/db";
import { MonthlyBarChart, ProductBars, StatusDonut, type MonthPoint } from "@/components/admin/dashboard/charts";
import { KpiCard, QuickActions, Reveal } from "@/components/admin/dashboard/widgets";
import { RecentEnquiries, type EnquiryRow } from "@/components/admin/dashboard/RecentEnquiries";
import { WorldMap } from "@/components/admin/dashboard/WorldMap";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

/**
 * Command-center dashboard. Every number on this page is a real
 * database aggregate — no invented statistics. Percentage changes
 * compare the last 30 days against the 30 days before that.
 */

const DAY = 86_400_000;

function pctChange(current: number, previous: number): number | null {
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
}

/** Bucket timestamps into a fixed daily series ending today. */
function dailySeries(dates: Date[], days: number, now: number): number[] {
  const out = new Array<number>(days).fill(0);
  const start = now - (days - 1) * DAY;
  for (const d of dates) {
    const i = Math.floor((d.getTime() - start) / DAY);
    if (i >= 0 && i < days) out[i] += 1;
  }
  return out;
}

/** Snapshot of "now" resolved outside component render (react-hooks/purity). */
function getWindow() {
  const now = Date.now();
  return { now, since: new Date(now - 365 * DAY) };
}

export default async function AdminDashboardPage() {
  const { now, since } = getWindow();

  const [
    productCount,
    productPublished,
    categoryCount,
    blogCount,
    customerCount,
    enquiryDates,
    contactDates,
    vendorDates,
    enquiryByStatus,
    productEnquiryCounts,
    recentEnquiries,
    countries,
  ] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { status: "PUBLISHED" } }),
    db.category.count(),
    db.blogPost.count(),
    db.customer.count(),
    db.productEnquiry.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.contactMessage.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.vendorRequest.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.productEnquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    db.productEnquiry.groupBy({
      by: ["productId"],
      _count: { _all: true },
      where: { productId: { not: null } },
      orderBy: { _count: { productId: "desc" } },
      take: 5,
    }),
    db.productEnquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { product: { select: { name: true } } },
    }),
    db.globalCountry.findMany({ where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" }, select: { code: true, label: true, direction: true } }),
  ]);

  /* ---- Daily series (for KPI sparklines + comparisons) ---- */
  const enqDaily = dailySeries(enquiryDates.map((r) => r.createdAt), 365, now);
  const conDaily = dailySeries(contactDates.map((r) => r.createdAt), 365, now);
  const venDaily = dailySeries(vendorDates.map((r) => r.createdAt), 365, now);

  /* ---- Monthly buckets for the glowing bar chart (last 12 months) ---- */
  const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
  const months: MonthPoint[] = [];
  const monthIndex = new Map<string, number>();
  for (let i = 11; i >= 0; i--) {
    const ref = new Date(now);
    ref.setDate(1);
    ref.setMonth(ref.getMonth() - i);
    monthIndex.set(monthKey(ref), months.length);
    months.push({
      label: ref.toLocaleDateString("en-GB", { month: "short" }),
      full: ref.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      enquiries: 0,
      contacts: 0,
      vendors: 0,
    });
  }
  for (const r of enquiryDates) {
    const i = monthIndex.get(monthKey(r.createdAt));
    if (i != null) months[i].enquiries += 1;
  }
  for (const r of contactDates) {
    const i = monthIndex.get(monthKey(r.createdAt));
    if (i != null) months[i].contacts += 1;
  }
  for (const r of vendorDates) {
    const i = monthIndex.get(monthKey(r.createdAt));
    if (i != null) months[i].vendors += 1;
  }

  /* ---- KPI comparisons: last 30d vs previous 30d ---- */
  const sum = (arr: number[], from: number, to: number) => arr.slice(from, to).reduce((a, b) => a + b, 0);
  const last30 = (arr: number[]) => sum(arr, 335, 365);
  const prev30 = (arr: number[]) => sum(arr, 305, 335);
  const allLeadsDaily = enqDaily.map((v, i) => v + conDaily[i] + venDaily[i]);
  const totalLeads = enquiryDates.length + contactDates.length + vendorDates.length;

  const spark14 = (arr: number[]) => arr.slice(-14);
  const statusCount = (status: string) =>
    enquiryByStatus.find((row) => row.status === status)?._count._all ?? 0;
  const newLeads = statusCount("NEW");

  const kpis = [
    {
      label: "Total enquiries",
      value: totalLeads,
      href: "/admin/enquiries",
      icon: "inbox" as const,
      change: pctChange(last30(allLeadsDaily), prev30(allLeadsDaily)),
      compareText: "vs last 30 days",
      spark: spark14(allLeadsDaily),
    },
    {
      label: "New leads",
      value: newLeads,
      href: "/admin/enquiries?status=NEW",
      icon: "sparkles" as const,
      change: pctChange(last30(enqDaily), prev30(enqDaily)),
      compareText: "vs last 30 days",
      spark: spark14(enqDaily),
    },
    {
      label: "Products",
      value: productCount,
      href: "/admin/products",
      icon: "package" as const,
      change: null,
      compareText: `${productPublished} published`,
      spark: new Array(14).fill(productCount),
    },
    {
      label: "Customers",
      value: customerCount,
      href: "/admin/customers",
      icon: "users" as const,
      change: null,
      compareText: "on record",
      spark: new Array(14).fill(customerCount),
    },
    {
      label: "Categories",
      value: categoryCount,
      href: "/admin/categories",
      icon: "tags" as const,
      change: null,
      compareText: "catalogue groups",
      spark: new Array(14).fill(categoryCount),
    },
    {
      label: "Blog posts",
      value: blogCount,
      href: "/admin/blogs",
      icon: "file" as const,
      change: null,
      compareText: "total posts",
      spark: new Array(14).fill(blogCount),
    },
  ];

  /* ---- Donut ---- */
  const donut = [
    { label: "New", value: statusCount("NEW"), color: "#60a5fa" },
    { label: "In progress", value: statusCount("IN_PROGRESS"), color: "#fbbf24" },
    { label: "Contacted", value: statusCount("CONTACTED"), color: "#38bdf8" },
    { label: "Closed", value: statusCount("CLOSED"), color: "#34d399" },
  ];

  /* ---- Product performance bars ---- */
  const barProductIds = productEnquiryCounts.map((r) => r.productId).filter((v): v is string => Boolean(v));
  const barProducts = barProductIds.length
    ? await db.product.findMany({ where: { id: { in: barProductIds } }, select: { id: true, name: true } })
    : [];
  const totalProductEnquiries = productEnquiryCounts.reduce((a, r) => a + r._count._all, 0) || 1;
  const bars = productEnquiryCounts.map((r) => {
    const p = barProducts.find((bp) => bp.id === r.productId);
    return {
      label: p?.name ?? "Unknown product",
      value: r._count._all,
      meta: `${Math.round((r._count._all / totalProductEnquiries) * 100)}% share`,
    };
  });

  /* ---- Recent enquiries table ---- */
  const tableRows: EnquiryRow[] = recentEnquiries.map((e) => ({
    id: e.id,
    company: e.company ?? "—",
    contact: e.name,
    product: e.product?.name ?? "General enquiry",
    status: e.status,
    createdAt: e.createdAt.getTime(),
  }));

  return (
    <div className="mx-auto flex max-w-[100rem] flex-col gap-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-mono-meta text-accent">Command center</p>
          <h1 className="mt-1 font-display text-[1.75rem] leading-tight font-semibold tracking-tight text-ink">
            Business overview
          </h1>
          <p className="mt-1 text-body-sm text-mist">
            Live figures from the website database ·{" "}
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </header>

      {/* KPI cards */}
      <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} index={i} />
        ))}
      </section>

      {/* Performance + donut */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Reveal delay={0.05} className="adm-glow-card p-5 xl:col-span-2">
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <h2 className="text-heading-sm text-ink">Business performance</h2>
            <span className="text-mono-micro text-mist">Lead volume · monthly · last 12 months</span>
          </div>
          <MonthlyBarChart data={months} />
        </Reveal>

        <Reveal delay={0.12} className="adm-glow-card p-5">
          <h2 className="text-heading-sm text-ink">Enquiry pipeline</h2>
          <p className="mt-0.5 text-mono-micro text-mist">Product enquiries by status</p>
          <div className="mt-5">
            <StatusDonut slices={donut} centerLabel="enquiries" />
          </div>
          <Link
            href="/admin/enquiries"
            className="mt-5 block rounded-xs border border-line px-4 py-2.5 text-center text-body-sm text-accent transition-colors hover:border-accent/40 hover:text-accent-hover"
          >
            Open enquiry inbox
          </Link>
        </Reveal>
      </section>

      {/* Product performance */}
      <Reveal delay={0.05} className="adm-glow-card p-5">
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h2 className="text-heading-sm text-ink">Product performance</h2>
          <span className="text-mono-micro text-mist">Enquiries per product · all time</span>
        </div>
        {bars.length ? (
          <ProductBars rows={bars} unit="enq." />
        ) : (
          <p className="py-8 text-center text-body-sm text-mist">No product-linked enquiries yet.</p>
        )}
      </Reveal>

      {/* Recent enquiries table */}
      <Reveal delay={0.05} className="adm-glow-card p-5">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-heading-sm text-ink">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="text-body-sm text-accent hover:text-accent-hover">
            View all
          </Link>
        </div>
        <RecentEnquiries rows={tableRows} />
      </Reveal>

      {/* Global reach */}
      <Reveal delay={0.05} className="adm-glow-card p-5">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-heading-sm text-ink">Global reach</h2>
            <span className="text-mono-micro text-mist">
              {countries.length} active market{countries.length === 1 ? "" : "s"} · from Mumbai HQ
            </span>
          </div>
          <WorldMap markets={countries} />
          {countries.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {countries.map((c) => (
                <li key={c.code} className="rounded-full border border-line px-2.5 py-1 text-mono-micro text-slate">
                  {c.label}
                  <span className="text-mist"> · {c.direction}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-body-sm text-mist">No markets published yet — add them under Global reach.</p>
          )}
      </Reveal>

      {/* Quick actions */}
      <section aria-label="Quick actions">
        <h2 className="mb-3 text-mono-meta text-slate">Quick actions</h2>
        <QuickActions />
      </section>
    </div>
  );
}
