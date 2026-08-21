# SRIYAAN METALS — Admin Panel (Phase 6)

**Access:** `/admin/login` → `/admin/dashboard`
**Stack:** Next.js App Router · server actions · session auth (custom, single system) · Prisma · Zod

---

## 1. Authentication & security model

| Layer | Mechanism |
|---|---|
| Password storage | bcrypt (cost 12), `passwordHash` column — plaintext never persisted |
| Session | Opaque 256-bit token in `sm_admin_session` cookie (HttpOnly, SameSite=Lax, Secure in production). DB stores only the SHA-256 hash (`AdminSession`), 12 h TTL, revocable |
| Route protection | 3 layers: edge middleware (cookie presence → redirect), `requireAdminPage()` in the panel layout + every page, `requireAdminAction()` in **every** server action |
| Roles | `EDITOR` (content CRUD) < `ADMIN` (deletion, settings, SEO) < `SUPER_ADMIN`. Role checks are server-side only — nothing trusts the client |
| Brute force | Rate limit 5 attempts / 15 min per IP+email; constant-work bcrypt compare against a dummy hash for unknown emails (no user enumeration); generic error copy |
| CSRF | Next.js server actions (origin-checked POSTs) + SameSite=Lax cookie |
| IDOR | All ids validated as cuid before queries; admin scope is global by design; leads never render publicly |
| Input | Every mutation passes a strict, bounded Zod schema; settings writes are key-whitelisted |

### Creating the first admin

```bash
npx tsx scripts/create-admin.ts                     # interactive
ADMIN_NAME=… ADMIN_EMAIL=… ADMIN_PASSWORD=… npx tsx scripts/create-admin.ts
```

Passwords must be ≥ 12 chars. The script upserts (also usable for password rotation).

## 2. Route map

- `/admin/login` — public; redirects authenticated users to the dashboard
- `/admin` → `/admin/dashboard` — real DB counts, enquiry pipeline (NEW/IN_PROGRESS/CONTACTED/CLOSED), recent enquiries + recently edited posts
- **Bespoke modules:** `/admin/products` (+ `/new`, `/[id]/edit` — specifications editor, applications, featured, slug guard), `/admin/blogs` (+ `/new`, `/[id]/edit` — Markdown content, DRAFT/PUBLISHED/ARCHIVED, publishedAt invariant)
- **Config-driven modules** (single `[entity]` engine, `src/lib/admin/entities.ts`): `/admin/categories`, `/admin/industries`, `/admin/certifications`, `/admin/infrastructure`, `/admin/customers`, `/admin/testimonials`, `/admin/global-reach` — each with `/new` and `/[id]/edit`
- **Inbox:** `/admin/enquiries` (+ detail), `/admin/vendor-requests` (+ detail) — search, status filter chips, inline status select
- **System:** `/admin/media` (list/preview/alt/delete — uploads land with R2 phase), `/admin/content` (hero/CTA/footer copy), `/admin/seo` (default + homepage metadata, robots), `/admin/settings` (contact, emails, phones, WhatsApp, hours, address, GST, social)

## 3. Content-integrity rules (enforced by design)

- Nothing publishes without an explicit `PUBLISHED` status set by an admin.
- Category deletion is blocked while products reference it (guard message, no silent cascade).
- Customer logos publish only with the recorded consent checkbox.
- Publishing a Global-reach country is the act of verifying that market.
- Certifications are admin-entered only — no auto-created records anywhere.
- Media assets in use cannot be deleted (FK Restrict surfaces as a friendly error).

## 4. Extension points (later phases)

- **R2 uploads:** `MediaAsset` + media library are ready; add presigned-PUT endpoint + picker in `EntityForm`/`ProductForm` media fields (currently id inputs).
- **Rich text:** blog `content` is stored as text (Markdown); swap the textarea for an editor without migration.
- **Audit log:** not in the approved Phase 5 schema — documented as a future security enhancement (add `AdminAuditLog` model + hooks in the action layer).
- **Public integration:** homepage sections keep typed placeholders until admin-entered data exists; repositories (`src/lib/repositories`) already filter PUBLISHED and are the bridge.
