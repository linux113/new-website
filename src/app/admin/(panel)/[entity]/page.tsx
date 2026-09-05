import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { deleteEntityAction } from "@/lib/admin/actions";
import { getEntity } from "@/lib/admin/entities";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import {
  AdminButtonLink,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/admin/ui";
import Link from "next/link";

const PAGE_SIZE = 20;

/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic model access over a closed registry */

/**
 * Generic list page for config-driven entities
 * (categories, industries, certifications, infrastructure,
 * customers, testimonials, global-reach).
 */
export default async function EntityListPage({
  params,
  searchParams,
}: {
  params: Promise<{ entity: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { entity } = await params;
  const config = getEntity(entity);
  if (!config) notFound();

  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const searchField = config.fields[0].name; // first field is the display name

  // Search is case-insensitive by virtue of the MySQL collation
  // (utf8mb4_unicode_ci). Prisma's `mode: "insensitive"` is a
  // PostgreSQL-only option and is rejected by the MySQL connector.
  const where = q
    ? { [searchField]: { contains: q } }
    : undefined;

  const modelClient = (db as any)[config.model];
  const [rows, total] = await Promise.all([
    modelClient.findMany({
      where,
      orderBy: config.hasSortOrder ? [{ sortOrder: "asc" }, { updatedAt: "desc" }] : { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    modelClient.count({ where }),
  ]);

  const columns: Column<any>[] = [
    ...config.listColumns.map((key, i) => ({
      key,
      header: config.fields.find((f) => f.name === key)?.label ?? key,
      primary: i === 0,
      render: (row: any) =>
        i === 0 ? (
          <Link
            href={`/admin/${config.segment}/${row.id}/edit`}
            className="font-medium text-ink hover:text-accent"
          >
            {String(row[key] ?? "—")}
          </Link>
        ) : (
          String(row[key] ?? "—")
        ),
    })),
    ...(config.hasStatus
      ? [
          {
            key: "status",
            header: "Status",
            render: (row: any) => <AdminStatusBadge status={row.status} />,
          },
        ]
      : []),
    {
      key: "actions",
      header: "Actions",
      render: (row: any) => (
        <span className="flex items-center gap-2">
          <Link
            href={`/admin/${config.segment}/${row.id}/edit`}
            className="text-body-sm text-ink underline-offset-2 hover:underline"
          >
            Edit
          </Link>
          <ConfirmDelete
            label={config.titleSingular.toLowerCase()}
            description={`This permanently deletes the ${config.titleSingular.toLowerCase()}.`}
            action={deleteEntityAction.bind(null, config.segment, row.id)}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title={config.titlePlural}
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: config.titlePlural }]}
        actions={
          <AdminButtonLink href={`/admin/${config.segment}/new`}>
            New {config.titleSingular.toLowerCase()}
          </AdminButtonLink>
        }
      />
      <div className="mb-4">
        <AdminSearch basePath={`/admin/${config.segment}`} />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row: any) => row.id}
        page={page}
        pageCount={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePath={`/admin/${config.segment}`}
        query={q}
        emptyTitle={q ? `No results for “${q}”` : `No ${config.titlePlural.toLowerCase()} yet`}
        emptyDescription={
          q ? "Try a different search." : `Create the first ${config.titleSingular.toLowerCase()} to publish it on the website.`
        }
        emptyAction={
          <AdminButtonLink href={`/admin/${config.segment}/new`} variant="secondary">
            New {config.titleSingular.toLowerCase()}
          </AdminButtonLink>
        }
      />
    </>
  );
}
