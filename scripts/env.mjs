/**
 * Shared environment loader for standalone scripts (migrations, seeds,
 * admin bootstrap).
 *
 * Next.js loads .env AND .env.local automatically, but `dotenv/config`
 * (used by these scripts) only reads .env. The local PostgreSQL
 * launcher (scripts/start-local-pg.mjs) writes .env.local, so without
 * this loader the DB scripts crashed with an undefined DATABASE_URL.
 *
 * Precedence (highest wins):
 *   1. variables already in the process environment (CI/Vercel/etc.)
 *   2. .env.local  (per-developer overrides, gitignored)
 *   3. .env        (committed template of local defaults, gitignored)
 *
 * Import this module in place of `import "dotenv/config"`.
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

dotenv.config({ path: resolve(root, ".env.local"), quiet: true });
dotenv.config({ path: resolve(root, ".env"), quiet: true });
