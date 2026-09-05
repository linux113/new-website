/**
 * TEST-ONLY Prisma driver adapter: runs Prisma's MySQL SQL on SQLite.
 *
 * Why this exists
 * ---------------
 * This sandbox cannot download MySQL/MariaDB binaries (cdn.mysql.com,
 * dev.mysql.com and every MariaDB mirror are unreachable), so there is no
 * way to boot a real server here. To still exercise the whole admin panel
 * end-to-end after the PostgreSQL -> MySQL conversion, this adapter
 * reports `provider: "mysql"` — so Prisma's MySQL query compiler runs and
 * emits real MySQL SQL — and then translates that SQL to the SQLite
 * dialect just enough to execute it.
 *
 * It is a verification tool, NOT part of the app. Production uses
 * @prisma/adapter-mariadb against a real MySQL server. Never import this
 * from application code.
 */
import { DatabaseSync } from "node:sqlite";

const T = {
  Int32: 0, Int64: 1, Float: 2, Double: 3, Numeric: 4, Boolean: 5,
  Character: 6, Text: 7, Date: 8, Time: 9, DateTime: 10, Json: 11,
  Enum: 12, Bytes: 13,
};

/** Translate a MySQL statement into something SQLite understands. */
export function mysqlToSqlite(sql) {
  let out = sql;

  // Identifier quoting: `x` -> "x"
  out = out.replace(/`/g, '"');

  // MySQL string functions used by Prisma's compiler.
  out = out.replace(/CONCAT\(\s*'%'\s*,\s*\?\s*,\s*'%'\s*\)/gi, "('%' || ? || '%')");
  out = out.replace(/CONCAT\(\s*\?\s*,\s*'%'\s*\)/gi, "(? || '%')");
  out = out.replace(/CONCAT\(\s*'%'\s*,\s*\?\s*\)/gi, "('%' || ?)");
  out = out.replace(/\bCONCAT\(/gi, "(");

  // MySQL upsert -> SQLite upsert.
  out = out.replace(/\bON DUPLICATE KEY UPDATE\b/gi, "ON CONFLICT DO UPDATE SET");

  // Types inside CREATE TABLE.
  out = out
    .replace(/\bDATETIME\(3\)/gi, "TEXT")
    .replace(/\bLONGTEXT\b/gi, "TEXT")
    .replace(/\bVARCHAR\(\d+\)/gi, "TEXT")
    .replace(/\bENUM\([^)]*\)/gi, "TEXT")
    .replace(/\bDECIMAL\(\s*\d+\s*,\s*\d+\s*\)/gi, "REAL")
    .replace(/\bJSON\b(?!_)/gi, "TEXT")
    .replace(/\bBOOLEAN\b/gi, "INTEGER")
    .replace(/\bINTEGER\b/gi, "INTEGER");

  // Table options SQLite rejects.
  out = out.replace(/\)\s*DEFAULT CHARACTER SET[^;]*?ENGINE\s*=\s*InnoDB/gi, ")");
  out = out.replace(/CURRENT_TIMESTAMP\(3\)/gi, "CURRENT_TIMESTAMP");

  // Inline INDEX definitions are not valid inside SQLite CREATE TABLE;
  // strip them (the harness only needs correctness, not index plans).
  out = out
    .split("\n")
    .filter((l) => !/^\s*(UNIQUE\s+)?INDEX\s+"/i.test(l))
    .join("\n")
    .replace(/,(\s*\n\s*\))/g, "$1");

  return out;
}

function inferType(v) {
  if (v === null || v === undefined) return T.Text;
  switch (typeof v) {
    case "number":
      return Number.isInteger(v) ? T.Int64 : T.Double;
    case "bigint":
      return T.Int64;
    case "boolean":
      return T.Boolean;
    default:
      return v instanceof Uint8Array ? T.Bytes : T.Text;
  }
}

function normaliseArg(a) {
  if (a === null || a === undefined) return null;
  if (a instanceof Date) return a.toISOString().replace("T", " ").replace("Z", "");
  if (typeof a === "boolean") return a ? 1 : 0;
  if (typeof a === "bigint") return Number(a);
  if (typeof a === "object" && !(a instanceof Uint8Array)) return JSON.stringify(a);
  return a;
}

class SqliteQueryable {
  provider = "mysql";
  adapterName = "dev-mysql-shim";
  supportsRelationJoins = false;

  constructor(dbHandle) {
    this.db = dbHandle;
  }

  #prepare(query) {
    const sql = mysqlToSqlite(query.sql);
    const args = (query.args ?? []).map(normaliseArg);
    return { sql, args };
  }

  async queryRaw(query) {
    const { sql, args } = this.#prepare(query);
    if (process.env.SHIM_DEBUG) console.error("[shim]", sql, JSON.stringify(args).slice(0,200));
    let stmt;
    try { stmt = this.db.prepare(sql); }
    catch (e) { throw new Error(`shim prepare failed: ${e.message}\nSQL: ${sql}`); }
    // Only SELECT/RETURNING statements produce rows; everything else must
    // go through run() or node:sqlite throws.
    if (!/^\s*(SELECT|WITH|PRAGMA)/i.test(sql) && !/RETURNING/i.test(sql)) {
      let info;
      try { info = stmt.run(...args); }
      catch (e) { throw new Error(`shim run failed: ${e.message}\nSQL: ${sql}\nARGS: ${JSON.stringify(args)}`); }
      return {
        columnNames: [],
        columnTypes: [],
        rows: [],
        lastInsertId:
          info?.lastInsertRowid !== undefined ? String(info.lastInsertRowid) : undefined,
      };
    }
    const rows = stmt.all(...args);
    if (rows.length === 0) return { columnNames: [], columnTypes: [], rows: [] };
    const columnNames = Object.keys(rows[0]);
    const columnTypes = columnNames.map((c) => inferType(rows[0][c]));
    return {
      columnNames,
      columnTypes,
      rows: rows.map((r) => columnNames.map((c) => r[c])),
    };
  }

  async executeRaw(query) {
    const { sql, args } = this.#prepare(query);
    return Number(this.db.prepare(sql).run(...args).changes ?? 0);
  }
}

class ShimTransaction extends SqliteQueryable {
  options = { usePhantomQuery: true };
  constructor(dbHandle, savepoint) {
    super(dbHandle);
    this.savepoint = savepoint;
  }
  #finish() {
    if (this.db.__root === this.savepoint) {
      try { this.db.exec("COMMIT"); } catch { /* already closed */ }
      this.db.__inTx = false;
      this.db.__root = null;
    }
  }
  async commit() {
    if (process.env.SHIM_DEBUG) console.error("[tx] commit", this.savepoint);
    this.db.exec(`RELEASE SAVEPOINT ${this.savepoint}`);
    this.#finish();
  }
  async rollback() {
    if (process.env.SHIM_DEBUG) console.error("[tx] rollback", this.savepoint);
    try {
      this.db.exec(`ROLLBACK TO SAVEPOINT ${this.savepoint}`);
      this.db.exec(`RELEASE SAVEPOINT ${this.savepoint}`);
    } catch (e) {
      if (process.env.SHIM_DEBUG) console.error("[tx] rollback noop:", e.message);
    }
    this.#finish();
  }
  async createSavepoint(name) {
    this.db.exec(`SAVEPOINT ${name}`);
  }
  async rollbackToSavepoint(name) {
    this.db.exec(`ROLLBACK TO SAVEPOINT ${name}`);
  }
  async releaseSavepoint(name) {
    this.db.exec(`RELEASE SAVEPOINT ${name}`);
  }
}

let savepointSeq = 0;

class ShimAdapter extends SqliteQueryable {
  async executeScript(script) {
    this.db.exec(mysqlToSqlite(script));
  }
  async startTransaction() {
    // SQLite has no nested BEGIN. A SAVEPOINT outside a transaction
    // opens one implicitly, but it must be issued as its own statement
    // and released in order — so track depth and BEGIN only at the root.
    const name = `sp_${++savepointSeq}`;
    if (process.env.SHIM_DEBUG) console.error("[tx] start", name, "inTx=", !!this.db.__inTx);
    if (!this.db.__inTx) {
      this.db.exec("BEGIN");
      this.db.__inTx = true;
      this.db.__root = name;
    }
    this.db.exec(`SAVEPOINT ${name}`);
    return new ShimTransaction(this.db, name);
  }
  getConnectionInfo() {
    return { maxBindValues: 999, supportsRelationJoins: false };
  }
  async dispose() {}
}

/** Factory matching Prisma's SqlDriverAdapterFactory shape. */
export class PrismaDevMysqlShim {
  provider = "mysql";
  adapterName = "dev-mysql-shim";
  supportsRelationJoins = false;

  constructor(file) {
    this.db = new DatabaseSync(file);
    this.db.exec("PRAGMA foreign_keys = ON");
  }

  async connect() {
    return new ShimAdapter(this.db);
  }
}
