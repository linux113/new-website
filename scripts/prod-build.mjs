/**
 * One-shot production build for hosts that run `npm run build`
 * automatically — Hostinger Node.js web apps, VPS/CI, plain `npm run
 * build` on a fresh checkout.
 *
 * Why this exists
 * ---------------
 * Hostinger's managed Node.js hosting runs `npm install` and then the
 * package.json `build` script. There is no SSH/npm access to run extra
 * steps, so every Prisma step has to live inside this one command:
 *
 *   1. Generate the Prisma client from prisma/schema.prisma.
 *      The client output (src/generated/) is gitignored, so a plain
 *      `next build` on a fresh checkout fails with
 *
 *        Module not found: Can't resolve '@/generated/prisma/client'
 *
 *      immediately after "Creating an optimized production build …".
 *
 *   2. When DATABASE_URL is set: apply pending migrations with
 *      `prisma migrate deploy` and run the idempotent deploy bootstrap
 *      (scripts/deploy-setup.ts — creates the first admin user and
 *      guarantees social/settings rows). Both are skipped with a log
 *      line when DATABASE_URL is absent so the build also succeeds
 *      while the database is still being provisioned.
 *
 *   3. Run `next build`.
 *
 * Vercel does not use this file — vercel.json pins the deploy to
 * `npm run vercel-build`, which runs the same steps explicitly.
 */
import { spawnSync } from "node:child_process";
import process from "node:process";

/** Run `npx --no-install <args>` (resolves from local node_modules). */
function npx(args) {
  const isWin = process.platform === "win32";
  const result = spawnSync(
    isWin ? "cmd" : "npx",
    isWin ? ["/d", "/s", "/c", "npx", ...args] : ["--no-install", ...args],
    { stdio: "inherit" },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

/** Run `node <args>` with the current interpreter. */
function node(args) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// 1/3 — Prisma client (offline-safe generator: normal `prisma generate`
// first, stub-engine fallback only if the schema-engine download fails).
console.log("[prod-build] 1/3 Generating Prisma client (schema → src/generated)…");
node(["scripts/generate-offline.mjs"]);

// 2/3 — Database preparation (only when a database is configured).
if (process.env.DATABASE_URL) {
  console.log("[prod-build] 2/3 DATABASE_URL found — applying pending migrations…");
  npx(["--no-install", "prisma", "migrate", "deploy"]);
  console.log("[prod-build] Running deploy bootstrap (admin / settings)…");
  npx(["--no-install", "tsx", "scripts/deploy-setup.ts"]);
} else {
  console.log(
    "[prod-build] 2/3 DATABASE_URL not set — skipping migrations and deploy bootstrap. " +
      "Set DATABASE_URL (hosting dashboard env vars / .env) and redeploy before going live.",
  );
}

// 3/3 — Next.js production build.
console.log("[prod-build] 3/3 Running next build…");
npx(["--no-install", "next", "build"]);

console.log("[prod-build] Done.");
