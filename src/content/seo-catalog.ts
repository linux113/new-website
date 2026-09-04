/**
 * Location + catalogue SEO landing pages.
 * Static, indexable content for Mumbai supplier queries.
 */

import type { MediaRef } from "./types";

export const HOME_TITLE =
  "SRIYAAN METALS | Metal Supplier, Fasteners, Pipes & Fittings in Mumbai";

export const HOME_DESCRIPTION =
  "SRIYAAN METALS is a Mumbai-based metal trading, import and export company supplying industrial fasteners, bolts, nuts, pipes, pipe fittings, flanges and foundation bolts across India and global markets.";

export const HOME_H1 =
  "Industrial Metal Supplier in Mumbai for Fasteners, Pipes & Fittings";

export interface SeoSection {
  heading: string;
  body: string;
}

export interface SeoProduct {
  /** Leaf slug, e.g. hex-bolts */
  slug: string;
  /** Nested parent, e.g. bolts → /products/bolts/hex-bolts */
  nest: string;
  name: string;
  h1: string;
  title: string;
  description: string;
  categorySlug: string;
  specSummary: string;
  /** Primary product image. */
  image?: MediaRef;
  sections: SeoSection[];
}

export interface SeoCategory {
  slug: string;
  /** Optional nest used by child products */
  nest: string;
  name: string;
  h1: string;
  title: string;
  description: string;
  lede: string;
  aliases?: string[];
  productSlugs: string[];
  sections: SeoSection[];
}

export interface LocationPage {
  slug: string;
  h1: string;
  title: string;
  description: string;
  lede: string;
  sections: SeoSection[];
  links: { label: string; href: string }[];
}

