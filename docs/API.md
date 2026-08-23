# SRIYAAN METALS — Data Access & API Boundaries (Phase 5)

**Status:** No HTTP API routes exist yet. This document records what IS
implemented (server-side data access) and what is PLANNED. Nothing listed
under "Planned" should be assumed to exist.

---

## 1. Implemented — server-side data access (Phase 5)

The public frontend consumes typed server functions, not HTTP endpoints.
All modules are server-only (importing them from a client component is a
build error).

### Repositories (`src/lib/repositories/`)

| Module | Functions | Visibility rules |
|---|---|---|
| `categories.ts` | `getPublishedCategories`, `getCategoryBySlug` | `status: PUBLISHED` only |
| `products.ts` | `getFeaturedProducts`, `getPublishedProducts`, `getProductBySlug` | `PUBLISHED` only; featured flag; category filter |
| `blogs.ts` | `getPublishedPosts`, `getPostBySlug`, `getBlogCategories` | `PUBLISHED` + `publishedAt <= now` |
| `content.ts` | `getPublishedCapabilities/Industries/Infrastructure/Certifications/Customers/Testimonials/GlobalCountries`, `getCompanyPage`, `getWebsiteSettings` | `PUBLISHED`; customers additionally require `consent: true` |
| `enquiries.ts` | `createProductEnquiry`, `createContactMessage`, `createVendorRequest` | Accept **only** Zod-validated input types; honeypot stripped |

### Validation (`src/lib/validation/`)

Zod schemas: `categoryInputSchema`, `productInputSchema`,
`blogPostInputSchema`, `productEnquiryInputSchema`,
`contactMessageInputSchema`, `vendorRequestInputSchema` + shared
fragments (slug, email, phone, SEO input). All `.strict()`, all bounded.

## 2. Implemented in later phases (6–7)

| Boundary | Status |
|---|---|
| Admin authentication (session cookie + bcrypt) | ✅ Phase 6 — `src/lib/auth/` |
| Admin CRUD server actions | ✅ Phase 6 — `src/lib/admin/` |
| Public form server actions (enquiry / contact / vendor) | ✅ Phase 7 — `src/lib/public-actions.ts` (throttle + honeypot + Zod → DB → email) |
| Media upload (R2/S3 abstraction + local dev fallback) | ✅ Phase 7 — `src/lib/storage/` + `media-actions.ts` (MIME + magic-byte validation) |
| Email notifications (provider abstraction, Resend-compatible) | ✅ Phase 7 — `src/lib/email/` (dev-safe logging when unconfigured) |
| Public dynamic routes (products/categories/blog) | ✅ Phase 7 — `src/app/(public)/` |
| sitemap.xml / robots.txt | ✅ Phase 7 — published content only |

## 3. Still planned

| Boundary | Notes |
|---|---|
| Public read API (JSON) | Only if a consumer outside Next.js appears |
| WhatsApp Business API | Click-to-chat only for now (`src/lib/whatsapp.ts`) |
| Cloudflare Turnstile | Env placeholders reserved; honeypot + throttling active |

## 4. Contracts

- Untrusted input crosses the boundary **only** through the Zod layer.
- Repositories never expose draft/unpublished rows to public callers.
- Prisma client never ships to the browser (`server-only` in `db.ts`).
- No raw SQL; Prisma query API only.
