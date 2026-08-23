# SRIYAAN METALS — Database (Phase 5)

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

### Sandbox note (`scripts/migrate.mjs`)

This sandbox cannot reach `binaries.prisma.sh`, so `prisma migrate dev`
cannot download the native schema engine. `scripts/migrate.mjs` drives the
official `@prisma/schema-engine-wasm` with the pg adapter instead and
produces **standard Prisma migration folders** — fully compatible with
`prisma migrate deploy` in CI/production.

```bash
npm run db:migrate:create -- <name>   # diff schema → new migration folder
npm run db:migrate:apply              # apply pending migrations
npm run db:migrate:status             # list migrations + DB version
```

In normal environments prefer plain `npx prisma migrate dev`.

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

## 4. Models (29)

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

Local sandbox PostgreSQL 17.5 runs as the "PostgreSQL (dev database)"
process (embedded runtime under `/home/user/tools/pgruntime`, outside the
repo). Production uses any standard PostgreSQL via `DATABASE_URL`.