export const SEO_CATEGORIES: SeoCategory[] = [
  {
    slug: "bolts-studs-screws",
    nest: "bolts",
    name: "Bolts, Studs & Screws",
    h1: "Bolts, Studs & Screws Supplier in Mumbai",
    title: "Bolts, Studs & Screws Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Hex bolts, hex screws, stud bolts and threaded rods from SRIYAAN METALS, a Mumbai industrial fastener supplier. Grades, sizes and mill-backed supply on enquiry.",
    lede: "Industrial bolts, studs and screws for fabrication, OEM and project work — sourced from Mumbai and supplied across India and export lanes.",
    productSlugs: ["hex-bolts", "stud-bolts", "threaded-rods"],
    sections: [
      {
        heading: "Range",
        body: "Hex bolts and hex screws, stud bolts, fully and partially threaded rods, machine screws and related fasteners in stainless, alloy and carbon steel.",
      },
      {
        heading: "Standards",
        body: "Supply against ASTM, ASME, DIN, ISO and IS specifications as stated on the purchase order. Thread forms include metric coarse/fine and UNC/UNF.",
      },
    ],
  },
  {
    slug: "nuts-washers",
    nest: "nuts",
    name: "Nuts & Washers",
    h1: "Nuts & Washers Supplier in Mumbai",
    title: "Nuts & Washers Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Hex nuts, slotted nuts, coupling nuts and industrial washers from SRIYAAN METALS in Mumbai. Stainless steel and carbon steel, matched to bolt grades.",
    lede: "Mating nuts and washers for structural, piping and equipment assemblies, stocked and sourced through our Mumbai trading desk.",
    productSlugs: ["hex-nuts"],
    sections: [
      {
        heading: "Range",
        body: "Hex nuts, nyloc and lock nuts, slotted, castle, coupling and thin nuts, plus plain, spring and structural washers.",
      },
    ],
  },
  {
    slug: "anchor-foundation-bolts",
    nest: "anchors",
    name: "Anchors & Foundation Bolts",
    h1: "Anchor & Foundation Bolts Supplier in Mumbai",
    title: "Anchor & Foundation Bolts Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Anchor bolts and J-type foundation bolts supplied from Mumbai by SRIYAAN METALS for civil, plant and infrastructure foundations.",
    lede: "Foundation and anchor fasteners for base plates, columns and equipment skids — cut, threaded and coated to drawing.",
    aliases: ["anchors-foundation"],
    productSlugs: [],
    sections: [
      {
        heading: "Range",
        body: "J-bolts, L-bolts, straight foundation bolts, chemical and mechanical anchors. Carbon steel and stainless grades with hot-dip galvanizing on request.",
      },
    ],
  },
  {
    slug: "rivets-inserts",
    nest: "rivets",
    name: "Rivets & Inserts",
    h1: "Rivets & Threaded Inserts Supplier in Mumbai",
    title: "Rivets & Inserts Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Rivet nuts, blind rivets and threaded inserts from SRIYAAN METALS, Mumbai — for sheet metal, enclosures and light fabrication.",
    lede: "Inserts and rivets for thin-wall assemblies where a tapped hole is not practical.",
    productSlugs: [],
    sections: [
      {
        heading: "Range",
        body: "Rivet nuts, blind rivets, threaded inserts in steel, stainless and aluminium. Head styles and grip ranges quoted against application.",
      },
    ],
  },
  {
    slug: "pipe-fittings",
    nest: "fittings",
    name: "Pipe Fittings",
    h1: "Pipe Fittings Supplier in Mumbai",
    title: "Pipe Fittings Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Butt-weld, socket-weld and threaded pipe fittings from SRIYAAN METALS in Mumbai. Elbows, tees, reducers and caps to ASTM, ASME, DIN and JIS.",
    lede: "Welded and threaded fittings for process, utility and structural piping — mill test certificates with each lot where specified.",
    aliases: ["pipe-fittings-flanges"],
    productSlugs: [],
    sections: [
      {
        heading: "Range",
        body: "BW / SW / threaded elbows, tees, reducers, caps, couplings and unions in carbon steel, stainless steel and alloy grades.",
      },
    ],
  },
  {
    slug: "pipe-flanges",
    nest: "flanges",
    name: "Pipe Flanges",
    h1: "Pipe Flanges Supplier in Mumbai",
    title: "Pipe Flanges Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Forged pipe flanges — weld neck, slip-on, blind, socket-weld and threaded — supplied from Mumbai by SRIYAAN METALS to ASME, DIN and JIS.",
    lede: "Forged flanges for pressure piping, matched to pipe schedule and facing (RF / FF / RTJ).",
    productSlugs: [],
    sections: [
      {
        heading: "Range",
        body: "Weld neck, slip-on, blind, lap joint, socket-weld and threaded flanges. Pressure classes and facings quoted to the piping spec.",
      },
    ],
  },
  {
    slug: "carbon-steel-pipes",
    nest: "pipes",
    name: "Carbon Steel Pipes",
    h1: "Carbon Steel Pipes Supplier in Mumbai",
    title: "Carbon Steel Pipes Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Carbon steel pipes to ASTM ANSI B36.10 / B36.19 from SRIYAAN METALS, Mumbai. Seamless and welded, with fittings and flanges as a package.",
    lede: "Seamless and welded carbon steel line pipe for industrial, oil & gas utility and fabrication work.",
    productSlugs: ["carbon-steel-pipes"],
    sections: [
      {
        heading: "Range",
        body: "Dimensions per ASTM ANSI B36.10 / B36.19. Grades and schedules quoted against the project specification, with matching fittings and flanges.",
      },
    ],
  },
];

