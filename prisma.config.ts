import "./scripts/env.mjs";
import { defineConfig } from "prisma/config";

/**
 * Prisma CLI configuration.
 * The connection string comes exclusively from DATABASE_URL (see
 * .env.example). Runtime connections use the pg driver adapter in
 * src/lib/db.ts; migrations run through scripts/migrate.mjs (see
 * docs/DATABASE.md — sandbox-compatible WASM engine runner) or
 * `npx prisma migrate dev` in unrestricted environments.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
});
