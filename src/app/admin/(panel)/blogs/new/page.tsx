import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { createBlogPostAction } from "@/lib/admin/blog-actions";
import { BlogForm } from "@/components/admin/BlogForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "New post" };

export default async function AdminBlogNewPage() {
  await requireAdminPage("EDITOR");
  const categories = await db.blogCategory.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <>
      <AdminPageHeader
        title="New post"
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Blog", href: "/admin/blogs" },
          { label: "New" },
        ]}
      />
      <AdminCard className="max-w-3xl">
        <BlogForm
          categories={categories}
          defaults={{}}
          action={createBlogPostAction}
          submitLabel="Create post"
        />
      </AdminCard>
    </>
  );
}