export const SEO_PRODUCTS: SeoProduct[] = [
  {
    slug: "hex-bolts",
    nest: "bolts",
    name: "Hex Bolts",
    h1: "Hex Bolts Supplier in Mumbai",
    title: "Hex Bolts Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Hex bolts and hex screws supplier in Mumbai — SS 304/316, alloy and carbon steel, metric and imperial threads. Enquire with SRIYAAN METALS.",
    categorySlug: "bolts-studs-screws",
    specSummary: "M6 – M42 · SS 304/316, alloy steel, carbon steel, brass, copper",
    image: { src: "/images/products/screw-flat-head.jpg", alt: "Stainless steel self-tapping screws with countersunk heads" },
    sections: [
      {
        heading: "Material",
        body: "Stainless steel (304, 316, 316L), alloy steel, carbon steel, brass and copper. Material is matched to the corrosive and mechanical duty of the joint.",
      },
      {
        heading: "Grades",
        body: "Common grades include A2-70 / A4-70 stainless, 8.8 / 10.9 / 12.9 alloy, and ASTM A193 B7 / B8 / B8M for high-temperature service. Grade is confirmed on the mill certificate.",
      },
      {
        heading: "Sizes",
        body: "Metric M6 to M42 as a standard enquiry band; larger diameters and imperial UNC/UNF sizes on request. Lengths cut to drawing.",
      },
      {
        heading: "Standards",
        body: "ISO 4014 / 4017, DIN 931 / 933, ASME B18.2.1 and equivalent IS standards. Specify the standard on the RFQ so thread and head geometry match the assembly.",
      },
      {
        heading: "Thread type",
        body: "Fully or partially threaded. Metric coarse and fine, UNC and UNF. Thread class (6g / 2A) as specified.",
      },
      {
        heading: "Coatings",
        body: "Plain, zinc plated, hot-dip galvanized, PTFE / Xylan and black oxide. Coating is selected for atmosphere and temperature, not appearance.",
      },
      {
        heading: "Applications",
        body: "Structural steel, skids, pressure equipment, OEM machinery, marine and process-plant bolting.",
      },
      {
        heading: "Industries",
        body: "Construction, automotive, engineering, infrastructure, oil & gas utilities and general fabrication.",
      },
      {
        heading: "Certifications",
        body: "EN 10204 3.1 mill test certificates with heat numbers when specified. Third-party inspection can be arranged on the purchase order.",
      },
      {
        heading: "Availability",
        body: "Mumbai trading desk. Stock and mill-indent lots. Lead time depends on grade, coating and quantity — stated on quotation.",
      },
    ],
  },
  {
    slug: "stud-bolts",
    nest: "bolts",
    name: "Stud Bolts",
    h1: "Stud Bolts Supplier in Mumbai",
    title: "Stud Bolts Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Stud bolts for flanges and high-temperature joints. ASTM A193 grades from SRIYAAN METALS, Mumbai, with matching nuts.",
    categorySlug: "bolts-studs-screws",
    specSummary: "ASTM A193 B7 / B8 / B8M · matching nuts ASTM A194",
    image: { src: "/images/products/stud-bolts-pallets.jpg", alt: "Stud bolts and threaded rods banded on pallets in the Mumbai warehouse" },
    sections: [
      { heading: "Material", body: "Alloy and stainless studs to ASTM A193, with nuts to ASTM A194. Other grades on enquiry." },
      { heading: "Grades", body: "B7, B7M, B8, B8M and B16 are typical. Confirm service temperature and medium on the RFQ." },
      { heading: "Sizes", body: "Imperial and metric diameters, continuous thread or double-end. Lengths to ASME B16.5 / B16.47 flange tables or drawing." },
      { heading: "Standards", body: "ASTM A193 / A194, ASME B18.2.1, DIN 976. Thread UNC/UNF or metric as specified." },
      { heading: "Thread type", body: "Full-thread studs, tap-end and double-end. Thread class per standard." },
      { heading: "Coatings", body: "Plain, zinc, PTFE and hot-dip galvanized. PTFE is common on B7 in corrosive atmospheres." },
      { heading: "Applications", body: "Flange joints, heat exchangers, pressure vessels and high-temperature piping." },
      { heading: "Industries", body: "Process plants, power, oil & gas utilities, fabrication shops." },
      { heading: "Certifications", body: "EN 10204 3.1 / 3.2 as specified, with heat traceability." },
      { heading: "Availability", body: "Quoted from Mumbai. Matching hex nuts supplied as a set when requested." },
    ],
  },
  {
    slug: "threaded-rods",
    nest: "bolts",
    name: "Threaded Rods",
    h1: "Threaded Rods Supplier in Mumbai",
    title: "Threaded Rods Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Fully threaded rods and all-thread bar from SRIYAAN METALS, Mumbai. Stainless, carbon and alloy steel, cut to length.",
    categorySlug: "bolts-studs-screws",
    specSummary: "Fully threaded bar · metric & UNC · cut to length",
    image: { src: "/images/products/stud-bolts-pallets.jpg", alt: "Fully threaded rods and stud bolts on pallets" },
    sections: [
      { heading: "Material", body: "Stainless 304/316, carbon steel and alloy grades. Brass on request." },
      { heading: "Grades", body: "A2/A4 stainless, 4.8 / 8.8 carbon, and ASTM A193 grades for high-temperature duty." },
      { heading: "Sizes", body: "Standard bars in 1 m / 3 m lengths; cut pieces to drawing. Diameters from M6 upward." },
      { heading: "Standards", body: "DIN 975 / 976, ASTM A193, ISO metric threads." },
      { heading: "Thread type", body: "Full-length metric coarse/fine or UNC. Rolled or cut thread as available." },
      { heading: "Coatings", body: "Plain, zinc plated or hot-dip galvanized." },
      { heading: "Applications", body: "Hanger rods, through-bolts, formwork, pipe supports and general fabrication." },
      { heading: "Industries", body: "Construction, MEP, engineering and infrastructure." },
      { heading: "Certifications", body: "Mill certificates when specified." },
      { heading: "Availability", body: "Mumbai supply. Cut-to-length service on quoted lots." },
    ],
  },
  {
    slug: "hex-nuts",
    nest: "nuts",
    name: "Hex Nuts",
    h1: "Hex Nuts Supplier in Mumbai",
    title: "Hex Nuts Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Hex nuts, lock nuts and coupling nuts from SRIYAAN METALS in Mumbai. Grades matched to bolts. Stainless and carbon steel.",
    categorySlug: "nuts-washers",
    specSummary: "Hex, nyloc, slotted, coupling & thin nuts",
    sections: [
      { heading: "Material", body: "Stainless 304/316, carbon steel and alloy. Brass and copper on request." },
      { heading: "Grades", body: "A2/A4, Class 8 / 10, ASTM A194 2H / 8 / 8M to match the bolt grade." },
      { heading: "Sizes", body: "Metric and imperial, standard and heavy hex. Thin and coupling nuts in the same diameter band." },
      { heading: "Standards", body: "ISO 4032, DIN 934, ASME B18.2.2, ASTM A194." },
      { heading: "Thread type", body: "Metric coarse/fine, UNC/UNF. Nylon-insert lock nuts where vibration is a concern." },
      { heading: "Coatings", body: "Plain, zinc, hot-dip galvanized and PTFE." },
      { heading: "Applications", body: "Structural joints, flanges, equipment frames and general assembly." },
      { heading: "Industries", body: "Construction, automotive, engineering and process plants." },
      { heading: "Certifications", body: "EN 10204 3.1 when specified." },
      { heading: "Availability", body: "Mumbai desk. Sold with matching bolts and washers as a kit on request." },
    ],
  },
  {
    slug: "carbon-steel-pipes",
    nest: "pipes",
    name: "Carbon Steel Pipes",
    h1: "Carbon Steel Pipes Supplier in Mumbai",
    title: "Carbon Steel Pipes Supplier in Mumbai | SRIYAAN METALS",
    description:
      "Carbon steel pipes in Mumbai — seamless and welded to ASTM ANSI B36.10 / B36.19. SRIYAAN METALS supplies pipe, fittings and flanges together.",
    categorySlug: "carbon-steel-pipes",
    specSummary: "Dimensions per ASTM ANSI B36.10 / B36.19",
    sections: [
      { heading: "Material", body: "Carbon steel line pipe. Stainless and alloy pipe quoted separately against the same piping class." },
      { heading: "Grades", body: "ASTM A106, A53, API 5L and equivalent IS grades as specified on the enquiry." },
      { heading: "Sizes", body: "NPS and metric sizes to B36.10 / B36.19. Schedules STD, XS, XXS and numbered schedules." },
      { heading: "Standards", body: "ASTM, ASME, API and IS. Ends: plain, beveled or threaded." },
      { heading: "Thread type", body: "NPT / BSP threaded ends where specified; otherwise beveled for welding." },
      { heading: "Coatings", body: "Bare, painted, galvanized or 3LPE as the project coating spec requires." },
      { heading: "Applications", body: "Process lines, utilities, fire-water, structural and fabrication." },
      { heading: "Industries", body: "Oil & gas utilities, engineering, infrastructure and manufacturing plants." },
      { heading: "Certifications", body: "EN 10204 3.1 / 3.2, hydrostatic and NDT as specified." },
      { heading: "Availability", body: "Mumbai supply with matching butt-weld fittings and forged flanges." },
    ],
  },
];

