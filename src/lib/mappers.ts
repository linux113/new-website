import "server-only";
import type { MediaRef, Post, Product as PatternProduct } from "@/content/types";

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

export function toMediaRef(
  media: DbMedia | null | undefined,
  altOverride?: string | null,
): MediaRef | null {
  if (!media?.publicUrl) return null;
  return {
    src: media.publicUrl,
    alt: altOverride ?? media.altText ?? "",
  };
}

export function toPatternProduct(row: DbProductListRow): PatternProduct {
  const firstImage = row.images[0];
  return {
    slug: row.slug,
    name: row.name,
    category: row.category.name,
    code: row.productCode ?? "—",
    specSummary: row.shortDescription
      ? { value: row.shortDescription, placeholder: "" }
      : { value: null, placeholder: "Specification on request" },
    media: firstImage
      ? [toMediaRef(firstImage.media, firstImage.altText) ?? { src: null, alt: row.name }]
      : [],
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
    title: row.title,
    date: row.publishedAt?.toISOString() ?? null,
    category: row.category?.name ?? "Insights",
    excerpt: row.excerpt ?? "",
    image: toMediaRef(row.featuredImage),
    href: `/blog/${row.slug}`,
  };
}
