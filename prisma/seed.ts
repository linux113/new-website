import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * SRIYAAN METALS — development seed.
 *
 * DEVELOPMENT ONLY. Creates a minimal set of obviously-placeholder
 * records so the dynamic frontend can be exercised locally. Every
 * string is bracketed placeholder content (DS §31) — NO real-world
 * products, customers, certifications, markets or statistics.
 *
 * All rows are created as DRAFT so nothing leaks into public queries
 * (which filter on PUBLISHED) even if this seed ever runs against a
 * shared database by mistake.
 *
 * Run:  npx tsx prisma/seed.ts
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed: this seed is DEVELOPMENT ONLY.");
  }

  // Idempotent: skip if the dev category already exists.
  const existing = await db.category.findUnique({
    where: { slug: "pending-client-category" },
  });
  if (existing) {
    console.log("Seed already present — nothing to do.");
    return;
  }

  const category = await db.category.create({
    data: {
      name: "[PENDING CLIENT CATEGORY]",
      slug: "pending-client-category",
      description: "[PENDING CLIENT CONTENT] — development placeholder.",
      status: "DRAFT",
      sortOrder: 0,
    },
  });

  await db.product.create({
    data: {
      name: "[PENDING CLIENT PRODUCT]",
      slug: "pending-client-product",
      shortDescription: "[PENDING CLIENT CONTENT]",
      productCode: "SM-DEV-000",
      status: "DRAFT",
      featured: false,
      categoryId: category.id,
      specifications: {
        create: [
          {
            name: "[PENDING SPECIFICATION]",
            value: "[PENDING CLIENT INPUT]",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await db.industry.createMany({
    data: [
      { name: "Construction", slug: "construction", status: "DRAFT", sortOrder: 0 },
      { name: "Automotive", slug: "automotive", status: "DRAFT", sortOrder: 1 },
      { name: "Engineering", slug: "engineering", status: "DRAFT", sortOrder: 2 },
      { name: "Infrastructure", slug: "infrastructure", status: "DRAFT", sortOrder: 3 },
    ],
  });

  console.log("Development seed complete (all rows DRAFT, all placeholder).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
