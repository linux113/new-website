import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/content/site";

/**
 * Sitemap — public, published content only. Admin routes, drafts and
 * private lead pages are never included.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/enquiry`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/vendor`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/industries`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/quality`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/manufacturing`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/global-reach`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const [products, categories, posts] = await Promise.all([
      db.product.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      db.category.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      db.blogPost.findMany({
        where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticEntries,
      ...categories.map((cat) => ({
        url: `${SITE_URL}/products/category/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...products.map((product) => ({
        url: `${SITE_URL}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];
  } catch (error) {
    console.error("[sitemap] query failed:", error instanceof Error ? error.message : error);
    return staticEntries;
  }
}
