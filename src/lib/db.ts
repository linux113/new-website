import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma client singleton (server-side only).
 *
 * - `server-only` guarantees a build error if any client component
 *   ever imports this module — Prisma never reaches the browser.
 * - In development the client is cached on globalThis so Next.js
 *   hot reloads don't open a new connection pool per reload.
 * - Uses the pg driver adapter (Prisma 7 architecture); connection
 *   string comes exclusively from DATABASE_URL.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export const db: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
