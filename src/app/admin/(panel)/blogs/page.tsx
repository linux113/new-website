import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { deleteBlogPostAction } from "@/lib/admin/blog-actions";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import {
  AdminButtonLink,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/admin/ui";

export const metadata = { title: "Blog" };

const PAGE_SIZE = 20;

// Search is case-insensitive by virtue of the MySQL collation
// (utf8mb4_unicode_ci). Prisma's `mode: "insensitive"` is a
// PostgreSQL-only option and is rejected by the MySQL connector.
async function fetchRows(q: string | undefined, page: number) {
  const where = q ? { title: { contains: q } } : undefined;
  const [rows, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
      },
    }),
    db.blogPost.count({ where }),
  ]);
  return { rows, total };
}

type PostRow = Awaited<ReturnType<typeof fetchRows>>["rows"][number];

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { rows, total } = await fetchRows(q, page);

  const columns: Column<PostRow>[] = [
    {
      key: "title",
      header: "Title",
      primary: true,
      render: (row) => (
        <Link href={`/admin/blogs/${row.id}/edit`} className="font-medium text-ink hover:text-accent">
          {row.title}
        </Link>
      ),
    },
    { key: "category", header: "Category", render: (row) => row.category?.name ?? "—" },
    { key: "author", header: "Author", render: (row) => row.author?.name ?? "—" },
    {
      key: "publishedAt",
      header: "Published",
      render: (row) =>
        row.publishedAt ? row.publishedAt.toLocaleDateString("en-GB") : "—",
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
            href={`/admin/blogs/${row.id}/edit`}
            className="text-body-sm text-ink underline-offset-2 hover:underline"
          >
            Edit
          </Link>
          <ConfirmDelete
            label="post"
            description="This permanently deletes the blog post."
            action={deleteBlogPostAction.bind(null, row.id)}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Blog"
        crumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Blog" }]}
        actions={<AdminButtonLink href="/admin/blogs/new">New post</AdminButtonLink>}
      />
      <div className="mb-4">
        <AdminSearch basePath="/admin/blogs" placeholder="Search titles…" />
      </div>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        page={page}
        pageCount={Math.max(1, Math.ceil(total / PAGE_SIZE))}
        basePath="/admin/blogs"
        query={q}
        emptyTitle={q ? `No results for “${q}”` : "No posts yet"}
        emptyDescription={q ? "Try a different search." : "Draft the first article — it publishes only when you set it to Published."}
        emptyAction={
          <AdminButtonLink href="/admin/blogs/new" variant="secondary">
            New post
          </AdminButtonLink>
        }
      />
    </>
  );
}
