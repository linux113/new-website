import "server-only";
import { db } from "@/lib/db";

/**
 * Product data access (server-side only).
 * Publication rules: public queries always filter status PUBLISHED.
 */

const productListInclude = {
  category: true,
  images: {
    orderBy: { sortOrder: "asc" as const },
    take: 1,
    include: { media: true },
  },
} satisfies NonNullable<Parameters<typeof db.product.findMany>[0]>["include"];

export function getFeaturedProducts(limit = 6) {
  return db.product.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: limit,
    include: productListInclude,
  });
}

export function getPublishedProducts(params?: {
  categorySlug?: string;
  /** Accept several catalogue slugs (URL slug + legacy DB slugs). */
  categorySlugs?: string[];
  skip?: number;
  take?: number;
}) {
  const { categorySlug, categorySlugs, skip = 0, take = 24 } = params ?? {};
  const slugs = Array.from(
    new Set([...(categorySlugs ?? []), ...(categorySlug ? [categorySlug] : [])]),
  );
  return db.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(slugs.length > 0 ? { category: { slug: { in: slugs } } } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    skip,
    take,
    include: productListInclude,
  });
}

export function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, include: { media: true } },
      specifications: { orderBy: { sortOrder: "asc" } },
      applications: { orderBy: { sortOrder: "asc" } },
      documents: { orderBy: { sortOrder: "asc" }, include: { media: true } },
      relationsFrom: {
        include: { relatedProduct: { include: productListInclude } },
      },
      seo: { include: { ogImage: true } },
    },
  });
}
