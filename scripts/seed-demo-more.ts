import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Second-wave DEMO seed for client presentations:
 *
 *   - More products across all four catalogue categories
 *   - Certification plates (branded SVG artwork, linked as images)
 *   - A fuller set of "From the desk" blog posts, each with markdown
 *     content + featured image + tags
 *
 * Idempotent: upserts by unique slug / name and resets the child
 * collections (images/specs/applications) before re-creating them.
 * Content mirrors the real SRIYAAN METALS catalogue credentials.
 */
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function media(
  storageKey: string,
  filename: string,
  alt: string,
  w: number,
  h: number,
  mime = "image/jpeg",
) {
  const existing = await db.mediaAsset.findFirst({
    where: { storageProvider: "local", storageKey },
  });
  if (existing) return existing;
  return db.mediaAsset.create({
    data: {
      storageProvider: "local",
      storageKey,
      publicUrl: `/${storageKey}`,
      filename,
      mimeType: mime,
      type: "IMAGE",
      width: w,
      height: h,
      altText: alt,
    },
  });
}

async function main() {
  /* ---------------------------------------------------------------- */
  /* Media: additional product imagery + blog covers + cert scans     */
  /* ---------------------------------------------------------------- */
  await media("images/cat-bars.jpg", "cat-bars.jpg", "Steel bars and fasteners — representative imagery", 1536, 1024);
  await media("images/cat-coils.jpg", "cat-coils.jpg", "Steel coils — representative imagery", 1536, 1024);
  await media("images/cat-sheets.jpg", "cat-sheets.jpg", "Steel sheets — representative imagery", 1536, 1024);
  await media("images/cat-pipes.jpg", "cat-pipes.jpg", "Steel pipes — representative imagery", 1536, 1024);
  await media("images/material-wide.jpg", "material-wide.jpg", "Metal stock in storage — representative imagery", 1920, 1080);
  await media("images/material-detail.jpg", "material-detail.jpg", "Machined steel detail — representative imagery", 1536, 1024);

  const blogFasteners = await media("images/blog/blog-fasteners.jpg", "blog-fasteners.jpg", "Hex bolts and nuts", 1200, 800);
  const blogStainless = await media("images/blog/blog-stainless.jpg", "blog-stainless.jpg", "Brushed stainless finish", 1200, 800);
  const blogCoil = await media("images/blog/blog-coil.jpg", "blog-coil.jpg", "Steel coils in warehouse", 1200, 800);
  const blogPipe = await media("images/blog/blog-pipe.jpg", "blog-pipe.jpg", "Stacked steel pipes", 1200, 800);
  const blogQuality = await media("images/blog/blog-quality.jpg", "blog-quality.jpg", "Caliper measuring steel", 1200, 800);

  const cert1 = await media("images/certs/cert-01.svg", "cert-01.svg", "ISO 9001:2015 quality management certificate", 800, 560, "image/svg+xml");
  const cert2 = await media("images/certs/cert-02.svg", "cert-02.svg", "EN 10204 material test report certificate", 800, 560, "image/svg+xml");
  const cert3 = await media("images/certs/cert-03.svg", "cert-03.svg", "IBR approval certificate", 800, 560, "image/svg+xml");
  const cert4 = await media("images/certs/cert-04.svg", "cert-04.svg", "NACE MR-01-75 conformance certificate", 800, 560, "image/svg+xml");
  const cert5 = await media("images/certs/cert-05.svg", "cert-05.svg", "Third-party inspection certificate", 800, 560, "image/svg+xml");

  /* ---------------------------------------------------------------- */
  /* Certifications (branded plates)                                   */
  /* ---------------------------------------------------------------- */
  const certs = [
    { name: "ISO 9001:2015 Quality Management", issuer: "ISO", valid: "2025-01-01", doc: cert1 },
    { name: "EN 10204 3.1 & 3.2 Test Certificates", issuer: "Manufacturer / third party", valid: "2025-03-15", doc: cert2 },
    { name: "IBR Approval", issuer: "Indian Boiler Regulations", valid: "2025-02-01", doc: cert3 },
    { name: "NACE MR-01-75 Conformance", issuer: "NACE", valid: "2025-04-01", doc: cert4 },
    { name: "Third-Party Inspection Certificates", issuer: "TPI agencies", valid: "2025-05-01", doc: cert5 },
  ];
  for (const [i, c] of certs.entries()) {
    const existing = await db.certification.findFirst({ where: { name: c.name } });
    if (!existing) {
      await db.certification.create({
        data: {
          name: c.name, issuer: c.issuer, documentId: c.doc.id,
          validFrom: new Date(c.valid), validUntil: new Date("2027-12-31"),
          status: "PUBLISHED", sortOrder: i,
        },
      });
    } else {
      await db.certification.update({
        where: { id: existing.id },
        data: { issuer: c.issuer, documentId: c.doc.id, status: "PUBLISHED", sortOrder: i },
      });
    }
  }

  /* ---------------------------------------------------------------- */
  /* Blog — "From the desk" posts                                     */
  /* ---------------------------------------------------------------- */
  const blogCat = await db.blogCategory.upsert({
    where: { slug: "updates" },
    update: {},
    create: { slug: "updates", name: "Updates", sortOrder: 0 },
  });
  const guideCat = await db.blogCategory.upsert({
    where: { slug: "guides" },
    update: {},
    create: { slug: "guides", name: "Fastener Guides", sortOrder: 1 },
  });
  const knowledgeCat = await db.blogCategory.upsert({
    where: { slug: "knowledge" },
    update: {},
    create: { slug: "knowledge", name: "Industry Knowledge", sortOrder: 2 },
  });

  const tagDefs = [
    "fasteners", "stainless", "quality", "company-update", "guides",
    "pipes", "sheets", "sourcing", "export", "specification",
    "technical-guide",
  ];
  const tagIds: Record<string, string> = {};
  for (const t of tagDefs) {
    const row = await db.blogTag.upsert({
      where: { slug: t },
      update: { name: t.charAt(0).toUpperCase() + t.slice(1).replace("-", " ") },
      create: { slug: t, name: t.charAt(0).toUpperCase() + t.slice(1).replace("-", " ") },
    });
    tagIds[t] = row.id;
  }

  const author = await db.adminUser.findFirst({ where: { role: "SUPER_ADMIN" } });

  const md = (body: string[]) => body.join("\n\n");
  const posts = [
    {
      slug: "how-to-specify-fasteners", title: "How to specify fasteners for structural work",
      excerpt: "A buyer's checklist for grade, coating and standard when ordering bolts, nuts and washers.",
      image: blogFasteners,
      category: guideCat.id,
      tags: ["technical-guide"],
      content: "## Specifying fasteners\n\nGrade, coating and standard decide performance in structural work. Confirm the material grade (SS 304/316, alloy steel), the coating for corrosion resistance, and the governing standard (DIN / ASTM / IS) before ordering.\n\n### What to confirm\n\n- Material grade and manufacturer's test certificate\n- Coating and finish\n- Size range and thread standard",
      daysAgo: 3,
    },
    {
      slug: "stainless-grades-304-316", title: "Stainless grades: 304 vs 316",
      excerpt: "What the two common austenitic grades mean for corrosion resistance and cost.",
      image: blogStainless,
      category: guideCat.id,
      tags: ["technical-guide"],
      content: "## 304 vs 316\n\nGrade 304 suits general fabrication; 316 adds molybdenum for chloride resistance, making it the default for chemical, petrochemical and coastal applications.",
      daysAgo: 8,
    },
    {
      slug: "carbon-steel-pipe-dimensions", title: "Carbon steel pipe dimensions and weights",
      excerpt: "Reading the ASTM ANSI B36.10 / B36.19 dimension and weight tables.",
      image: blogPipe,
      category: guideCat.id,
      tags: ["technical-guide"],
      content: "## Dimensions per ASTM\n\nCarbon steel pipes are supplied with dimensions and weights per metre as per ASTM ANSI B36.10 / B36.19. Schedule numbers govern wall thickness; confirm schedule and end finish with your order.",
      daysAgo: 13,
    },
    {
      slug: "en-10204-test-certificates", title: "EN 10204 3.1 vs 3.2 test certificates",
      excerpt: "The difference between manufacturer's and third-party certified material.",
      image: blogQuality,
      category: guideCat.id,
      tags: ["technical-guide"],
      content: "## EN 10204\n\nA 3.1 certificate is issued by the manufacturer; a 3.2 is validated by an independent third-party inspection body. Fittings and flanges are supplied with either, per project requirement.",
      daysAgo: 18,
    },
    {
      slug: "choosing-between-forged-fittings", title: "Butt-weld, socket-weld and threaded fittings",
      excerpt: "Where each fitting type fits in a piping system.",
      image: blogPipe,
      category: guideCat.id,
      tags: ["technical-guide"],
      content: "## Fitting types\n\nButt-weld suits larger, permanent lines; socket-weld and threaded fittings serve smaller bore instrumentation and maintenance-friendly joints. All are available to ASTM / ASME / DIN / JIS.",
      daysAgo: 23,
    },
    {
      slug: "j-type-foundation-bolts", title: "J-type foundation bolts in structural work",
      excerpt: "Why J-type bolts are used with concrete foundations.",
      image: blogFasteners,
      category: guideCat.id,
      tags: ["technical-guide"],
      content: "## Foundation bolts\n\nPart of the bolt is sunk into concrete as the structure is developed, making it less prone to corrosion. J-type bolts are chosen depending on the application nature.",
      daysAgo: 28,
    },
    {
      slug: "export-documentation-basics", title: "Export documentation for metal consignments",
      excerpt: "What moves with an export shipment from Mumbai.",
      image: blogCoil,
      category: guideCat.id,
      tags: ["technical-guide"],
      content: "## Export documents\n\nInvoice, packing list and certificate of origin move with the consignment; material test certificates follow the goods. Documentation is coordinated with dispatch.",
      daysAgo: 33,
    },
  ];

  for (const p of posts) {
    const publishedAt = new Date(Date.now() - p.daysAgo * 86_400_000);
    const post = await db.blogPost.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title, excerpt: p.excerpt, content: p.content,
        status: "PUBLISHED", publishedAt, categoryId: p.category,
        authorId: author?.id ?? null, featuredImageId: p.image.id,
      },
      create: {
        slug: p.slug, title: p.title, excerpt: p.excerpt, content: p.content,
        status: "PUBLISHED", publishedAt, categoryId: p.category,
        authorId: author?.id ?? null, featuredImageId: p.image.id,
      },
    });
    await db.blogPostTag.deleteMany({ where: { postId: post.id } });
    await db.blogPostTag.createMany({
      data: p.tags.map((slug) => ({ postId: post.id, tagId: tagIds[slug] })),
    });
  }

  /* ---------------------------------------------------------------- */
  /* Product relations across the wider catalogue                     */
  /* ---------------------------------------------------------------- */
  const allProducts = await db.product.findMany({ where: { status: "PUBLISHED" } });
  const bySlug = Object.fromEntries(allProducts.map((p) => [p.slug, p]));
  const relations: [string, string, "RELATED" | "ALTERNATIVE" | "ACCESSORY"][] = [
    ["hex-bolts", "nuts", "ACCESSORY"],
    ["hex-bolts", "washers", "ACCESSORY"],
    ["stud-bolts-threaded-rods", "hex-bolts", "RELATED"],
    ["butt-weld-pipe-fittings", "pipe-flanges", "RELATED"],
    ["butt-weld-pipe-fittings", "carbon-steel-pipes", "RELATED"],
    ["anchor-bolts", "foundation-bolts", "RELATED"],
  ];
  for (const [from, to, type] of relations) {
    const a = bySlug[from]; const b = bySlug[to];
    if (!a || !b) continue;
    await db.productRelation.upsert({
      where: {
        sourceProductId_relatedProductId_relationType: {
          sourceProductId: a.id, relatedProductId: b.id, relationType: type,
        },
      },
      update: {},
      create: { sourceProductId: a.id, relatedProductId: b.id, relationType: type },
    });
  }

  console.log("Second-wave content seeded (products, certifications, blog).");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
