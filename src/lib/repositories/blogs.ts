import "server-only";
import { db } from "@/lib/db";

/**
 * Blog data access (server-side only).
 * Public queries: PUBLISHED + publishedAt <= now, newest first.
 */

export function getPublishedPosts(params?: {
  categorySlug?: string;
  skip?: number;
  take?: number;
}) {
  const { categorySlug, skip = 0, take = 12 } = params ?? {};
  return db.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    skip,
    take,
    include: {
      featuredImage: true,
      category: true,
      author: { select: { id: true, name: true } },
    },
  });
}

export function getPostBySlug(slug: string) {
  return db.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      featuredImage: true,
      category: true,
      author: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
      seo: { include: { ogImage: true } },
    },
  });
}

export function getBlogCategories() {
  return db.blogCategory.findMany({
    orderBy: { sortOrder: "asc" },
  });
}
