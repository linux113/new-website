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
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
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

/**
 * Run `npx --no-install <args>`, capturing output instead of exiting.
 * Returns { status, output }. Used where a non-zero exit is recoverable.
 */
function npxSoft(args) {
  const isWin = process.platform === "win32";
  const result = spawnSync(
    isWin ? "cmd" : "npx",
    isWin ? ["/d", "/s", "/c", "npx", ...args] : ["--no-install", ...args],
    { encoding: "utf8" },
  );
  if (result.error) throw result.error;
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  process.stdout.write(output);
  return { status: result.status ?? 1, output };
}

/** Name of the one migration directory that ships with the repo. */
function firstMigrationName() {
  const dir = new URL("../prisma/migrations/", import.meta.url);
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()[0];
}

/**
 * Apply migrations, tolerating a database whose schema was created
 * outside Prisma.
 *
 * Importing db-export/sriyaan-reset-and-import.sql builds all 32 tables
 * directly, so Prisma finds a populated database with no
 * _prisma_migrations bookkeeping table and refuses to continue:
 *
 *   Error: P3005
 *   The database schema is not empty.
 *
 * The schema in that SQL file is generated from this exact migration,
 * so the correct response is to baseline: record the migration as
 * already applied, then continue. That is a one-time no-op write; later
 * deploys take the normal `migrate deploy` path.
 */
function applyMigrations() {
  const first = npxSoft(["prisma", "migrate", "deploy"]);
  if (first.status === 0) return;

  if (!first.output.includes("P3005")) process.exit(first.status);

  const name = firstMigrationName();
  console.log(
    `[prod-build] P3005: schema already exists (created by the SQL import). ` +
      `Baselining "${name}" as applied…`,
  );
  npx(["prisma", "migrate", "resolve", "--applied", name]);
  npx(["prisma", "migrate", "deploy"]);
}

/**
 * Run the optional deploy bootstrap (scripts/deploy-setup.ts).
 *
 * This step only does anything when ADMIN_NAME + ADMIN_EMAIL +
 * ADMIN_PASSWORD are set; otherwise it is a no-op. It must therefore
 * never be able to fail a deploy.
 *
 * Two ways it used to break the build on shared hosting:
 *
 *   1. The script is TypeScript and was run via `npx tsx`. Hosts that
 *      run `npm install --omit=dev` (Hostinger does) have no tsx, and
 *      npx aborts non-interactively:
 *        npm error npx canceled due to missing packages and no YES
 *        option: ["tsx@4.23.13"]
 *      We now prefer the locally installed tsx binary, then fall back
 *      to Node's built-in type stripping (Node 22.6+), which needs no
 *      dependency at all.
 *
 *   2. Any runtime error inside the bootstrap aborted the build even
 *      though the site itself was fine.
 *
 * Failures are now reported as warnings and the build continues. The
 * admin user already exists (created by the SQL import), so a skipped
 * bootstrap is not a problem in practice.
 */
function runDeployBootstrap() {
  const hasAdminVars =
    process.env.ADMIN_NAME && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD;
  if (!hasAdminVars && !process.env.SEED_DEMO && !process.env.SEED_CONTENT) {
    console.log(
      "[prod-build] Deploy bootstrap skipped (no ADMIN_*/SEED_* env vars — nothing to do).",
    );
    return;
  }

  console.log("[prod-build] Running deploy bootstrap (admin / settings)…");
  const script = "scripts/deploy-setup.ts";
  const localTsx = join("node_modules", ".bin", process.platform === "win32" ? "tsx.cmd" : "tsx");

  const runners = existsSync(localTsx)
    ? [[localTsx, [script]]]
    : [[process.execPath, ["--experimental-strip-types", "--no-warnings", script]]];

  for (const [cmd, args] of runners) {
    const result = spawnSync(cmd, args, { stdio: "inherit" });
    if (!result.error && result.status === 0) return;
  }

  console.warn(
    "[prod-build] WARNING: deploy bootstrap did not complete. Continuing — " +
      "it is optional and only creates/updates the admin user. If you needed " +
      "it, run it manually: npx tsx scripts/deploy-setup.ts",
  );
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
  applyMigrations();
  runDeployBootstrap();
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
