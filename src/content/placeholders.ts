import type {
  Category,
  Certification,
  Industry,
  MapRegion,
  Metric,
  Post,
  Product,
  Testimonial,
} from "./types";

/**
 * SRIYAAN METALS — placeholder content module (DS §31.7).
 *
 * // PLACEHOLDER-CONTENT — ENTIRE FILE.
 * Every entry below is a clearly-labeled slot awaiting real client
 * input. Nothing here is a business claim, product, certification,
 * customer, statistic or export market. Replacing this module with
 * real data (or a CMS/DB adapter behind the same types) requires
 * zero component changes.
 */

export const PENDING = "[PENDING CLIENT INPUT]";

/* ---- Categories (DS §31.4) ---- */
// PLACEHOLDER-CONTENT
export const PLACEHOLDER_CATEGORIES: Category[] = [
  { slug: "category-a", index: "01", title: "Category A — placeholder", image: null },
  { slug: "category-b", index: "02", title: "Category B — placeholder", image: null },
  { slug: "category-c", index: "03", title: "Category C — placeholder", image: null },
  { slug: "category-d", index: "04", title: "Category D — placeholder", image: null },
];

/* ---- Products (DS §31.4) ---- */
// PLACEHOLDER-CONTENT
export const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    slug: "product-placeholder-1",
    name: "Product name — placeholder",
    category: "Category A — placeholder",
    code: "SM-[XXX]",
    specSummary: { value: null, placeholder: "[Grade / size range — TBD]" },
    media: [],
  },
  {
    slug: "product-placeholder-2",
    name: "Product name — placeholder",
    category: "Category B — placeholder",
    code: "SM-[XXX]",
    specSummary: { value: null, placeholder: "[Grade / size range — TBD]" },
    media: [],
  },
  {
    slug: "product-placeholder-3",
    name: "Product name — placeholder",
    category: "Category C — placeholder",
    code: "SM-[XXX]",
    specSummary: { value: null, placeholder: "[Grade / size range — TBD]" },
    media: [],
  },
];

/* ---- Metrics (DS §31.1) — values stay null until client data ---- */
// PLACEHOLDER-CONTENT
export const PLACEHOLDER_METRICS: Metric[] = [
  { id: "m1", label: "Metric — awaiting client data", value: { value: null, placeholder: "[—]" } },
  { id: "m2", label: "Metric — awaiting client data", value: { value: null, placeholder: "[—]" } },
  { id: "m3", label: "Metric — awaiting client data", value: { value: null, placeholder: "[—]" } },
  { id: "m4", label: "Metric — awaiting client data", value: { value: null, placeholder: "[—]" } },
];

/* ---- Industries ---- */
// PLACEHOLDER-CONTENT
export const PLACEHOLDER_INDUSTRIES: Industry[] = [
  { slug: "industry-1", index: "01", name: "Industry — placeholder" },
  { slug: "industry-2", index: "02", name: "Industry — placeholder" },
  { slug: "industry-3", index: "03", name: "Industry — placeholder" },
  { slug: "industry-4", index: "04", name: "Industry — placeholder" },
];

/* ---- Blog posts ---- */
// PLACEHOLDER-CONTENT
export const PLACEHOLDER_POSTS: Post[] = [];

/* ---- Testimonials (DS §31.3) — no invented names/companies ---- */
// PLACEHOLDER-CONTENT
export const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote: { value: null, placeholder: "[Testimonial pending — placeholder text]" },
    name: "[Name — pending]",
    role: "[Role, Company — pending]",
    avatar: null,
  },
  {
    id: "t2",
    quote: { value: null, placeholder: "[Testimonial pending — placeholder text]" },
    name: "[Name — pending]",
    role: "[Role, Company — pending]",
    avatar: null,
  },
];

/* ---- Certifications (DS §31.2) — slots only, never real standards ---- */
// PLACEHOLDER-CONTENT
export const PLACEHOLDER_CERTIFICATIONS: Certification[] = [
  { id: "c1", name: null, status: "pending", document: null },
  { id: "c2", name: null, status: "pending", document: null },
  { id: "c3", name: null, status: "pending", document: null },
];

/* ---- Customer logos (DS §31.3) — grey slots, no fake wordmarks ---- */
// PLACEHOLDER-CONTENT
export const PLACEHOLDER_LOGO_COUNT = 6;

/* ---- Global reach (DS §31.5) — zero highlighted markets ---- */
// PLACEHOLDER-CONTENT
export const PLACEHOLDER_MAP_REGIONS: MapRegion[] = [];
export const MAP_PENDING_NOTE = "EXPORT MARKETS — TO BE CONFIRMED";