export const LOCATION_PAGES: LocationPage[] = [
  {
    slug: "metal-supplier-mumbai",
    h1: "Industrial Metal Supplier in Mumbai",
    title: "Metal Supplier in Mumbai | Fasteners, Pipes & Fittings | SRIYAAN METALS",
    description:
      "SRIYAAN METALS is a Mumbai-based industrial metal supplier for fasteners, bolts, nuts, pipes, pipe fittings, flanges and foundation bolts across India and export markets.",
    lede: "A Mumbai trading, import and export desk for industrial metals — specification-led supply, not a generic marketplace listing.",
    sections: [
      {
        heading: "What we supply from Mumbai",
        body: "Fasteners (bolts, nuts, washers, anchors, rivets), carbon steel pipes, butt-weld and threaded fittings, and forged flanges. Material is sourced against grade, size and standard — then checked before dispatch.",
      },
      {
        heading: "Why Mumbai",
        body: "Opera House, Mumbai is our registered trading address. The port, mill and logistics network around the city is how we move industrial lots inland and onto export lanes.",
      },
      {
        heading: "Who buys",
        body: "Fabricators, EPC contractors, OEMs, plant stores and traders who need documented material — not retail hardware.",
      },
    ],
    links: [
      { label: "Fastener supplier in Mumbai", href: "/fastener-supplier-mumbai" },
      { label: "Pipe supplier in Mumbai", href: "/pipe-supplier-mumbai" },
      { label: "Stainless steel fasteners", href: "/stainless-steel-fasteners-mumbai" },
      { label: "All products", href: "/products" },
      { label: "Request a quote", href: "/enquiry" },
    ],
  },
  {
    slug: "fastener-supplier-mumbai",
    h1: "Fastener Supplier in Mumbai",
    title: "Fastener Supplier in Mumbai | Bolts, Nuts & Anchors | SRIYAAN METALS",
    description:
      "Industrial fastener supplier in Mumbai — hex bolts, studs, nuts, washers, foundation bolts and rivets. SRIYAAN METALS supplies grades and sizes against specification.",
    lede: "Bolts, nuts, washers, anchors and inserts for structural, OEM and plant work, quoted from our Mumbai desk.",
    sections: [
      {
        heading: "Fastener range",
        body: "Hex bolts and screws, stud bolts, threaded rods, hex and lock nuts, plain and spring washers, J-type foundation bolts, rivet nuts and threaded inserts.",
      },
      {
        heading: "Materials & grades",
        body: "SS 304 / 316, alloy 8.8 / 10.9, ASTM A193 B7 / B8, brass and copper. Coatings: zinc, HDG and PTFE.",
      },
    ],
    links: [
      { label: "Bolts, studs & screws", href: "/products/bolts-studs-screws" },
      { label: "Hex bolts", href: "/products/bolts/hex-bolts" },
      { label: "Nuts & washers", href: "/products/nuts-washers" },
      { label: "Anchor & foundation bolts", href: "/products/anchor-foundation-bolts" },
      { label: "Stainless steel fasteners", href: "/stainless-steel-fasteners-mumbai" },
      { label: "Request a quote", href: "/enquiry" },
    ],
  },
  {
    slug: "pipe-supplier-mumbai",
    h1: "Pipe Supplier in Mumbai",
    title: "Pipe Supplier in Mumbai | Carbon Steel Pipes, Fittings & Flanges | SRIYAAN METALS",
    description:
      "Carbon steel pipe supplier in Mumbai with matching fittings and flanges. SRIYAAN METALS supplies ASTM / ASME / DIN / JIS material with mill certificates.",
    lede: "Line pipe plus the fittings and flanges that close the joint — one enquiry, one specification.",
    sections: [
      {
        heading: "Pipe, fittings and flanges",
        body: "Carbon steel pipe to B36.10 / B36.19, butt-weld / socket-weld / threaded fittings, and forged flanges (WN, SO, blind, SW, threaded).",
      },
      {
        heading: "Documentation",
        body: "EN 10204 3.1 as standard when specified. Hydrostatic and NDT records follow the mill and the purchase order.",
      },
    ],
    links: [
      { label: "Carbon steel pipes", href: "/products/pipes/carbon-steel-pipes" },
      { label: "Pipe fittings", href: "/products/pipe-fittings" },
      { label: "Pipe flanges", href: "/products/pipe-flanges" },
      { label: "Request a quote", href: "/enquiry" },
    ],
  },
  {
    slug: "stainless-steel-fasteners-mumbai",
    h1: "Stainless Steel Fasteners Supplier in Mumbai",
    title: "Stainless Steel Fasteners in Mumbai | SS 304 & SS 316 | SRIYAAN METALS",
    description:
      "SS 304 and SS 316 fasteners from SRIYAAN METALS, Mumbai — hex bolts, nuts, washers and studs for corrosive and hygienic service.",
    lede: "A2 and A4 stainless fasteners for marine, process and food-adjacent duty. Grade is chosen for chloride and temperature, not for shine.",
    sections: [
      {
        heading: "SS 304 vs SS 316",
        body: "304 (A2) is the general stainless grade. 316 / 316L (A4) adds molybdenum for chloride and marine atmospheres. We stock and indent both; the RFQ should state the medium.",
      },
      {
        heading: "Products",
        body: "Hex bolts, hex nuts, washers, studs and threaded rod in A2-70 and A4-70. Matching washers and nyloc nuts on the same lot.",
      },
    ],
    links: [
      { label: "Hex bolts", href: "/products/bolts/hex-bolts" },
      { label: "Hex nuts", href: "/products/nuts/hex-nuts" },
      { label: "Nuts & washers", href: "/products/nuts-washers" },
      { label: "Read: stainless grades on the blog", href: "/blog" },
      { label: "Request a quote", href: "/enquiry" },
    ],
  },
];

