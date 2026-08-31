// One-off launcher: starts an embedded PostgreSQL (Nix-less sandbox) and
// keeps it running. Writes connection details to .env.local for other tools.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = resolve(ROOT, ".pgdata");
mkdirSync(DATA_DIR, { recursive: true });

const PG_PORT = Number(process.env.PG_PORT || 55432);
const PG_USER = process.env.PG_USER || "sm";
const PG_PASSWORD = process.env.PG_PASSWORD || "sm_dev_pw";
const PG_DB = process.env.PG_DB || "sriyaan_dev";

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: PG_USER,
  password: PG_PASSWORD,
  port: PG_PORT,
  persistent: true,
  initdbFlags: ["--locale=C", "--encoding=UTF8"],
});

const url = `postgresql://${PG_USER}:${PG_PASSWORD}@127.0.0.1:${PG_PORT}/${PG_DB}?schema=public`;
writeFileSync(resolve(ROOT, ".env.local"), `DATABASE_URL="${url}"\nNEXT_PUBLIC_SITE_URL="http://localhost:3000"\n`);

console.log(`[pg] starting embedded postgres on :${PG_PORT} (data: ${DATA_DIR})`);
await pg.initialise();
await pg.start();
await pg.createDatabase(PG_DB).catch(() => {});
console.log(`[pg] ready — ${url}`);
console.log(`[pg] wrote .env.local`);

// Keep the process alive.
process.on("SIGTERM", async () => { try { await pg.stop(); } catch {} process.exit(0); });
process.on("SIGINT", async () => { try { await pg.stop(); } catch {} process.exit(0); });
setInterval(() => {}, 1 << 30);
