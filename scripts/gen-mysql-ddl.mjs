/**
 * Generate MySQL DDL from prisma/schema.prisma.
 *
 * Why this exists
 * ---------------
 * `prisma migrate diff` needs the native schema-engine binary, and the
 * WASM fallback used elsewhere in this repo (scripts/migrate.mjs) only
 * implements the PostgreSQL connector — it panics with "Unsupported
 * adapter provider: Mysql". Neither can run in a sandbox without
 * network access to binaries.prisma.sh.
 *
 * This generator produces the same DDL Prisma would emit for the MySQL
 * provider, following Prisma's documented mapping rules:
 *
 *   String            -> VARCHAR(191)        (utf8mb4 → 191*4 = 764 B,
 *                                             under the 767 B legacy
 *                                             index-prefix limit)
 *   String @db.Text   -> TEXT
 *   String @db.LongText -> LONGTEXT
 *   Int               -> INTEGER
 *   Boolean           -> BOOLEAN (TINYINT(1))
 *   DateTime          -> DATETIME(3)
 *   Decimal @db.Decimal(p,s) -> DECIMAL(p,s)
 *   Json              -> JSON
 *   enum X            -> ENUM('A','B',…)      (inline; MySQL has no
 *                                             CREATE TYPE)
 *
 * Engine/charset are pinned to InnoDB + utf8mb4_unicode_ci so foreign
 * keys work and the site can store ₹, — and emoji.
 *
 * Usage: node scripts/gen-mysql-ddl.mjs [outFile]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA = readFileSync(join(ROOT, "prisma/schema.prisma"), "utf8");

/* ------------------------- schema parsing ------------------------- */

/** Strip comments but keep the structure intact. */
function stripComments(src) {
  return src
    .split("\n")
    .map((l) => l.replace(/\/\/.*$/, "").replace(/^\s*\/\/\/.*$/, ""))
    .join("\n");
}

const CLEAN = stripComments(SCHEMA);

/** enum Name { A B C } */
function parseEnums(src) {
  const out = new Map();
  for (const m of src.matchAll(/enum\s+(\w+)\s*\{([^}]*)\}/g)) {
    const values = m[2]
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && /^\w+$/.test(l));
    out.set(m[1], values);
  }
  return out;
}

/** model Name { … } */
function parseModels(src) {
  const models = [];
  for (const m of src.matchAll(/model\s+(\w+)\s*\{([\s\S]*?)\n\}/g)) {
    const name = m[1];
    const body = m[2];
    const fields = [];
    const blockAttrs = [];
    for (const rawLine of body.split("\n")) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.startsWith("@@")) {
        blockAttrs.push(line);
        continue;
      }
      const fm = line.match(/^(\w+)\s+(\w+)(\[\])?(\?)?\s*(.*)$/);
      if (!fm) continue;
      fields.push({
        name: fm[1],
        type: fm[2],
        list: Boolean(fm[3]),
        optional: Boolean(fm[4]),
        attrs: fm[5] ?? "",
      });
    }
    models.push({ name, fields, blockAttrs });
  }
  return models;
}

const ENUMS = parseEnums(CLEAN);
const MODELS = parseModels(CLEAN);
const MODEL_NAMES = new Set(MODELS.map((m) => m.name));

/* --------------------------- type mapping -------------------------- */

function sqlType(field) {
  const { type, attrs } = field;
  if (ENUMS.has(type)) {
    return `ENUM(${ENUMS.get(type).map((v) => `'${v}'`).join(", ")})`;
  }
  switch (type) {
    case "String":
      if (/@db\.LongText/.test(attrs)) return "LONGTEXT";
      if (/@db\.Text/.test(attrs)) return "TEXT";
      if (/@db\.VarChar\((\d+)\)/.test(attrs)) {
        return `VARCHAR(${attrs.match(/@db\.VarChar\((\d+)\)/)[1]})`;
      }
      return "VARCHAR(191)";
    case "Int":
      return "INTEGER";
    case "BigInt":
      return "BIGINT";
    case "Boolean":
      return "BOOLEAN";
    case "DateTime":
      return "DATETIME(3)";
    case "Float":
      return "DOUBLE";
    case "Decimal": {
      const d = attrs.match(/@db\.Decimal\((\d+),\s*(\d+)\)/);
      return d ? `DECIMAL(${d[1]}, ${d[2]})` : "DECIMAL(65, 30)";
    }
    case "Json":
      return "JSON";
    default:
      return null; // relation field
  }
}

/** Default clause, mirroring Prisma's MySQL output. */
function defaultClause(field) {
  // Match @default(...) with balanced one-level nesting, e.g. now(), cuid(),
  // dbgenerated("…"). A naive [^)]* stops at the inner ")" of now().
  const m = field.attrs.match(/@default\((\w+\(\)|"(?:[^"\\]|\\.)*"|[^()]*)\)/);
  if (!m) return "";
  const raw = m[1].trim();
  if (raw === "now()") return " DEFAULT CURRENT_TIMESTAMP(3)";
  if (raw === "cuid()" || raw === "uuid()" || raw === "autoincrement()") return "";
  if (raw === "true") return " DEFAULT true";
  if (raw === "false") return " DEFAULT false";
  if (/^-?\d+(\.\d+)?$/.test(raw)) return ` DEFAULT ${raw}`;
  if (/^"(.*)"$/.test(raw)) return ` DEFAULT '${raw.slice(1, -1).replace(/'/g, "''")}'`;
  if (ENUMS.has(field.type)) return ` DEFAULT '${raw}'`;
  return "";
}

/** Columns that are `@updatedAt` need no MySQL-side default (Prisma writes them). */
function isScalar(field) {
  return sqlType(field) !== null && !field.list;
}

/* ---------------------------- key parsing -------------------------- */

/**
 * MySQL identifiers are capped at 64 characters. Prisma truncates
 * generated index names to fit (keeping the trailing _key/_idx marker),
 * e.g. ProductRelation_sourceProductId_relatedProductId_relationType_key
 * -> ProductRelation_sourceProductId_relatedProductId_relationTy_key.
 */
const MYSQL_MAX_IDENTIFIER = 64;
function fitIdentifier(name) {
  if (name.length <= MYSQL_MAX_IDENTIFIER) return name;
  const suffix = name.endsWith("_key") ? "_key" : name.endsWith("_idx") ? "_idx" : "";
  return name.slice(0, MYSQL_MAX_IDENTIFIER - suffix.length - 1) + suffix;
}

function parseKeyList(attr) {
  const inner = attr.match(/\[([^\]]+)\]/);
  if (!inner) return [];
  return inner[1].split(",").map((c) => {
    const t = c.trim();
    const desc = /\(sort:\s*Desc\)/.test(t);
    return { col: t.split("(")[0].trim(), desc };
  });
}