/** Blog slug or keyword → related product/location links. */
export const BLOG_INTERNAL_LINKS: {
  match: RegExp;
  heading: string;
  links: { label: string; href: string }[];
}[] = [
  {
    match: /304|316|stainless|ss\b/i,
    heading: "Related stainless products",
    links: [
      { label: "Stainless steel fasteners in Mumbai", href: "/stainless-steel-fasteners-mumbai" },
      { label: "Hex bolts", href: "/products/bolts/hex-bolts" },
      { label: "Nuts & washers", href: "/products/nuts-washers" },
      { label: "Request a quote", href: "/enquiry" },
    ],
  },
  {
    match: /pipe|flange|fitting|carbon steel/i,
    heading: "Related piping products",
    links: [
      { label: "Carbon steel pipes", href: "/products/pipes/carbon-steel-pipes" },
      { label: "Pipe fittings", href: "/products/pipe-fittings" },
      { label: "Pipe flanges", href: "/products/pipe-flanges" },
      { label: "Get a quote", href: "/enquiry" },
    ],
  },
  {
    match: /bolt|nut|fastener|washer|anchor|rivet/i,
    heading: "Related fasteners",
    links: [
      { label: "Bolts, studs & screws", href: "/products/bolts-studs-screws" },
      { label: "Hex bolts", href: "/products/bolts/hex-bolts" },
      { label: "Nuts & washers", href: "/products/nuts-washers" },
      { label: "Request a quote", href: "/enquiry" },
    ],
  },
];

