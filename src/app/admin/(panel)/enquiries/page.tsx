import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { AdminPageHeader, AdminStatusBadge } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

export const metadata = { title: "Enquiries" };

const PAGE_SIZE = 20;
const STATUSES = ["NEW", "IN_PROGRESS", "CONTACTED", "CLOSED", "SPAM"] as const;

// Search is case-insensitive by virtue of the MySQL collation
// (utf8mb4_unicode_ci). Prisma's `mode: "insensitive"` is a
// PostgreSQL-only option and is rejected by the MySQL connector.
async function fetchRows(q: string | undefined, status: string | undefined, page: number) {
  const where = {
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { company: { contains: q } },
          ],
        }
      : {}),
    ...(status && (STATUSES as readonly string[]).includes(status)
      ? { status: status as (typeof STATUSES)[number] }
      : {}),
  };
  const [rows, total] = await Promise.all([
    db.productEnquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { product: { select: { name: true } } },
    }),
    db.productEnquiry.count({ where }),
  ]);
  return { rows, total };
}

type EnquiryRow = Awaited<ReturnType<typeof fetchRows>>["rows"][number];

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { q, page: pageParam, status } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { rows, total } = await fetchRows(q, status, page);

  const columns: Column<EnquiryRow>[] = [
    {
      key: "name",
      header: "From",
      primary: true,
      render: (row) => (
        <Link href={`/admin/enquiries/${row.id}`} className="font-medium text-ink hover:text-accent">
          {row.name}
          {row.company ? <span className="text-slate"> — {row.company}</span> : null}
        </Link>
      ),
    },
    { key: "email", header: "Email", render: (row) => row.email },
    { key: "product", header: "Product", render: (row) => row.product?.name ?? "General" },
    {
      key: "createdAt",
      header: "Received",
      render: (row) => row.createdAt.toLocaleDateString("en-GB"),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <LeadStatusSelect kind="enquiry" id={row.id} status={row.status} />,
    },
  ];

  const filterHref = (s?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (s) params.set("status", s);
    const qs = params.toString();
    return qs ? `/admin/enquiries?${qs}` : "/admin/enquiries";
  };

  return (
    <>
      <AdminPageHeader
        title="Product enquiries"
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Enquiries" }]}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <AdminSearch basePath="/admin/enquiries" placeholder="Search name, email, company…" />
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
              aria-current={status === s ? "true" : undefined}
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
        basePath="/admin/enquiries"
        query={q}
        emptyTitle="No enquiries"
        emptyDescription="Product enquiries submitted through the website will appear here."
      />
      <p className="mt-4 text-mono-micro text-slate">
        {total} total · <AdminStatusBadge status="NEW" /> items need first contact.
      </p>
    </>
  );
}
