import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { AdminPageHeader, AdminStatusBadge } from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import Link from "next/link";

export const metadata = { title: "Contact messages" };

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
            { subject: { contains: q } },
          ],
        }
      : {}),
    ...(status && (STATUSES as readonly string[]).includes(status)
      ? { status: status as (typeof STATUSES)[number] }
      : {}),
  };
  const [rows, total] = await Promise.all([
    db.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.contactMessage.count({ where }),
  ]);
  return { rows, total };
}

type MessageRow = Awaited<ReturnType<typeof fetchRows>>["rows"][number];

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { q, page: pageParam, status } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { rows, total } = await fetchRows(q, status, page);

  const columns: Column<MessageRow>[] = [
    {
      key: "name",
      header: "From",
      primary: true,
      render: (row) => (
        <span className="font-medium text-ink">
          {row.name}
          {row.company ? <span className="text-slate"> — {row.company}</span> : null}
        </span>
      ),
    },
    {
      key: "email",
      header: "Contact",
      render: (row) => (
        <span className="text-slate">
          <a href={`mailto:${row.email}`} className="hover:text-accent">
            {row.email}
          </a>
          {row.phone ? <span className="block text-mono-micro">{row.phone}</span> : null}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Message",
      render: (row) => (
        <span className="block max-w-md">
          {row.subject ? <span className="block font-medium text-ink">{row.subject}</span> : null}
          <span className="block text-slate">
            {row.message.length > 140 ? `${row.message.slice(0, 140)}…` : row.message}
          </span>
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Received",
      render: (row) => row.createdAt.toLocaleDateString("en-GB"),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <LeadStatusSelect kind="contact" id={row.id} status={row.status} />,
    },
  ];

  const filterHref = (s?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (s) params.set("status", s);
    const qs = params.toString();
    return qs ? `/admin/messages?${qs}` : "/admin/messages";
  };

  return (
    <>
      <AdminPageHeader
        title="Contact messages"
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Messages" }]}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <AdminSearch basePath="/admin/messages" placeholder="Search name, email, company, subject…" />
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
        basePath="/admin/messages"
        query={q}
        emptyTitle="No messages"
        emptyDescription="Messages sent through the website contact form will appear here."
      />
      <p className="mt-4 text-mono-micro text-slate">
        {total} total · <AdminStatusBadge status="NEW" /> items need first contact.
      </p>
    </>
  );
}