export function getSeoCategory(slug: string): SeoCategory | undefined {
  return SEO_CATEGORIES.find((c) => c.slug === slug || c.aliases?.includes(slug));
}

export function getSeoProduct(nest: string, slug: string): SeoProduct | undefined {
  return SEO_PRODUCTS.find((p) => p.nest === nest && p.slug === slug);
}

export function findSeoProductByLeaf(slug: string): SeoProduct | undefined {
  return SEO_PRODUCTS.find((p) => p.slug === slug);
}

export function productHref(p: SeoProduct): string {
  return `/products/${p.nest}/${p.slug}`;
}

export function categoryHref(c: SeoCategory): string {
  return `/products/${c.slug}`;
}

export function getLocationPage(slug: string): LocationPage | undefined {
  return LOCATION_PAGES.find((p) => p.slug === slug);
}

export function blogLinksFor(title: string, excerpt?: string | null, content?: string | null) {
  const hay = `${title}\n${excerpt ?? ""}\n${content ?? ""}`;
  const seen = new Set<string>();
  const groups: { heading: string; links: { label: string; href: string }[] }[] = [];
  for (const group of BLOG_INTERNAL_LINKS) {
    if (!group.match.test(hay)) continue;
    const links = group.links.filter((l) => {
      if (seen.has(l.href)) return false;
      seen.add(l.href);
      return true;
    });
    if (links.length) groups.push({ heading: group.heading, links });
  }
  if (groups.length === 0) {
    groups.push({
      heading: "Explore the catalogue",
      links: [
        { label: "All products", href: "/products" },
        { label: "Metal supplier in Mumbai", href: "/metal-supplier-mumbai" },
        { label: "Request a quote", href: "/enquiry" },
      ],
    });
  }
  return groups;
}
