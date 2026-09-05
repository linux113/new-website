import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { deleteProductAction } from "@/lib/admin/product-actions";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import {
  AdminButtonLink,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/admin/ui";

export const metadata = { title: "Products" };

const PAGE_SIZE = 20;

type ProductRow = Awaited<ReturnType<typeof fetchRows>>["rows"][number];

// Search is case-insensitive by virtue of the MySQL collation
// (utf8mb4_unicode_ci). Prisma's `mode: "insensitive"` is a
// PostgreSQL-only option and is rejected by the MySQL connector.
async function fetchRows(q: string | undefined, page: number) {
  const where = q
    ? {
        OR: [
          { name: { contains: q } },
          { productCode: { contains: q } },
          { slug: { contains: q } },
        ],
      }
    : undefined;

  const [rows, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { name: true } } },
    }),
    db.product.count({ where }),
  ]);
  return { rows, total };
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { rows, total } = await fetchRows(q, page);

  const columns: Column<ProductRow>[] = [
    {
      key: "name",
      header: "Product",
      primary: true,
      render: (row) => (
        <Link href={`/admin/products/${row.id}/edit`} className="font-medium text-ink hover:text-accent">
          {row.name}
        </Link>
      ),
    },
    { key: "code", header: "Code", render: (row) => row.productCode ?? "—" },
    { key: "category", header: "Category", render: (row) => row.category.name },
    {
      key: "featured",
      header: "Featured",
      render: (row) => (row.featured ? "Yes" : "—"),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <span className="flex items-center gap-2">
          <Link
            href={`/admin/products/${row.id}/edit`}
            className="text-body-sm text-ink underline-offset-2 hover:underline"
          >
            Edit
          </Link>
          <ConfirmDelete
            label="product"
            description="This permanently deletes the product with its images, specifications, applications and documents."
            action={deleteProductAction.bind(null, row.id)}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Products"
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Products" }]}
        actions={<AdminButtonLink href="/admin/products/new">New product</AdminButtonLink>}
      />
      <div className="mb-4">
        <AdminSearch basePath="/admin/products" placeholder="Search name, code, slug…" />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        page={page}
        pageCount={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePath="/admin/products"
        query={q}
        emptyTitle={q ? `No results for “${q}”` : "No products yet"}
        emptyDescription={
          q
            ? "Try a different search."
            : "Create the first product. It stays hidden until you publish it."
        }
        emptyAction={
          <AdminButtonLink href="/admin/products/new" variant="secondary">
            New product
          </AdminButtonLink>
        }
      />
    </>
  );
}
