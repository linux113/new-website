import "./env.mjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Content seed — product categories and products from the official
 * SRIYAAN METALS catalogues (fasteners; pipe fittings, flanges and
 * carbon steel pipes), plus presentation customers/testimonials/
 * certifications/markets. Clears the old "(demo)" catalogue first;
 * idempotent via upserts by slug.
 */
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function media(storageKey: string, filename: string, alt: string, w: number, h: number) {
  const existing = await db.mediaAsset.findFirst({ where: { storageProvider: "local", storageKey } });
  if (existing) return existing;
  return db.mediaAsset.create({
    data: {
      storageProvider: "local",
      storageKey,
      publicUrl: `/${storageKey}`,
      filename,
      mimeType: "image/jpeg",
      type: "IMAGE",
      width: w,
      height: h,
      altText: alt,
    },
  });
}

async function main() {
  /* ---- Media (representative imagery, AI-generated, committed in repo) ---- */
  await media("images/cat-coils.jpg", "cat-coils.jpg", "Steel coils — representative imagery", 1536, 1024);
  await media("images/cat-sheets.jpg", "cat-sheets.jpg", "Steel sheets — representative imagery", 1536, 1024);
  const imgBars = await media("images/cat-bars.jpg", "cat-bars.jpg", "Steel bars and fasteners — representative imagery", 1536, 1024);
  const imgPipes = await media("images/cat-pipes.jpg", "cat-pipes.jpg", "Steel pipes — representative imagery", 1536, 1024);
  await media("images/material-wide.jpg", "material-wide.jpg", "Metal stock — representative imagery", 1920, 1080);
  await media("images/material-detail.jpg", "material-detail.jpg", "Metal detail — representative imagery", 1536, 1024);

  /* ---- Purge demo analytics (admin shows only REAL submissions) ---- */
  // Content rows are marked source="demo-seed" / "(demo)" — real enquiries,
  // contacts and vendor requests from the public forms are never touched.
  await db.productEnquiry.deleteMany({
    where: { OR: [{ source: "demo-seed" }, { company: { contains: "(demo)" } }] },
  });
  await db.contactMessage.deleteMany({
    where: { OR: [{ source: "demo-seed" }, { subject: { contains: "(demo)" } }] },
  });
  await db.vendorRequest.deleteMany({
    where: { OR: [{ source: "demo-seed" }, { offering: { contains: "(demo)" } }] },
  });

  /* ---- Clear ALL previous content (bulletproof purge) ---- */
  const KEEP_SLUGS = [
    "hex-bolts", "stud-bolts-threaded-rods", "screws", "nuts", "washers",
    "anchor-bolts", "foundation-bolts", "rivet-nuts-inserts",
    "butt-weld-pipe-fittings", "pipe-flanges", "carbon-steel-pipes",
  ];
  const staleProducts = await db.product.findMany({
    where: { slug: { notIn: KEEP_SLUGS } },
    select: { id: true },
  });
  for (const op of staleProducts) {
    await db.productImage.deleteMany({ where: { productId: op.id } });
    await db.productSpecification.deleteMany({ where: { productId: op.id } });
    await db.productApplication.deleteMany({ where: { productId: op.id } });
    await db.productRelation.deleteMany({ where: { OR: [{ sourceProductId: op.id }, { relatedProductId: op.id }] } });
    await db.productDocument.deleteMany({ where: { productId: op.id } });
  }
  await db.product.deleteMany({ where: { slug: { notIn: KEEP_SLUGS } } });
  await db.category.deleteMany({
    where: { slug: { notIn: [
      "bolts-studs-screws", "nuts-washers", "anchors-foundation",
      "rivets-inserts", "pipe-fittings-flanges", "carbon-steel-pipes",
    ] } },
  });
  // legacy demo blog posts (superseded by the clean set)
  await db.blogPost.deleteMany({ where: { slug: { in: [
      "specifying-fasteners-checklist", "stainless-finishes-guide",
    ] } } });
  await db.blogPost.deleteMany({ where: { slug: { endsWith: "-demo" } } });
  // legacy demo certifications
  await db.certification.deleteMany({ where: { name: { contains: "Sample" } } });

  /* ---- Categories (Sriyaan Metals catalogue range) ---- */
  const catDefs = [
    { slug: "bolts-studs-screws", name: "Bolts, Studs & Screws", image: imgBars, desc: "Hex bolts, hex screws, stud bolts and threaded rods in stainless steel, alloy steel, brass and copper." },
    { slug: "nuts-washers", name: "Nuts & Washers", image: imgBars, desc: "Hex nuts, slotted nuts, coupling nuts and thin nuts, with plain washers in stainless and carbon steel." },
    { slug: "anchors-foundation", name: "Anchors & Foundation Bolts", image: imgBars, desc: "Anchor bolts and J-type foundation bolts for concrete structures, pillars and columns." },
    { slug: "rivets-inserts", name: "Rivets & Inserts", image: imgBars, desc: "Rivet nuts, threaded inserts and blind rivet nuts with a wide grip range tolerance." },
    { slug: "pipe-fittings-flanges", name: "Pipe Fittings & Flanges", image: imgPipes, desc: "Butt-weld, socket-weld and threaded fittings plus forged pipe flanges to ASTM, ASME, DIN and JIS." },
    { slug: "carbon-steel-pipes", name: "Carbon Steel Pipes", image: imgPipes, desc: "Carbon steel pipes with dimensions and weights per ASTM ANSI B36.10 / B36.19." },
  ];
  const cats: Record<string, string> = {};
  for (const [i, c] of catDefs.entries()) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      update: { status: "PUBLISHED", imageId: c.image.id, name: c.name, description: c.desc, sortOrder: i },
      create: { slug: c.slug, name: c.name, description: c.desc, imageId: c.image.id, status: "PUBLISHED", sortOrder: i },
    });
    cats[c.slug] = row.id;
  }

  /* ---- Products (Sriyaan Metals catalogue) ---- */
  const prodDefs = [
    {
      slug: "hex-bolts", name: "Hex Bolts & Hex Screws", code: "SM-BLT-001", cat: "bolts-studs-screws", featured: true, image: imgBars,
      short: "Hex bolts and hex screws manufactured from stainless steel, alloy steel, brass and copper, in customised sizes and shapes.",
      specs: [["Size range", "M6 – M42, customised sizes on request"], ["Materials", "SS 304 / 316, alloy steel, brass, copper"], ["Grades", "Hastelloy, Inconel, Monel, Duplex"], ["Standards", "DIN / ASTM / IS"]],
      apps: ["Chemical and petrochemical plants", "Engineering assembly"],
    },
    {
      slug: "stud-bolts-threaded-rods", name: "Stud Bolts & Threaded Rods", code: "SM-BLT-002", cat: "bolts-studs-screws", featured: false, image: imgBars,
      short: "Properly coated, corrosion-resistant stud bolts and threaded rods for industrial fastening applications.",
      specs: [["Coating", "Corrosion-resistant coating"], ["Sizes", "Customised sizes and shapes"], ["Materials", "SS / alloy steel / brass"]],
      apps: ["Industrial fastening", "Flanged joints"],
    },
    {
      slug: "screws", name: "Screws", code: "SM-SCR-001", cat: "bolts-studs-screws", featured: false, image: imgBars,
      short: "Screw fasteners with least decarburization, manufactured from premium grade material in various sizes and dimensions.",
      specs: [["Materials", "Stainless steel, alloy steel, brass, copper"], ["Sizes", "Various sizes and dimensions"]],
      apps: ["Machinery assembly", "General engineering"],
    },
    {
      slug: "nuts", name: "Hex, Slotted & Coupling Nuts", code: "SM-NUT-001", cat: "nuts-washers", featured: true, image: imgBars,
      short: "Hex nuts, slotted nuts, break nuts, hexagon coupling nuts and thin nuts — superlative quality and precision dimensions for extreme working conditions.",
      specs: [["Types", "Hex, slotted, break, hexagon coupling, hexagon thin, steel coupling, steel thin"], ["Performance", "Withstands extreme working conditions and pressure"]],
      apps: ["Power plants", "Structural and general engineering"],
    },
    {
      slug: "washers", name: "Washers — SS & CS Plain", code: "SM-WSH-001", cat: "nuts-washers", featured: false, image: imgBars,
      short: "Stainless steel and carbon steel plain washers, manufactured in different grades of metals and alloys.",
      specs: [["Types", "SS washers, CS washers, SS plain, CS plain"], ["Sizes", "Customised sizes and shapes"]],
      apps: ["Bolting assemblies", "Machinery and equipment"],
    },
    {
      slug: "anchor-bolts", name: "Anchor Bolts", code: "SM-ANC-001", cat: "anchors-foundation", featured: true, image: imgBars,
      short: "Anchor bolts and threaded rods used across industries for fastening applications, coated for corrosion resistance and higher output.",
      specs: [["Finish", "Properly coated, corrosion resistant"], ["Sizes", "Customised sizes and shapes"]],
      apps: ["Construction projects", "Structural erection"],
    },
    {
      slug: "foundation-bolts", name: "Foundation Bolts (J-Type)", code: "SM-FDN-001", cat: "anchors-foundation", featured: false, image: imgBars,
      short: "Foundation bolts for engineering structures — tower foundations with concrete, erection of pillars and columns; strong, corrosion resistant and cost effective.",
      specs: [["Types", "J-type foundation bolts"], ["Material", "Stainless steel (strong, corrosion resistant)"]],
      apps: ["Tower foundations", "Pillars, columns and concrete structures"],
    },
    {
      slug: "rivet-nuts-inserts", name: "Rivet Nuts & Threaded Inserts", code: "SM-RIV-001", cat: "rivets-inserts", featured: true, image: imgBars,
      short: "Rivet nuts (threaded inserts / blind rivet nuts) with wide grip range tolerance, installed entirely from one side of the material.",
      specs: [["Grip range", "Wide range of material thicknesses"], ["Type", "One-piece threaded counter-bored tubular rivet"]],
      apps: ["Sheet metal assembly", "One-side installations"],
    },
    {
      slug: "butt-weld-pipe-fittings", name: "Butt-Weld Pipe Fittings", code: "SM-FIT-001", cat: "pipe-fittings-flanges", featured: true, image: imgPipes,
      short: "Butt-weld pipe fittings manufactured to ASTM / ASME / DIN / JIS with EN 10204 3.1 & 3.2 test certificates and NACE MR-01-75 conformance.",
      specs: [["Standards", "JIS / ISS / BSS / DIN / ASTM / ASME"], ["Certification", "EN 10204 3.1 & 3.2, third-party inspection"], ["Compliance", "NACE MR-01-75"]],
      apps: ["Oil and gas", "Petrochemical and chemical plants"],
    },
    {
      slug: "pipe-flanges", name: "Pipe Flanges", code: "SM-FLG-001", cat: "pipe-fittings-flanges", featured: false, image: imgPipes,
      short: "Forged pipe flanges and branch connections from an ISO 9001:2015 and IBR approved manufacturer.",
      specs: [["Standards", "ASTM A350, DIN, JIS"], ["Approval", "ISO 9001:2015, IBR"]],
      apps: ["Refining and processing", "Plumbing and HVAC"],
    },
    {
      slug: "carbon-steel-pipes", name: "Carbon Steel Pipes", code: "SM-PIP-001", cat: "carbon-steel-pipes", featured: true, image: imgPipes,
      short: "Carbon steel pipes with dimensions and weights per metre as per ASTM ANSI B36.10 / B36.19.",
      specs: [["Dimensions", "ASTM ANSI B36.10 / B36.19"], ["Supply", "Third-party inspection certificates"]],
      apps: ["Oil and gas exploration", "Structural piping"],
    },
  ];
  for (const [i, p] of prodDefs.entries()) {
    const row = await db.product.upsert({
      where: { slug: p.slug },
      update: { status: "PUBLISHED", featured: p.featured, categoryId: cats[p.cat], name: p.name, productCode: p.code, shortDescription: p.short, sortOrder: i },
      create: {
        slug: p.slug, name: p.name, productCode: p.code, categoryId: cats[p.cat],
        shortDescription: p.short, description: p.short,
        status: "PUBLISHED", featured: p.featured, sortOrder: i,
      },
    });
    await db.productImage.upsert({
      where: { productId_mediaId: { productId: row.id, mediaId: p.image.id } },
      update: {},
      create: { productId: row.id, mediaId: p.image.id, altText: `${p.name} — representative imagery`, sortOrder: 0 },
    });
    await db.productSpecification.deleteMany({ where: { productId: row.id } });
    await db.productSpecification.createMany({
      data: p.specs.map(([name, value], j) => ({ productId: row.id, name, value, sortOrder: j })),
    });
    await db.productApplication.deleteMany({ where: { productId: row.id } });
    await db.productApplication.createMany({
      data: p.apps.map((application, j) => ({ productId: row.id, application, sortOrder: j })),
    });
  }

  /* ---- Customers (buyer list) ---- */
  await db.customer.deleteMany({ where: { name: { contains: "(sample)" } } });
  const customers = ["Apex Engineering", "Coastal Infra", "Precision Tools Co", "Metro Buildwell", "Orbit Industries", "Sterling Projects"];
  for (const [i, name] of customers.entries()) {
    const existing = await db.customer.findFirst({ where: { name } });
    // Content consent = true so the customer logo strip renders for the
    // presentation. (DEMO ONLY — real rows require written consent.)
    if (!existing) await db.customer.create({ data: { name, status: "PUBLISHED", sortOrder: i, consent: true, website: "https://example.com" } });
    else await db.customer.update({ where: { id: existing.id }, data: { status: "PUBLISHED", sortOrder: i, consent: true } });
  }

    /* ---- Testimonials: cleared — real verified quotes only (section hides until then) ---- */
  await db.testimonial.deleteMany({});

    /* ---- Certifications (from the client catalogues) ---- */
  const certs = [
    { name: "ISO 9001:2015 Quality Management", issuer: "ISO" },
    { name: "IBR Approval", issuer: "Indian Boiler Regulations" },
    { name: "EN 10204 3.1 & 3.2 Test Certificates", issuer: "Manufacturer / third party" },
    { name: "NACE MR-01-75 Conformance", issuer: "NACE" },
    { name: "Third-Party Inspection Certificates", issuer: "TPI agencies" },
  ];
  await db.certification.deleteMany({});
  for (const [i, c] of certs.entries()) {
    await db.certification.create({ data: { name: c.name, issuer: c.issuer, status: "PUBLISHED", sortOrder: i } });
  }

  /* ---- Global markets (demo regions) ---- */
  const countries = [
    { code: "ae", label: "Middle East" },
    { code: "de", label: "Europe" },
    { code: "sg", label: "Southeast Asia" },
    { code: "za", label: "Africa" },
    { code: "us", label: "Americas" },
  ];
  for (const [i, c] of countries.entries()) {
    await db.globalCountry.upsert({
      where: { code: c.code },
      update: { status: "PUBLISHED", label: c.label, sortOrder: i, direction: "export" },
      create: { ...c, direction: "export", status: "PUBLISHED", sortOrder: i },
    });
  }

  /* ---- Infrastructure ---- */
  await db.infrastructureItem.deleteMany({ where: { title: { contains: "(sample)" } } });
  const infra = [
    { title: "Warehousing", caption: "Covered storage with material segregation." },
    { title: "Logistics coordination", caption: "Dispatch coordination across India." },
  ];
  for (const [i, item] of infra.entries()) {
    const existing = await db.infrastructureItem.findFirst({ where: { title: item.title } });
    if (!existing) await db.infrastructureItem.create({ data: { ...item, status: "PUBLISHED", sortOrder: i } });
    else await db.infrastructureItem.update({ where: { id: existing.id }, data: { status: "PUBLISHED", sortOrder: i } });
  }

  /* ---- Blog (demo posts) ---- */
  const blogCat = await db.blogCategory.upsert({
    where: { slug: "updates" },
    update: {},
    create: { slug: "updates", name: "Updates", sortOrder: 0 },
  });
  const author = await db.adminUser.findFirst({ where: { role: "SUPER_ADMIN" } });
  const posts: { slug: string; title: string; excerpt: string; content: string; daysAgo: number }[] = [];
  for (const p of posts) {
    const publishedAt = new Date(Date.now() - p.daysAgo * 86_400_000);
    await db.blogPost.upsert({
      where: { slug: p.slug },
      update: { status: "PUBLISHED", publishedAt, categoryId: blogCat.id, authorId: author?.id ?? null },
      create: {
        slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content,
        status: "PUBLISHED", publishedAt, categoryId: blogCat.id, authorId: author?.id ?? null,
      },
    });
  }

  /* ---- Hide base-seed placeholder rows from public site ---- */
  await db.product.updateMany({ where: { slug: { startsWith: "pending-client" } }, data: { status: "DRAFT" } });
  await db.category.updateMany({ where: { slug: { startsWith: "pending-client" } }, data: { status: "DRAFT" } });
  await db.blogPost.updateMany({ where: { title: { contains: "DEV TEST" } }, data: { status: "DRAFT" } });

  console.log("Content seed complete.");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
