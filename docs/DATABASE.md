# Database

> Deploying to Hostinger? Follow
> [HOSTINGER-DATABASE-SETUP.md](./HOSTINGER-DATABASE-SETUP.md) for the
> hPanel click-by-click walkthrough.

**Stack:** MySQL 8 · Prisma 7 (MariaDB/MySQL driver adapter) · Zod validation
**Schema:** `prisma/schema.prisma` · **Client output:** `src/generated/prisma/` (gitignored, regenerate with `npm run db:generate`)

> No business data lives in the schema or seeds. All real records arrive
> later through the admin panel. Public queries filter `status: PUBLISHED`,
> so draft/dev rows can never leak to the website.

---

## 1. Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MySQL connection string, `mysql://USER:PASS@HOST:3306/DB` (Prisma CLI + runtime) |
| `DATABASE_CONNECTION_LIMIT` | Optional pool size (default `5`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |

Copy `.env.example` → `.env`. **Never commit `.env`.** No credentials are
hardcoded anywhere; `prisma/schema.prisma` intentionally has no `url` field
(Prisma 7) — the connection comes from `prisma.config.ts` (CLI) and the
MariaDB/MySQL adapter in `src/lib/db.ts` (runtime), both reading
`DATABASE_URL`.

The database must be created with **`utf8mb4` / `utf8mb4_unicode_ci`**.
That collation is case-insensitive, which is what the admin search relies
on (see §"MySQL specifics" below).

## 2. Setup (fresh environment)

```bash
cp .env.example .env          # fill DATABASE_URL (mysql://…)
npm install
npm run db:setup              # verify MySQL, create the DB, write .env.local
npm run db:generate           # prisma generate → src/generated/prisma
npm run db:migrate:apply      # prisma migrate deploy
npm run db:seed               # optional, DEVELOPMENT ONLY
```

Need a server locally?

```bash
docker run --name sriyaan-mysql -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=sriyaan -p 3306:3306 -d mysql:8
```

### Offline client generation

This sandbox cannot reach `binaries.prisma.sh`, so the Prisma CLI cannot
download its native engines. `scripts/generate-offline.mjs` (behind
`npm run db:generate`) first tries a normal `prisma generate`; if the
engine download fails it retries with a stub
`PRISMA_SCHEMA_ENGINE_BINARY`. That is safe because the Prisma 7
`prisma-client` generator builds the client entirely in-process (WASM
`getDMMF`) and never executes the native binary. In unrestricted
environments the real engine is used transparently.

```bash
npm run db:generate                   # offline-safe client generation
npm run db:migrate:create -- <name>   # prisma migrate dev --create-only
npm run db:migrate:apply              # prisma migrate deploy
npm run db:migrate:status             # prisma migrate status
npm run db:ddl                        # regenerate the MySQL DDL from the schema
```

> The former `scripts/migrate.mjs` WASM runner was removed: the bundled
> `@prisma/schema-engine-wasm` only implements the PostgreSQL connector
> and panics with *"Unsupported adapter provider: Mysql"*. Migrations now
> go through the normal Prisma CLI, which works wherever the engine can
> be downloaded.

### MySQL specifics

Things that differ from the previous PostgreSQL setup — read before
adding queries or columns:

- **Text lengths.** Prisma maps a bare `String` to `VARCHAR(191)` on
  MySQL. Every prose column in the schema therefore carries an explicit
  `@db.Text` (or `@db.LongText` for blog/page bodies). If you add a
  free-text field, add the annotation too or it will silently truncate.
- **Keys stay on `VARCHAR`.** MySQL cannot index a `TEXT` column without
  a prefix length, so anything `@unique`/`@@index`ed must remain
  `VARCHAR(191)` (191 × 4 bytes utf8mb4 = 764 B, inside the index limit).
- **Case-insensitive search.** Prisma's `mode: "insensitive"` is
  PostgreSQL-only and is rejected by the MySQL connector. It has been
  removed from all admin search queries — `utf8mb4_unicode_ci` already
  compares case-insensitively.
- **Identifier length.** MySQL caps names at 64 characters; the DDL
  generator truncates long index names exactly the way Prisma does.
- **Enums are inline.** MySQL has no `CREATE TYPE`, so each enum becomes
  an inline `ENUM(...)` column definition.
- **Engine.** All tables are `InnoDB` — required for foreign keys.

## 3. Enums

| Enum | Values | Used by |
|---|---|---|
| `AdminRole` | SUPER_ADMIN, ADMIN, EDITOR | AdminUser |
| `AdminStatus` | ACTIVE, SUSPENDED | AdminUser |
| `ContentStatus` | DRAFT, PUBLISHED | All public content models |
| `BlogStatus` | DRAFT, PUBLISHED, ARCHIVED | BlogPost |
| `EnquiryStatus` | NEW, IN_PROGRESS, CONTACTED, CLOSED, SPAM | All lead models |
| `MediaType` | IMAGE, VIDEO, DOCUMENT | MediaAsset |
| `ProductRelationType` | RELATED, ALTERNATIVE, ACCESSORY | ProductRelation |
| `ProductDocumentType` | DATASHEET, DRAWING, CATALOGUE, CERTIFICATE, OTHER | ProductDocument |

## 4. Models (33)

### Admin
- **AdminUser** — `passwordHash` only (bcrypt/argon2 at the app layer; never plaintext). Unique `email`; roles + status enums; `lastLoginAt`.

### SEO
- **SeoMeta** — normalized SEO table (meta/OG/canonical/robots) referenced 1:1 by Category, Product, BlogPost, CompanyPage via unique `seoId`. Avoids duplicated SEO columns.

### Media
- **MediaAsset** — provider-agnostic (`storageProvider` + `storageKey`, unique together) — R2/S3-compatible. Dimensions, size, mime, alt, JSON metadata. Referenced by every image/document relation. **No uploads implemented yet.**

### Catalog
- **Category** — unique slug, status, sortOrder, optional image + SEO.
- **Product** — unique slug + unique optional `productCode`, category (`onDelete: Restrict` — a category with products cannot be deleted), featured flag, SEO.
- **ProductImage / ProductSpecification / ProductApplication / ProductDocument** — child tables, `onDelete: Cascade` from product; images/documents point at MediaAsset with `Restrict` (an asset in use cannot be deleted).
- **ProductRelation** — directed self-relation with type; unique (source, related, type).

### Blog
- **BlogCategory**, **BlogPost** (unique slug, BlogStatus, `publishedAt`, author → AdminUser `SetNull`, featured image `SetNull`, SEO), **BlogTag**, **BlogPostTag** (explicit m:n join, cascade both ways).

### Company content (admin-manageable)
- **CompanyPage** (unique `key`), **Capability** (optional verified metric columns), **Industry**, **InfrastructureItem**, **Certification**, **Customer** (with `consent` flag — logos publish only with permission), **Testimonial** (→ Customer optional), **GlobalCountry** (unique ISO code; publishing a row = verified market), **ImportExportCapability**.

### Leads
- **ProductEnquiry** (→ Product `SetNull`), **ContactMessage**, **VendorRequest** — all with EnquiryStatus, `source`, timestamps.

### Settings
- **WebsiteSetting** (unique key, JSON value, group), **SocialLink** (unique platform), **NavigationItem** (hierarchical, self-relation cascade).

### Analytics (first-party, no PII)
- **PageView** — one row per public page view. `visitorId` / `sessionId` are opaque random cookie tokens (never IP, email, or user-agent). `dayKey` is the Asia/Kolkata civil date for daily rollups.
- **VisitorPresence** — sliding “who is on the site now” keyed by `sessionId`. A session is live when `lastSeenAt` is within 5 minutes.

## 5. Relationship map

```
Category ──< Product ──< ProductImage ──> MediaAsset
                   │ ──< ProductSpecification
                   │ ──< ProductApplication
                   │ ──< ProductDocument ──> MediaAsset
                   │ ──< ProductRelation >── Product (self, typed)
                   │ ──< ProductEnquiry
BlogCategory ──< BlogPost >── AdminUser (author)
                   │ ──< BlogPostTag >── BlogTag
Customer ──< Testimonial
SeoMeta 1─1 {Category | Product | BlogPost | CompanyPage}
MediaAsset ──< {images, documents, logos, avatars, OG images}
NavigationItem ──< NavigationItem (tree)
```

**Delete policy (deliberate, not blanket CASCADE):**
- Cascade: product children, blog tags join, nav subtree.
- Restrict: Product→Category, media in active use (ProductImage/Document).
- SetNull: optional decorations (SEO, images, authors, customers on testimonials).

## 6. Indexes (95 total)

Composite, query-shaped — not blanket:
- Slugs/emails/keys: unique indexes (Category.slug, Product.slug, Product.productCode, BlogPost.slug, AdminUser.email, GlobalCountry.code, WebsiteSetting.key, MediaAsset (provider,key), …).
- Lists: `(status, sortOrder)` on every admin-ordered content table.
- Blog feed: `(status, publishedAt DESC)`; `(categoryId, status)`.
- Catalog: `(categoryId, status)`, `(status, featured)`.
- Leads: `(status, createdAt DESC)` + `email` per lead table.
- FK helper indexes on all relation columns.

## 7. Data access layers

```
src/lib/
├── db.ts                  # Prisma singleton — import "server-only" guard
├── validation/            # Zod: shared, category, product, blog, enquiry, vendor
└── repositories/          # products, categories, blogs, enquiries, content
```

- `db.ts`: dev-global singleton (no pool churn under HMR), MariaDB/MySQL adapter, `server-only` makes any client-component import a build error.
- Validation: `.strict()` schemas with bounded lengths; lead forms include a honeypot field that is stripped before persistence.
- Repositories: public readers hard-filter `PUBLISHED` (+ `consent` for customers, `publishedAt <= now` for posts); enquiry writes accept only Zod-validated input types. No raw SQL anywhere.

## 8. Seed

`prisma/seed.ts` — DEVELOPMENT ONLY:
- Refuses to run when `NODE_ENV=production`.
- Idempotent (skips if present).
- Creates only bracketed placeholders (`[PENDING CLIENT CATEGORY]`, `[PENDING CLIENT PRODUCT]`, the four requested industry names) — **all as DRAFT**, invisible to every public query.
- Run: `npm run db:seed`.

## 9. Development workflow

1. Edit `prisma/schema.prisma`.
2. `npm run db:migrate:create -- <change_name>` (or `prisma migrate dev`).
3. `npm run db:migrate:apply`.
4. `npm run db:generate`.
5. Extend validation + repository functions.
6. `npx tsc --noEmit && npm run lint && npm run build`.

### Local development database (`scripts/setup-local-mysql.mjs`)

Unlike the old embedded-PostgreSQL launcher, the repo no longer ships a
database server — MySQL is expected to be running already (Docker,
Homebrew, XAMPP, or a remote host):

```bash
docker run --name sriyaan-mysql -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=sriyaan -p 3306:3306 -d mysql:8

npm run db:setup    # verify connection, create DB, write .env.local
```

`db:setup` connects with `MYSQL_HOST`/`MYSQL_PORT`/`MYSQL_USER`/
`MYSQL_PASSWORD`/`MYSQL_DB` (defaults `127.0.0.1:3306`, `root`/`root`,
`sriyaan`), creates the database with `utf8mb4` / `utf8mb4_unicode_ci`
if missing, and writes `DATABASE_URL` + `NEXT_PUBLIC_SITE_URL` to
`.env.local` (gitignored) while preserving any other keys already there.

All standalone DB scripts (`prisma/seed.ts`, `scripts/*.ts`,
`prisma.config.ts`) load `.env.local` in addition to `.env` via the
shared `scripts/env.mjs` loader — the same precedence Next.js itself
uses (process env → `.env.local` → `.env`). They obtain their Prisma
client from `scripts/db-client.mjs`, which keeps the MySQL adapter
wiring in one place.

Production uses any standard MySQL 8 (or MariaDB) via `DATABASE_URL`.

### Regenerating the MySQL DDL

`prisma/migrations/20260905000000_initial_mysql_schema/migration.sql` is
generated from the schema by `scripts/gen-mysql-ddl.mjs`
(`npm run db:ddl`). It exists because neither the native engine nor the
WASM engine can emit MySQL DDL in this sandbox. In an environment with
network access, `npx prisma migrate dev` is authoritative and should be
preferred — the generator simply reproduces the same output.
