import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { AdminPageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

export const metadata = { title: "Vendor requests" };

const PAGE_SIZE = 20;
const STATUSES = ["NEW", "IN_PROGRESS", "CONTACTED", "CLOSED", "SPAM"] as const;

async function fetchRows(q: string | undefined, status: string | undefined, page: number) {
  const where = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { company: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status && (STATUSES as readonly string[]).includes(status)
      ? { status: status as (typeof STATUSES)[number] }
      : {}),
  };
  const [rows, total] = await Promise.all([
    db.vendorRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.vendorRequest.count({ where }),
  ]);
  return { rows, total };
}

type VendorRow = Awaited<ReturnType<typeof fetchRows>>["rows"][number];

export default async function AdminVendorRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { q, page: pageParam, status } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { rows, total } = await fetchRows(q, status, page);

  const columns: Column<VendorRow>[] = [
    {
      key: "company",
      header: "Company",
      primary: true,
      render: (row) => (
        <Link href={`/admin/vendor-requests/${row.id}`} className="font-medium text-ink hover:text-accent">
          {row.company}
          <span className="text-slate"> — {row.name}</span>
        </Link>
      ),
    },
    { key: "email", header: "Email", render: (row) => row.email },
    {
      key: "offering",
      header: "Offering",
      render: (row) => <span className="line-clamp-1">{row.offering}</span>,
    },
    {
      key: "createdAt",
      header: "Received",
      render: (row) => row.createdAt.toLocaleDateString("en-GB"),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <LeadStatusSelect kind="vendor" id={row.id} status={row.status} />,
    },
  ];

  const filterHref = (s?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (s) params.set("status", s);
    const qs = params.toString();
    return qs ? `/admin/vendor-requests?${qs}` : "/admin/vendor-requests";
  };

  return (
    <>
      <AdminPageHeader
        title="Vendor requests"
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Vendor requests" }]}
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <AdminSearch basePath="/admin/vendor-requests" placeholder="Search company, name, email…" />
        <nav aria-label="Filter by status" className="flex flex-wrap gap-1.5">
          <Link
            href={filterHref()}
            className={cn(
              "rounded-full border px-2.5 py-1.5 text-mono-micro transition-colors",
              !status ? "border-accent/40 bg-accent-tint text-accent" : "border-line text-slate hover:text-ink",
            )}
          >
            ALL
          </Link>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={filterHref(s)}
              className={cn(
                "rounded-full border px-2.5 py-1.5 text-mono-micro transition-colors",
                status === s ? "border-accent/40 bg-accent-tint text-accent" : "border-line text-slate hover:text-ink",
              )}
            >
              {s.replace("_", " ")}
            </Link>
          ))}
        </nav>
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        page={page}
        pageCount={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePath="/admin/vendor-requests"
        query={q}
        emptyTitle="No vendor requests"
        emptyDescription={`${total === 0 ? "Supplier proposals submitted through the website will appear here." : ""}`}
      />
    </>
  );
}
