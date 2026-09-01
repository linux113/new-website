# Database

**Stack:** PostgreSQL · Prisma 7 (pg driver adapter) · Zod validation
**Schema:** `prisma/schema.prisma` · **Client output:** `src/generated/prisma/` (gitignored, regenerate with `npm run db:generate`)

> No business data lives in the schema or seeds. All real records arrive
> later through the admin panel. Public queries filter `status: PUBLISHED`,
> so draft/dev rows can never leak to the website.

---

## 1. Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Prisma CLI + runtime) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |

Copy `.env.example` → `.env`. **Never commit `.env`.** No credentials are
hardcoded anywhere; `prisma/schema.prisma` intentionally has no `url` field
(Prisma 7) — the connection comes from `prisma.config.ts` (CLI) and the pg
adapter in `src/lib/db.ts` (runtime), both reading `DATABASE_URL`.

## 2. Setup (fresh environment)

```bash
cp .env.example .env          # fill DATABASE_URL
npm install
npm run db:generate           # prisma generate → src/generated/prisma
npm run db:migrate:apply      # apply migrations (sandbox path), or:
# npx prisma migrate dev      # in unrestricted environments
npm run db:seed               # optional, DEVELOPMENT ONLY
```

### Sandbox note (`scripts/migrate.mjs` + offline generate)

This sandbox cannot reach `binaries.prisma.sh`, so the Prisma CLI cannot
download its native engines. Two scripts work around it:

- `scripts/migrate.mjs` drives the official `@prisma/schema-engine-wasm`
  with the pg adapter and produces **standard Prisma migration folders** —
  fully compatible with `prisma migrate deploy` in CI/production.
- `scripts/generate-offline.mjs` (behind `npm run db:generate`) first tries
  a normal `prisma generate`; if the engine download fails, it retries with
  a stub `PRISMA_SCHEMA_ENGINE_BINARY`. That is safe because the Prisma 7
  `prisma-client` generator builds the client entirely in-process (WASM
  `getDMMF`) and never executes the native binary. In unrestricted
  environments the real engine is used transparently.

```bash
npm run db:generate               # offline-safe client generation
npm run db:migrate:create -- <name>   # diff schema → new migration folder
npm run db:migrate:apply              # apply pending migrations
npm run db:migrate:status             # list migrations + DB version
```

In normal environments you can also use plain `npx prisma generate`
(`npm run db:generate:native`) and `npx prisma migrate dev`.

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

- `db.ts`: dev-global singleton (no pool churn under HMR), pg adapter, `server-only` makes any client-component import a build error.
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

### Local development database (`scripts/start-local-pg.mjs`)

For sandbox/CI-less development the repo ships an embedded PostgreSQL
launcher (uses the `embedded-postgres` dev dependency):

```bash
node scripts/start-local-pg.mjs   # keep it running in its own terminal
```

It initialises a data dir at `.pgdata/` (gitignored), listens on
`127.0.0.1:55432`, creates the `sriyaan_dev` database, and writes
`DATABASE_URL` + `NEXT_PUBLIC_SITE_URL` to `.env.local` (gitignored).
All standalone DB scripts (`scripts/migrate.mjs`, `prisma/seed.ts`,
`scripts/*.ts`, `prisma.config.ts`) load `.env.local` in addition to
`.env` via the shared `scripts/env.mjs` loader — the same precedence
Next.js itself uses (process env → `.env.local` → `.env`).

Production uses any standard PostgreSQL via `DATABASE_URL`.
