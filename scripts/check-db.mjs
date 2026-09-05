import "./env.mjs";
import mariadb from "mariadb";

/**
 * Diagnose the DATABASE_URL connection and say precisely what is wrong.
 *
 *   npm run db:check
 *
 * Distinguishes the failure modes that all look alike from the app:
 * unreachable host, IP not allowlisted, bad credentials, missing
 * database, and "connected but no tables yet".
 */

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("FAIL  DATABASE_URL is not set.");
  console.error("      Add it to .env, e.g.");
  console.error("      DATABASE_URL=\"mysql://user:password@host:3306/database\"");
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(url);
} catch {
  console.error("FAIL  DATABASE_URL is not a valid URL.");
  process.exit(1);
}

if (parsed.protocol !== "mysql:") {
  console.error(`FAIL  Expected a mysql:// URL, got "${parsed.protocol}//".`);
  process.exit(1);
}

const host = parsed.hostname;
const port = Number(parsed.port || 3306);
const user = decodeURIComponent(parsed.username);
const password = decodeURIComponent(parsed.password);
const database = parsed.pathname.replace(/^\//, "");

console.log("Connection target");
console.log("  host     ", host);
console.log("  port     ", port);
console.log("  user     ", user);
console.log("  database ", database);
console.log("  password ", password ? `set (${password.length} chars)` : "EMPTY");
console.log();

// A raw password containing these characters must be percent-encoded, or
// the URL parser silently truncates the credentials.
const RESERVED = ["@", ":", "/", "?", "#", "&", "%"];
const rawPw = url.slice(url.indexOf(":", url.indexOf("//")) + 1, url.lastIndexOf("@"));
const suspect = RESERVED.filter((c) => rawPw.includes(c));
if (suspect.length) {
  console.log(
    `WARN  The password in DATABASE_URL contains ${suspect.join(" ")} — ` +
      "percent-encode it (@ becomes %40) or the URL parses wrongly.",
  );
  console.log();
}

if (!user || !database) {
  console.error("FAIL  Username or database name is missing from the URL.");
  process.exit(1);
}

// Hostinger prefixes both the database and the user with the account id.
if (/^srv\d+\.hstgr\.io$/.test(host) || /hstgr/.test(host)) {
  const prefixed = /^u\d+_/;
  if (!prefixed.test(user) || !prefixed.test(database)) {
    console.log(
      "WARN  On Hostinger the username and database are prefixed like " +
        "u391782884_name. One of yours is not — that causes 'Access denied' " +
        "or 'Unknown database'.",
    );
    console.log();
  }
}

let conn;
try {
  conn = await mariadb.createConnection({
    host,
    port,
    user,
    password,
    database,
    connectTimeout: 10_000,
  });
} catch (error) {
  const code = error.code ?? "";
  const errno = error.errno ?? "";
  console.error(`FAIL  Could not connect  (${code} ${errno})`);
  console.error(`      ${String(error.message).split("\n")[0]}`);
  console.error();

  if (code === "ER_SOCKET_UNEXPECTED_CLOSE" || errno === 45009) {
    console.error("  The server accepted the TCP connection then closed it");
    console.error("  before the MySQL handshake. That is almost always an IP");
    console.error("  allowlist rejection, not a wrong password.");
    console.error();
    console.error("  Fix: hPanel -> Databases -> Remote MySQL, and add the");
    console.error("  public IP of THIS machine. If the app runs on the same");
    console.error("  Hostinger server, use localhost as the host instead.");
  } else if (code === "ER_ACCESS_DENIED_ERROR" || errno === 1045) {
    console.error("  Wrong username or password, or the user has no rights on");
    console.error("  this database. Check the full prefixed username, and");
    console.error("  percent-encode special characters in the password.");
  } else if (code === "ER_BAD_DB_ERROR" || errno === 1049) {
    console.error("  The user authenticated but that database does not exist.");
    console.error("  Use the full prefixed name, e.g. u391782884_sriyaanmetals.");
  } else if (code === "ECONNREFUSED") {
    console.error("  Nothing is listening on that host and port.");
  } else if (code === "ETIMEDOUT" || /timeout/i.test(String(error.message))) {
    console.error("  No response at all — a firewall is dropping the packets,");
    console.error("  or the hostname is wrong.");
  } else if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    console.error("  The hostname does not resolve. Check it for typos.");
  }
  process.exit(1);
}

console.log("OK    Connected.");

const [{ version, charset, collation }] = await conn.query(
  "SELECT VERSION() AS version, @@character_set_database AS charset, " +
    "@@collation_database AS collation",
);
console.log("  server    ", version);
console.log("  charset   ", charset, "/", collation);

if (!String(charset).startsWith("utf8mb4")) {
  console.log(
    `WARN  Character set is ${charset}, not utf8mb4 — accented and ` +
      "non-Latin characters will be mangled.",
  );
}

const [{ count }] = await conn.query(
  "SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = ?",
  [database],
);
const tables = Number(count);
console.log("  tables    ", tables);

if (tables === 0) {
  console.log();
  console.log("  Database is empty. Create the schema with:");
  console.log("    npm run db:migrate:apply");
} else {
  const rows = await conn.query(
    "SELECT table_name AS t FROM information_schema.tables " +
      "WHERE table_schema = ? AND table_name IN ('AdminUser','Product','WebsiteSetting')",
    [database],
  );
  const found = rows.map((r) => r.t);
  const expected = ["AdminUser", "Product", "WebsiteSetting"];
  const missing = expected.filter((t) => !found.includes(t));
  if (missing.length) {
    console.log();
    console.log(`WARN  Missing expected tables: ${missing.join(", ")}`);
    console.log("      Run: npm run db:migrate:apply");
  } else {
    const [{ admins }] = await conn.query("SELECT COUNT(*) AS admins FROM AdminUser");
    console.log("  admins    ", Number(admins));
    if (Number(admins) === 0) {
      console.log();
      console.log("  No admin user yet. Create one with:");
      console.log("    npx tsx scripts/deploy-setup.ts");
    } else {
      console.log();
      console.log("OK    Schema and admin user are in place.");
    }
  }
}

await conn.end();
