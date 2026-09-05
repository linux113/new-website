import "./scripts/env.mjs";
import { defineConfig } from "prisma/config";

/**
 * Prisma CLI configuration.
 * The connection string comes exclusively from DATABASE_URL (see
 * .env.example) and must be a MySQL URL. Runtime connections use the
 * MariaDB/MySQL driver adapter in src/lib/db.ts; migrations run with
 * `npx prisma migrate deploy` (or `migrate dev` locally). See
 * docs/DATABASE.md.
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
