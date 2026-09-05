/**
 * Local MySQL bootstrap.
 *
 * Unlike the previous embedded-PostgreSQL launcher, this script does not
 * ship a database server — MySQL is expected to be running already
 * (Docker, Homebrew, XAMPP, a Hostinger remote, …). It verifies the
 * connection, creates the database with the correct charset/collation
 * if missing, and writes .env.local for the other tooling.
 *
 * Usage:
 *   node scripts/setup-local-mysql.mjs
 *
 * Honours MYSQL_HOST / MYSQL_PORT / MYSQL_USER / MYSQL_PASSWORD /
 * MYSQL_DB, or a full DATABASE_URL.
 *
 * Quickest way to get a server locally:
 *   docker run --name sriyaan-mysql -e MYSQL_ROOT_PASSWORD=root \
 *     -e MYSQL_DATABASE=sriyaan -p 3306:3306 -d mysql:8
 */
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import mariadb from "mariadb";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const HOST = process.env.MYSQL_HOST || "127.0.0.1";
const PORT = Number(process.env.MYSQL_PORT || 3306);
const USER = process.env.MYSQL_USER || "root";
const PASSWORD = process.env.MYSQL_PASSWORD ?? "root";
const DB = process.env.MYSQL_DB || "sriyaan";

/** utf8mb4 is required: the site stores ₹, — and emoji in content. */
const CHARSET = "utf8mb4";
const COLLATION = "utf8mb4_unicode_ci";

function buildUrl({ user, password, host, port, db }) {
  const auth = password
    ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
    : encodeURIComponent(user);
  return `mysql://${auth}@${host}:${port}/${db}`;
}

const url = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : buildUrl({ user: USER, password: PASSWORD, host: HOST, port: PORT, db: DB });

console.log(`[mysql] connecting to ${HOST}:${PORT} as ${USER}…`);

let conn;
try {
  // Connect without a database first so we can CREATE DATABASE if needed.
  conn = await mariadb.createConnection({
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    allowPublicKeyRetrieval: true,
    connectTimeout: 10_000,
  });
} catch (err) {
  console.error(`[mysql] could not connect to ${HOST}:${PORT} — ${err.message}`);
  console.error(
    "[mysql] Start a server first, e.g.:\n" +
      "  docker run --name sriyaan-mysql -e MYSQL_ROOT_PASSWORD=root \\\n" +
      "    -e MYSQL_DATABASE=sriyaan -p 3306:3306 -d mysql:8",
  );
  process.exit(1);
}

const [{ version }] = await conn.query("SELECT VERSION() AS version");
console.log(`[mysql] server version: ${version}`);

await conn.query(
  `CREATE DATABASE IF NOT EXISTS \`${DB}\` CHARACTER SET ${CHARSET} COLLATE ${COLLATION}`,
);
console.log(`[mysql] database \`${DB}\` ready (${CHARSET} / ${COLLATION})`);

await conn.end();

// Preserve any unrelated keys already present in .env.local.
const envPath = resolve(ROOT, ".env.local");
const keep = existsSync(envPath)
  ? readFileSync(envPath, "utf8")
      .split("\n")
      .filter(
        (line) =>
          line.trim() &&
          !line.startsWith("DATABASE_URL=") &&
          !line.startsWith("NEXT_PUBLIC_SITE_URL="),
      )
  : [];

writeFileSync(
  envPath,
  [
    `DATABASE_URL="${url}"`,
    `NEXT_PUBLIC_SITE_URL="http://localhost:3000"`,
    ...keep,
    "",
  ].join("\n"),
);

console.log(`[mysql] wrote .env.local`);
console.log(`[mysql] DATABASE_URL=${url}`);
console.log("[mysql] next: npm run db:generate && npm run db:migrate:apply");
