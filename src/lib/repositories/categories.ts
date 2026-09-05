import "server-only";
import { db } from "@/lib/db";

/**
 * Category data access (server-side only).
 * Public readers return PUBLISHED rows only; admin readers arrive
 * with the admin phase. No raw SQL — Prisma query API throughout.
 */

export function getPublishedCategories() {
  return db.category.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { image: true },
  });
}

