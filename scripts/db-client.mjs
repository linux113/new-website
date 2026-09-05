/**
 * Shared Prisma client factory for standalone scripts (seeds, admin
 * bootstrap, deploy setup).
 *
 * Runtime code uses src/lib/db.ts, but that module is marked
 * `server-only` and resolves the `@/` alias, so scripts run through
 * tsx/node cannot import it. This factory keeps the MySQL adapter
 * wiring in exactly one place instead of repeating it per script.
 */
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.ts";

/**
 * Build a Prisma client bound to DATABASE_URL (mysql://…).
 * Scripts are short-lived, so the pool stays small.
 */
export function createScriptClient(url = process.env.DATABASE_URL) {
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Expected a MySQL connection string, e.g. " +
        "mysql://user:password@127.0.0.1:3306/sriyaan",
    );
  }
  const parsed = new URL(url);
  return new PrismaClient({
    adapter: new PrismaMariaDb({
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 3306,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ""),
      connectionLimit: 3,
    // Fail fast on an unreachable/misconfigured host instead of hanging
    // for the full pool-acquire timeout on every query.
    connectTimeout: 10_000,
    acquireTimeout: 10_000,
      dateStrings: false,
      insertIdAsNumber: true,
      decimalAsNumber: true,
      bigIntAsNumber: true,
    }),
  });
}
