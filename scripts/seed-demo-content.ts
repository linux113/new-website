import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Demo CONTENT seed for client presentations — categories, products,
 * customers, testimonials, certifications, global markets and blog
 * posts, all clearly "(demo)"/"sample"-marked. NO real business
 * claims, no real standards names, no real customer names.
 * Idempotent: upserts by slug/unique key. Pair with
 * scripts/seed-demo-analytics.ts for dashboard history.
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
  const imgCoils = await media("images/cat-coils.jpg", "cat-coils.jpg", "Steel coils — representative imagery", 1536, 1024);
  const imgSheets = await media("images/cat-sheets.jpg", "cat-sheets.jpg", "Steel sheets — representative imagery", 1536, 1024);
  const imgBars = await media("images/cat-bars.jpg", "cat-bars.jpg", "Steel bars and fasteners — representative imagery", 1536, 1024);
  const imgPipes = await media("images/cat-pipes.jpg", "cat-pipes.jpg", "Steel pipes — representative imagery", 1536, 1024);
  await media("images/material-wide.jpg", "material-wide.jpg", "Metal stock — representative imagery", 1920, 1080);
  await media("images/material-detail.jpg", "material-detail.jpg", "Metal detail — representative imagery", 1536, 1024);

  /* ---- Categories ---- */
  const catDefs = [
    { slug: "fasteners", name: "Fasteners (demo)", image: imgBars, desc: "Sample category for demonstration — bolts, nuts, washers and fixing hardware." },
    { slug: "stainless-steel", name: "Stainless Steel (demo)", image: imgCoils, desc: "Sample category for demonstration — stainless coils, sheets and long products." },
    { slug: "sheets-plates", name: "Sheets & Plates (demo)", image: imgSheets, desc: "Sample category for demonstration — MS and SS sheets and plates." },
    { slug: "pipes-tubes", name: "Pipes & Tubes (demo)", image: imgPipes, desc: "Sample category for demonstration — ERW and seamless pipes and tubes." },
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

  /* ---- Products ---- */
  const prodDefs = [
    {
      slug: "hex-bolt-demo", name: "Hex Bolt (demo)", code: "SM-FST-001", cat: "fasteners", featured: true, image: imgBars,
      short: "Sample product for demonstration — high-tensile hex bolt.",
      specs: [["Size range", "M6 – M42 (sample)"], ["Grade", "8.8 / 10.9 (sample)"], ["Finish", "Zinc plated / HDG (sample)"]],
      apps: ["Structural steelwork (sample)", "Machinery assembly (sample)"],
    },
    {
      slug: "ss-coil-demo", name: "Stainless Coil (demo)", code: "SM-SST-001", cat: "stainless-steel", featured: true, image: imgCoils,
      short: "Sample product for demonstration — cold-rolled stainless coil.",
      specs: [["Thickness", "0.3 – 3.0 mm (sample)"], ["Width", "1000 / 1250 mm (sample)"], ["Finish", "2B / BA (sample)"]],
      apps: ["Kitchen equipment (sample)", "Panel fabrication (sample)"],
    },
    {
      slug: "ms-plate-demo", name: "MS Plate (demo)", code: "SM-SHT-001", cat: "sheets-plates", featured: true, image: imgSheets,
      short: "Sample product for demonstration — mild steel plate.",
      specs: [["Thickness", "5 – 100 mm (sample)"], ["Size", "1250 × 2500 mm and cut-to-size (sample)"]],
      apps: ["General fabrication (sample)", "Bases and flanges (sample)"],
    },
    {
      slug: "erw-pipe-demo", name: "ERW Pipe (demo)", code: "SM-PIP-001", cat: "pipes-tubes", featured: false, image: imgPipes,
      short: "Sample product for demonstration — ERW round pipe.",
      specs: [["OD", '½" – 8" (sample)'], ["Wall", "1.6 – 6.0 mm (sample)"]],
      apps: ["Water lines (sample)", "Structural frames (sample)"],
    },
    {
      slug: "ss-sheet-demo", name: "Stainless Sheet (demo)", code: "SM-SST-002", cat: "stainless-steel", featured: true, image: imgSheets,
      short: "Sample product for demonstration — stainless sheet.",
      specs: [["Thickness", "0.5 – 6.0 mm (sample)"], ["Finish", "2B / No.4 / Mirror (sample)"]],
      apps: ["Architectural cladding (sample)", "Food-grade surfaces (sample)"],
    },
  ];
  for (const [i, p] of prodDefs.entries()) {
    const row = await db.product.upsert({
      where: { slug: p.slug },
      update: { status: "PUBLISHED", featured: p.featured, categoryId: cats[p.cat], name: p.name, productCode: p.code, shortDescription: p.short, sortOrder: i },
      create: {
        slug: p.slug, name: p.name, productCode: p.code, categoryId: cats[p.cat],
        shortDescription: p.short, description: `${p.short}\n\nThis is placeholder demo content; final specifications will come from SRIYAAN METALS.`,
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

  /* ---- Customers (name-only samples) ---- */
  const customers = ["Apex Engineering (sample)", "Coastal Infra (sample)", "Precision Tools Co (sample)", "Metro Buildwell (sample)", "Orbit Industries (sample)", "Sterling Projects (sample)"];
  for (const [i, name] of customers.entries()) {
    const existing = await db.customer.findFirst({ where: { name } });
    if (!existing) await db.customer.create({ data: { name, status: "PUBLISHED", sortOrder: i, consent: false } });
    else await db.customer.update({ where: { id: existing.id }, data: { status: "PUBLISHED", sortOrder: i } });
  }

  /* ---- Testimonials (sample) ---- */
  const testimonials = [
    { personName: "Procurement Head (sample)", personRole: "Apex Engineering (sample)", quote: "Sample testimonial for demonstration — reliable supply and clear communication throughout." },
    { personName: "Project Manager (sample)", personRole: "Coastal Infra (sample)", quote: "Sample testimonial for demonstration — material arrived on schedule with proper documentation." },
    { personName: "Purchase Officer (sample)", personRole: "Metro Buildwell (sample)", quote: "Sample testimonial for demonstration — competitive pricing and responsive follow-up." },
  ];
  for (const [i, t] of testimonials.entries()) {
    const existing = await db.testimonial.findFirst({ where: { personName: t.personName } });
    if (!existing) await db.testimonial.create({ data: { ...t, status: "PUBLISHED", sortOrder: i } });
    else await db.testimonial.update({ where: { id: existing.id }, data: { ...t, status: "PUBLISHED", sortOrder: i } });
  }

  /* ---- Certifications (generic sample names — NOT real standards) ---- */
  const certs = [
    { name: "Quality Management — Sample Certificate", issuer: "Sample issuing body (demo)" },
    { name: "Material Test Reports — Sample Process", issuer: "Sample issuing body (demo)" },
    { name: "Supplier Registration — Sample Certificate", issuer: "Sample issuing body (demo)" },
  ];
  for (const [i, c] of certs.entries()) {
    const existing = await db.certification.findFirst({ where: { name: c.name } });
    if (!existing) await db.certification.create({ data: { ...c, status: "PUBLISHED", sortOrder: i } });
    else await db.certification.update({ where: { id: existing.id }, data: { status: "PUBLISHED", sortOrder: i } });
  }

  /* ---- Global markets (demo regions) ---- */
  const countries = [
    { code: "ae", label: "Middle East (demo)" },
    { code: "de", label: "Europe (demo)" },
    { code: "sg", label: "Southeast Asia (demo)" },
    { code: "za", label: "Africa (demo)" },
    { code: "us", label: "Americas (demo)" },
  ];
  for (const [i, c] of countries.entries()) {
    await db.globalCountry.upsert({
      where: { code: c.code },
      update: { status: "PUBLISHED", label: c.label, sortOrder: i, direction: "export" },
      create: { ...c, direction: "export", status: "PUBLISHED", sortOrder: i },
    });
  }

  /* ---- Infrastructure (sample) ---- */
  const infra = [
    { title: "Warehousing (sample)", caption: "Sample infrastructure item for demonstration — covered storage with material segregation." },
    { title: "Logistics coordination (sample)", caption: "Sample infrastructure item for demonstration — dispatch coordination across India." },
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
  const posts = [
    {
      slug: "digital-home-demo", title: "A new digital home for SRIYAAN METALS (demo)",
      excerpt: "Sample post for demonstration — announcing the new website.",
      content: "## Sample post\n\nThis is demo content for the client presentation. Final articles will be written by SRIYAAN METALS.",
      daysAgo: 6,
    },
    {
      slug: "choosing-fasteners-demo", title: "How to specify fasteners for structural work (demo)",
      excerpt: "Sample post for demonstration — a buyer's checklist.",
      content: "## Sample post\n\nThis is demo content for the client presentation. Final articles will be written by SRIYAAN METALS.",
      daysAgo: 14,
    },
    {
      slug: "stainless-grades-demo", title: "Understanding stainless finishes (demo)",
      excerpt: "Sample post for demonstration — 2B, BA and No.4 explained.",
      content: "## Sample post\n\nThis is demo content for the client presentation. Final articles will be written by SRIYAAN METALS.",
      daysAgo: 24,
    },
  ];
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

  console.log("Demo content seed complete.");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
