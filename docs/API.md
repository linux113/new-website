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

## 2. Planned boundaries (NOT yet implemented)

| Boundary | Phase | Notes |
|---|---|---|
| Server Actions for public forms (contact / RFQ / vendor) | Enquiry phase | Zod parse → repository create → inline success (DS §13); rate limiting + spam controls |
| Admin authentication (session-based, hashed credentials) | Admin phase | AdminUser model is ready; no auth code exists yet |
| Admin CRUD (products, blog, content, media, settings) | Admin phase | Server actions or route handlers behind auth middleware |
| Media upload to Cloudflare R2 (presigned PUT) | Media phase | MediaAsset model is storage-agnostic and ready |
| Public read API (JSON) | Only if a consumer outside Next.js appears | Frontend uses repositories directly — no need by default |

## 3. Contracts

- Untrusted input crosses the boundary **only** through the Zod layer.
- Repositories never expose draft/unpublished rows to public callers.
- Prisma client never ships to the browser (`server-only` in `db.ts`).
- No raw SQL; Prisma query API only.
