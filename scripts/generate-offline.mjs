/**
 * Offline-safe `prisma generate`.
 *
 * Why this exists
 * ---------------
 * The Prisma CLI declares a native `schema-engine` binary as a dependency of
 * the `prisma-client` generator and downloads it from binaries.prisma.sh.
 * In network-restricted environments (e.g. this sandbox, where that host is
 * unreachable — the same limitation `scripts/migrate.mjs` works around with
 * @prisma/schema-engine-wasm) the download fails and `prisma generate`
 * crashes before generating anything.
 *
 * The key fact: the Prisma 7 `prisma-client` generator produces the client
 * ENTIRELY in-process (WASM `getDMMF` + TypeScript generator) and never
 * actually executes the native schema-engine binary. So a tiny STUB
 * executable pointed at via `PRISMA_SCHEMA_ENGINE_BINARY` satisfies the
 * dependency check, and generation completes normally.
 *
 * Behaviour
 * ---------
 *   1. `PRISMA_SCHEMA_ENGINE_BINARY` already set → use it as-is.
 *   2. Otherwise run plain `prisma generate` (fast path: engine already
 *      cached or the network is available — the real binary is used).
 *   3. If that fails for a download/network reason, retry once with the
 *      stub binary.
 *
 * Usage:  node scripts/generate-offline.mjs   (or `npm run db:generate`)
 */
import { mkdtempSync, writeFileSync, chmodSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function runPrismaGenerate(extraEnv) {
  const isWin = process.platform === "win32";
  const result = spawnSync(
    isWin ? "cmd" : "npx",
    isWin ? ["/d", "/s", "/c", "npx", "--no-install", "prisma", "generate"] : ["--no-install", "prisma", "generate"],
    {
      stdio: "inherit",
      env: { ...process.env, ...extraEnv },
    },
  );
  return result.status === 0;
}

function isDownloadFailure(result) {
  // spawnSync with stdio:"inherit" still captures nothing on stdout;
  // rely on exit code + re-running with capture to classify. Callers
  // pass the captured output when they have it.
  const text = String(result ?? "").toLowerCase();
  const needles = [
    "binaries.prisma.sh",
    "downloading the engine file",
    "download failed",
    "enotfound",
    "econnreset",
    "econnrefused",
    "etimedout",
    "ssl_error",
    "socket disconnected",
    "network",
  ];
  return needles.some((n) => text.includes(n));
}

function runCaptured(extraEnv) {
  const isWin = process.platform === "win32";
  const result = spawnSync(
    isWin ? "cmd" : "npx",
    isWin ? ["/d", "/s", "/c", "npx", "--no-install", "prisma", "generate"] : ["--no-install", "prisma", "generate"],
    {
      encoding: "utf8",
      env: { ...process.env, ...extraEnv },
    },
  );
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  return { ok: result.status === 0, output };
}

function makeStubEngine() {
  const dir = mkdtempSync(join(tmpdir(), "prisma-stub-engine-"));
  const isWin = process.platform === "win32";
  const path = join(dir, isWin ? "schema-engine.cmd" : "schema-engine");
  if (isWin) {
    writeFileSync(path, "@echo off\r\nexit /b 0\r\n");
  } else {
    writeFileSync(path, "#!/bin/sh\nexit 0\n");
    chmodSync(path, 0o755);
  }
  return { path, dir };
}

/* ------------------------------------------------------------------ */

if (process.env.PRISMA_SCHEMA_ENGINE_BINARY) {
  console.log(
    `[generate-offline] PRISMA_SCHEMA_ENGINE_BINARY already set — using it.`,
  );
  process.exit(runPrismaGenerate() ? 0 : 1);
}

console.log("[generate-offline] Attempt 1: normal `prisma generate`…");
const first = runCaptured();
if (first.ok) {
  console.log("[generate-offline] Done (real engine).");
  process.exit(0);
}

if (!isDownloadFailure(first.output)) {
  console.error(
    "[generate-offline] `prisma generate` failed for a non-download reason — not retrying with the stub.",
  );
  process.exit(1);
}

console.log(
  "[generate-offline] Engine download failed (restricted network). Retrying with a stub schema-engine — the Prisma 7 `prisma-client` generator never executes it.",
);
const stub = makeStubEngine();
try {
  const second = runCaptured({
    PRISMA_SCHEMA_ENGINE_BINARY: stub.path,
  });
  if (!second.ok) {
    console.error(second.output);
    console.error("[generate-offline] Failed even with the stub — see output above.");
    process.exit(1);
  }
  console.log("[generate-offline] Done (stub engine — offline mode).");
  process.exit(0);
} finally {
  rmSync(stub.dir, { recursive: true, force: true });
}
