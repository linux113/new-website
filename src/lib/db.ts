import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma client singleton (server-side only).
 *
 * - `server-only` guarantees a build error if any client component
 *   ever imports this module — Prisma never reaches the browser.
 * - In development the client is cached on globalThis so Next.js
 *   hot reloads don't open a new connection pool per reload.
 * - Uses the MariaDB/MySQL driver adapter (Prisma 7 architecture);
 *   connection string comes exclusively from DATABASE_URL.
 *
 * The adapter speaks the MySQL wire protocol and serves both MySQL 8
 * and MariaDB. `connectionLimit` bounds the pool — shared hosting
 * plans (Hostinger) cap concurrent connections aggressively, so keep
 * this modest and override with DATABASE_CONNECTION_LIMIT.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function poolSize(): number {
  const raw = Number.parseInt(process.env.DATABASE_CONNECTION_LIMIT ?? "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 5;
}

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Expected a MySQL connection string, " +
        "e.g. mysql://user:password@127.0.0.1:3306/sriyaan",
    );
  }
  // PrismaMariaDb accepts either a connection URL string or a mariadb
  // PoolConfig — but not both, and pool options only exist on the
  // object form. Parse the URL so the pool limit can be applied.
  const parsed = new URL(url);
  const adapter = new PrismaMariaDb({
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    connectionLimit: poolSize(),
    // Fail fast on an unreachable/misconfigured host instead of hanging
    // for the full pool-acquire timeout on every query.
    connectTimeout: 10_000,
    acquireTimeout: 10_000,
    // Keep dates as JS Date objects (Prisma expects this, not strings).
    dateStrings: false,
    // The schema stores BigInt-free integers; returning Numbers avoids
    // BigInt leaking into JSON responses.
    insertIdAsNumber: true,
    decimalAsNumber: true,
    bigIntAsNumber: true,
  });
  return new PrismaClient({ adapter });
}

export const db: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
