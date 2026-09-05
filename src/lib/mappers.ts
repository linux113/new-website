import "server-only";
import type { MediaRef, Post, Product as PatternProduct } from "@/content/types";
import {
  findSeoProductByLeaf,
  getSeoCategory,
  productHref,
} from "@/content/seo-catalog";

/**
 * Resolve the public URL for a catalogue product.
 *
 * `/products/<slug>` is a shared namespace: the route resolves SEO
 * categories first, so a product whose slug collides with a category
 * slug (e.g. "carbon-steel-pipes") used to render the *category* page —
 * a different heading and a different image than the card the user
 * clicked. Nested SEO product pages have their own collision-free URL,
 * so prefer those and only fall back to the flat product route.
 */
function resolveProductHref(slug: string): string {
  const seoProduct = findSeoProductByLeaf(slug);
  if (seoProduct) return productHref(seoProduct);

  // Slug also names a category landing page (e.g. "pipe-flanges"): the flat
  // route resolves the category first, so use the nested, collision-free URL.
  const collidingCategory = getSeoCategory(slug);
  if (collidingCategory) return `/products/${collidingCategory.nest}/${slug}`;

  return `/products/${slug}`;
}

/**
 * DB row → frontend pattern type mappers.
 * Keeps Prisma result shapes out of pattern components — the same
 * components render placeholder data and database data identically.
 */

interface DbMedia {
  publicUrl: string | null;
  altText: string | null;
}

interface DbProductListRow {
  slug: string;
  name: string;
  productCode: string | null;
  shortDescription: string | null;
  category: { name: string };
  images: { media: DbMedia; altText: string | null }[];
}

/** Remove internal "(demo)"/"(sample)" markers from seeded content. */
export function stripDemoMarkers(value: string): string {
  return value.replace(/\s*\((demo|sample)\)\s*/gi, " ").replace(/\s{2,}/g, " ").trim();
}

export function toMediaRef(
  media: DbMedia | null | undefined,
  altOverride?: string | null,
): MediaRef | null {
  if (!media?.publicUrl) return null;
  return {
    src: media.publicUrl,
    alt: stripDemoMarkers(altOverride ?? media.altText ?? ""),
  };
}

export function toPatternProduct(row: DbProductListRow): PatternProduct {
  const firstImage = row.images[0];
  // Strip internal "(demo)" suffixes from seeded content so the public
  // site never shows placeholder markers.
  const stripDemo = (value: string) => value.replace(/\s*\(demo\)\s*$/i, "").trim();
  return {
    slug: row.slug,
    name: stripDemo(row.name),
    category: stripDemo(row.category.name),
    code: row.productCode ?? "—",
    specSummary: row.shortDescription
      ? { value: row.shortDescription, placeholder: "" }
      : { value: null, placeholder: "Specification on request" },
    media: firstImage
      ? [toMediaRef(firstImage.media, firstImage.altText) ?? { src: null, alt: row.name }]
      : [],
    href: resolveProductHref(row.slug),
  };
}

interface DbPostRow {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  category: { name: string } | null;
  featuredImage: DbMedia | null;
}

export function toPatternPost(row: DbPostRow): Post {
  return {
    slug: row.slug,
    title: stripDemoMarkers(row.title),
    date: row.publishedAt?.toISOString() ?? null,
    category: stripDemoMarkers(row.category?.name ?? "Insights"),
    excerpt: row.excerpt ?? "",
    image: toMediaRef(row.featuredImage),
    href: `/blog/${row.slug}`,
  };
}
