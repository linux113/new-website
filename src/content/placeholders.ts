import type { Product } from "./types";

/**
 * SRIYAAN METALS — fallback content.
 *
 * These entries render only when the database has no published rows
 * for a section, so the public site is never blank before the client
 * fills the CMS in. Everything here is also editable from the admin
 * panel; once a real record is published it takes priority.
 */

export const PENDING = "[PENDING CLIENT INPUT]";

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

/* ---- Industries ----
 * The four sectors the site presents: Construction, Automotive,
 * Engineering and Infrastructure.
 */

/* ---- Blog posts ----
 * Ships empty — no fabricated company news. The section renders its
 * pending state until real posts exist. Editorial categories below
 * are the client-requested content plan, used as labels only.
 */

export const BLOG_CATEGORIES = [
  "Fastener Guides",
  "Industry Knowledge",
  "Company Updates",
] as const;

/* ---- Testimonials — no invented names/companies ---- */

/* ---- Certifications — slots only, never real standards ---- */

/* ---- Customer logos — grey slots, no fake wordmarks ---- */

/* ---- Global reach — zero highlighted markets ---- */

