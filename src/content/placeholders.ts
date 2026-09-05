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
 * SRIYAAN METALS — placeholder content module.
 *
 *  — ENTIRE FILE.
 * Every entry below is a clearly-labeled slot awaiting real client
 * input. Nothing here is a business claim, product, certification,
 * customer, statistic or export market. Replacing this module with
 * real data (or a CMS/DB adapter behind the same types) requires
 * zero component changes.
 */

export const PENDING = "[PENDING CLIENT INPUT]";

/* ---- Categories ---- */

export const PLACEHOLDER_CATEGORIES: Category[] = [
  // Fallback tiles when the database is unreachable — mirrors the
  // SRIYAAN METALS catalogue range.
  { slug: "bolts-studs-screws", index: "01", title: "Bolts, Studs & Screws", image: { src: "/images/products/hex-bolts.jpg", alt: "Stainless steel hex bolts" } },
  { slug: "nuts-washers", index: "02", title: "Nuts & Washers", image: { src: "/images/products/hex-nuts.jpg", alt: "Stainless steel hexagon nuts" } },
  { slug: "pipe-fittings", index: "03", title: "Pipe Fittings & Flanges", image: { src: "/images/products/pipe-fittings.jpg", alt: "Butt-weld pipe fittings" } },
  { slug: "carbon-steel-pipes", index: "04", title: "Carbon Steel Pipes", image: { src: "/images/products/carbon-steel-pipes.jpg", alt: "Carbon steel pipes" } },
];

/* ---- Products ---- */

export const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    slug: "hex-bolts",
    name: "Hex Bolts & Hex Screws",
    category: "Bolts, Studs & Screws",
    code: "SM-BLT-001",
    specSummary: { value: "M6 – M42 · SS 304/316, alloy steel, brass, copper", placeholder: "" },
    media: [{ src: "/images/products/hex-bolts.jpg", alt: "Stainless steel hex bolts" }],
    // Fallback cards must link to pages that resolve WITHOUT the
    // database (static SEO-catalog routes). Slug-derived hrefs
    // (/products/<slug>) 404 when the catalogue is unreachable.
    href: "/products/bolts/hex-bolts",
  },
  {
    slug: "nuts",
    name: "Hex, Slotted & Coupling Nuts",
    category: "Nuts & Washers",
    code: "SM-NUT-001",
    specSummary: { value: "Hex, slotted, break, coupling & thin nuts", placeholder: "" },
    media: [{ src: "/images/products/hex-nuts.jpg", alt: "Stainless steel hexagon nuts" }],
    href: "/products/nuts-washers",
  },
  {
    slug: "butt-weld-pipe-fittings",
    name: "Butt-Weld Pipe Fittings",
    category: "Pipe Fittings & Flanges",
    code: "SM-FIT-001",
    specSummary: { value: "ASTM / ASME / DIN / JIS · EN 10204 3.1 & 3.2", placeholder: "" },
    media: [{ src: "/images/products/pipe-fittings.jpg", alt: "Butt-weld pipe fittings" }],
    href: "/products/pipe-fittings",
  },
  {
    slug: "carbon-steel-pipes",
    name: "Carbon Steel Pipes",
    category: "Carbon Steel Pipes",
    code: "SM-PIP-001",
    specSummary: { value: "Dimensions per ASTM ANSI B36.10 / B36.19", placeholder: "" },
    media: [{ src: "/images/products/carbon-steel-pipes.jpg", alt: "Carbon steel pipes" }],
    href: "/products/pipes/carbon-steel-pipes",
  },
];

/* ---- Metrics — values stay null until client data ---- */

export const PLACEHOLDER_METRICS: Metric[] = [
  { id: "m1", label: "Metric", value: { value: null, placeholder: "[—]" } },
  { id: "m2", label: "Metric", value: { value: null, placeholder: "[—]" } },
  { id: "m3", label: "Metric", value: { value: null, placeholder: "[—]" } },
  { id: "m4", label: "Metric", value: { value: null, placeholder: "[—]" } },
];

/* ---- Industries ----
 * The four sectors the site presents: Construction, Automotive,
 * Engineering and Infrastructure.
 */
export const PLACEHOLDER_INDUSTRIES: Industry[] = [
  { slug: "construction", index: "01", name: "Construction", href: "/industries" },
  { slug: "automotive", index: "02", name: "Automotive", href: "/industries" },
  { slug: "engineering", index: "03", name: "Engineering", href: "/industries" },
  { slug: "infrastructure", index: "04", name: "Infrastructure", href: "/industries" },
];

/* ---- Blog posts ----
 * Ships empty — no fabricated company news. The section renders its
 * pending state until real posts exist. Editorial categories below
 * are the client-requested content plan, used as labels only.
 */

export const PLACEHOLDER_POSTS: Post[] = [];

export const BLOG_CATEGORIES = [
  "Fastener Guides",
  "Industry Knowledge",
  "Company Updates",
] as const;

/* ---- Testimonials — no invented names/companies ---- */

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

/* ---- Certifications — slots only, never real standards ---- */

export const PLACEHOLDER_CERTIFICATIONS: Certification[] = [
  { id: "c1", name: null, status: "pending", document: null },
  { id: "c2", name: null, status: "pending", document: null },
  { id: "c3", name: null, status: "pending", document: null },
];

/* ---- Customer logos — grey slots, no fake wordmarks ---- */

export const PLACEHOLDER_LOGO_COUNT = 6;

/* ---- Global reach — zero highlighted markets ---- */

export const PLACEHOLDER_MAP_REGIONS: MapRegion[] = [];
export const MAP_PENDING_NOTE = "EXPORT MARKETS — TO BE CONFIRMED";
