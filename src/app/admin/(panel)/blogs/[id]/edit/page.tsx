import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { updateBlogPostAction } from "@/lib/admin/blog-actions";
import { BlogForm } from "@/components/admin/BlogForm";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export const metadata = { title: "Edit post" };

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPage("EDITOR");
  const { id } = await params;

  const [post, categories] = await Promise.all([
    db.blogPost.findUnique({ where: { id }, include: { featuredImage: true } }),
    db.blogCategory.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!post) notFound();

  return (
    <>
      <AdminPageHeader
        title={post.title}
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Blog", href: "/admin/blogs" },
          { label: "Edit" },
        ]}
      />
      <AdminCard className="max-w-3xl">
        <BlogForm
          categories={categories}
          defaults={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? undefined,
            content: post.content ?? undefined,
            categoryId: post.categoryId ?? undefined,
            status: post.status,
            publishedAt: post.publishedAt?.toISOString(),
            featuredImageId: post.featuredImageId ?? undefined,
            featuredImageUrl: post.featuredImage?.publicUrl,
          }}
          action={updateBlogPostAction.bind(null, post.id)}
          submitLabel="Save changes"
        />
      </AdminCard>
    </>
  );
}