function keyCols(cols) {
  return cols.map(({ col, desc }) => `\`${col}\`${desc ? " DESC" : ""}`).join(", ");
}

/* ------------------------------ emit ------------------------------- */

const lines = [];
lines.push("-- SRIYAAN METALS — initial MySQL schema.");
lines.push("--");
lines.push("-- Generated from prisma/schema.prisma by scripts/gen-mysql-ddl.mjs.");
lines.push("-- Engine: InnoDB (required for foreign keys).");
lines.push("-- Charset: utf8mb4 / utf8mb4_unicode_ci (accented text, ₹, — and emoji;");
lines.push("-- the collation is case-insensitive, which is what the admin search relies on).");
lines.push("");

const foreignKeys = [];

for (const model of MODELS) {
  const scalars = model.fields.filter(isScalar);
  const colDefs = [];

  for (const f of scalars) {
    const nullable = f.optional ? "NULL" : "NOT NULL";
    colDefs.push(`    \`${f.name}\` ${sqlType(f)} ${nullable}${defaultClause(f)}`);
  }

  // PRIMARY KEY — field-level @id or block-level @@id
  const idField = model.fields.find((f) => /@id\b/.test(f.attrs));
  const blockId = model.blockAttrs.find((a) => a.startsWith("@@id("));
  if (idField) {
    colDefs.push(`    PRIMARY KEY (\`${idField.name}\`)`);
  } else if (blockId) {
    colDefs.push(`    PRIMARY KEY (${keyCols(parseKeyList(blockId))})`);
  }

  // UNIQUE — field-level @unique and block-level @@unique
  for (const f of model.fields) {
    if (/@unique\b/.test(f.attrs) && isScalar(f)) {
      const nm = fitIdentifier(`${model.name}_${f.name}_key`);
      colDefs.push(`    UNIQUE INDEX \`${nm}\`(\`${f.name}\`)`);
    }
  }
  for (const a of model.blockAttrs.filter((x) => x.startsWith("@@unique("))) {
    const cols = parseKeyList(a);
    const nm = fitIdentifier(`${model.name}_${cols.map((c) => c.col).join("_")}_key`);
    colDefs.push(`    UNIQUE INDEX \`${nm}\`(${keyCols(cols)})`);
  }

  // Secondary indexes
  for (const a of model.blockAttrs.filter((x) => x.startsWith("@@index("))) {
    const cols = parseKeyList(a);
    const nm = fitIdentifier(`${model.name}_${cols.map((c) => c.col).join("_")}_idx`);
    colDefs.push(`    INDEX \`${nm}\`(${keyCols(cols)})`);
  }

  lines.push(`-- CreateTable`);
  lines.push(`CREATE TABLE \`${model.name}\` (`);
  lines.push(colDefs.join(",\n"));
  lines.push(") DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;");
  lines.push("");

  // Relations -> foreign keys (only the side that declares `fields:`)
  for (const f of model.fields) {
    const rel = f.attrs.match(
      /@relation\((?:"[^"]*",\s*)?fields:\s*\[([^\]]+)\],\s*references:\s*\[([^\]]+)\](?:,\s*onDelete:\s*(\w+))?(?:,\s*onUpdate:\s*(\w+))?/,
    );
    if (!rel || !MODEL_NAMES.has(f.type)) continue;
    const localCols = rel[1].split(",").map((c) => c.trim());
    const refCols = rel[2].split(",").map((c) => c.trim());
    const onDelete = (rel[3] ?? (f.optional ? "SetNull" : "Restrict"))
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toUpperCase();
    const onUpdate = (rel[4] ?? "Cascade")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toUpperCase();
    foreignKeys.push(
      `ALTER TABLE \`${model.name}\` ADD CONSTRAINT \`${fitIdentifier(
        `${model.name}_${localCols.join("_")}_fkey`,
      )}\` ` +
        `FOREIGN KEY (${localCols.map((c) => `\`${c}\``).join(", ")}) ` +
        `REFERENCES \`${f.type}\`(${refCols.map((c) => `\`${c}\``).join(", ")}) ` +
        `ON DELETE ${onDelete} ON UPDATE ${onUpdate};`,
    );
  }
}

for (const fk of foreignKeys) {
  lines.push("-- AddForeignKey");
  lines.push(fk);
  lines.push("");
}

const ddl = lines.join("\n");
const out = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : join(ROOT, "prisma/migrations/20260905000000_initial_mysql_schema/migration.sql");
writeFileSync(out, ddl);
console.log(
  `[gen-mysql-ddl] ${MODELS.length} tables, ${foreignKeys.length} foreign keys -> ${out}`,
);
