import "./env.mjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Supplementary content seed for client presentations — fills the tables
 * that seed-content.ts does not cover, so every section of the
 * site + admin panel has representative data:
 *
 *   - Industries (Construction / Automotive / Engineering / Infrastructure)
 *   - Capability strip metrics
 *   - Company pages (About, Quality, Manufacturing, Global Reach)
 *   - Website settings (contact, social, hero/cta copy, SEO)
 *   - Blog tags + tag assignment on demo posts
 *   - Product relations (related / alternative / accessory)
 *   - Product documents (datasheet placeholders)
 *   - SEO metadata on categories + products + posts + pages
 *   - Social links + navigation items (header/footer)
 *   - ImportExportCapability rows
 *
 * Idempotent: upserts by unique slug/key. Everything is clearly demo
 * content. NEVER run against production with real data.
 */
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function upsertSetting(key: string, value: unknown, group: string) {
  await db.websiteSetting.upsert({
    where: { key },
    update: { value: value as never, group },
    create: { key, value: value as never, group },
  });
}

async function main() {
  /* ------------------------------------------------------------------ */
  /* Industries                                                         */
  /* ------------------------------------------------------------------ */
  const industries = [
    { slug: "construction", name: "Construction", description: "Structural steel, reinforcement and fixing hardware for building projects." },
    { slug: "automotive", name: "Automotive", description: "Grades and finishes suited to automotive component manufacturing." },
    { slug: "engineering", name: "Engineering", description: "Stock for general engineering, fabrication and machine shops." },
    { slug: "infrastructure", name: "Infrastructure", description: "Material for roads, bridges, utilities and public works." },
  ];
  for (const [i, ind] of industries.entries()) {
    await db.industry.upsert({
      where: { slug: ind.slug },
      update: { ...ind, status: "PUBLISHED", sortOrder: i },
      create: { ...ind, status: "PUBLISHED", sortOrder: i },
    });
  }

  /* ------------------------------------------------------------------ */
  /* Capability metrics (homepage strip when wired to DB)               */
  /* ------------------------------------------------------------------ */
  const capabilities = [
    { label: "Product lines", note: "Fasteners, fittings, flanges & pipes", metricValue: 6, metricSuffix: " categories" },
    { label: "Product lines", note: "Fasteners, fittings, flanges & pipes", metricValue: 6, metricSuffix: " categories" },
    { label: "Materials", note: "SS, CS, alloy, brass, copper, nickel alloys", metricValue: 15, metricSuffix: "+ grades" },
    { label: "Dispatch", note: "Against confirmed orders", metricValue: 48, metricSuffix: " hr" },
  ];
  for (const [i, c] of capabilities.entries()) {
    const existing = await db.capability.findFirst({ where: { label: c.label } });
    if (!existing) await db.capability.create({ data: { ...c, status: "PUBLISHED", sortOrder: i } });
    else await db.capability.update({ where: { id: existing.id }, data: { ...c, status: "PUBLISHED", sortOrder: i } });
  }

  /* ------------------------------------------------------------------ */
  /* Import / Export capabilities                                       */
  /* ------------------------------------------------------------------ */
  const tradeCaps = [
    { direction: "import", title: "Sourcing origins", description: "International sourcing against confirmed buyer requirements — grades, quantities and schedules agreed before commitment." },
    { direction: "export", title: "Export markets", description: "Documentation-backed dispatch from Mumbai to overseas buyers." },
  ];
  for (const [i, t] of tradeCaps.entries()) {
    const existing = await db.importExportCapability.findFirst({ where: { title: t.title } });
    if (!existing) await db.importExportCapability.create({ data: { ...t, status: "PUBLISHED", sortOrder: i } });
    else await db.importExportCapability.update({ where: { id: existing.id }, data: { ...t, status: "PUBLISHED", sortOrder: i } });
  }

  /* ------------------------------------------------------------------ */
  /* Company pages (About / Quality / Manufacturing / Global Reach)     */
  /* ------------------------------------------------------------------ */
  const companyPages = [
    {
      key: "about",
      title: "About SRIYAAN METALS",
      content:
        "## About\n\nSRIYAAN METALS is a Mumbai-based metals trading and import-export business operating from Platinum Arcade, JSS Road, Opera House. We supply fasteners, pipe fittings, flanges and carbon steel pipes to buyers across India and overseas.\n\n- Fasteners in all grades — SS 304/316, alloy steel, brass, copper, Hastelloy, Inconel, Monel, Duplex\n- Import and export coordination\n- Enquiry-driven, specification-first supply",
    },
    {
      key: "quality",
      title: "Quality",
      content:
        "## Quality\n\nMaterial is inspected against the order specification before acceptance. Products are supplied with manufacturer test certificates per EN 10204 3.1 & 3.2 under third-party inspection, conforming to NACE MR-01-75, from an ISO 9001:2015 and IBR approved manufacturer.",
    },
    {
      key: "manufacturing",
      title: "Manufacturing & Infrastructure",
      content:
        "## Infrastructure\n\nIn-house facilities include cutting, hot and cold forming, pressing, welding, heat treatment, machining, pickling, hydraulic testing, ball passing, passivation and anti-rust coating for protection and durable packaging. Covered warehousing with material segregation.",
    },
    {
      key: "global-reach",
      title: "Global Reach",
      content:
        "## Global reach\n\nImport and export operations run from Mumbai — integrated piping solutions with worldwide fulfilment capability, manufactured to DIN, ASTM A350 and JIS standards for oil and gas, petrochemical, chemical, plumbing and HVAC industries.",
    },
  ];
  for (const p of companyPages) {
    await db.companyPage.upsert({
      where: { key: p.key },
      update: { title: p.title, content: p.content, status: "PUBLISHED" },
      create: { ...p, status: "PUBLISHED" },
    });
  }

  /* ------------------------------------------------------------------ */
  /* Website settings (contact, social, content, SEO)                   */
  /* ------------------------------------------------------------------ */
  await upsertSetting("contact.phone1", "+91 96195 61657", "contact");
  await upsertSetting("contact.phone2", "+91 98190 33982", "contact");
  await upsertSetting("contact.whatsapp1", "+91 96195 61657", "contact");
  await upsertSetting("contact.whatsapp2", "+91 98190 33982", "contact");
  await upsertSetting("contact.email.info", "info@sriyaanmetals.com", "contact");
  await upsertSetting("contact.email.sales", "sales@sriyaanmetals.com", "contact");
  await upsertSetting("contact.email.purchase", "purchase@sriyaanmetals.com", "contact");
  await upsertSetting("contact.email.accounts", "accounts@sriyaanmetals.com", "contact");
  await upsertSetting("contact.hours", "10:00 AM – 7:00 PM", "contact");
  await upsertSetting(
    "contact.address",
    "Floor-2, 204, Plot No.96/98,\nPlatinum Arcade, JSS Road,\nCentral Plaza Cinema Charni Road,\nOpera House, Mumbai - 400004",
    "contact",
  );
  await upsertSetting("contact.gst", "GSTIN: 27CRKPS0693G1ZB", "contact");

  await upsertSetting("social.instagram", "https://www.instagram.com/sriyaanmetals", "social");
  await upsertSetting("social.facebook", "https://www.facebook.com/sriyaanmetals", "social");

  await upsertSetting(
    "content.hero.headline",
    "Precision-engineered metal, supplied with editorial calm.",
    "content",
  );
  await upsertSetting(
    "content.hero.subline",
    "Mumbai-based metals trading, import and export. Send your specification for a considered quote.",
    "content",
  );
  await upsertSetting(
    "content.cta.headline",
    "Send us your specification",
    "content",
  );
  await upsertSetting(
    "content.cta.subline",
    "Tell us the grade, size, quantity and delivery — we respond with a considered quote.",
    "content",
  );
  await upsertSetting(
    "content.footer.description",
    "SRIYAAN METALS — Mumbai-based metals trading, import & export. Demonstration content.",
    "content",
  );

  await upsertSetting("seo.default.title", "SRIYAAN METALS — Metals Trading, Import & Export, Mumbai", "seo");
  await upsertSetting(
    "seo.default.description",
    "Mumbai-based metals trading, import and export. Send your specification for a considered quote.",
    "seo",
  );
  await upsertSetting("seo.home.title", "SRIYAAN METALS — Metals Trading, Import & Export, Mumbai", "seo");
  await upsertSetting(
    "seo.home.description",
    "SRIYAAN METALS — Mumbai-based metals trading, import and export. Browse the catalogue and send a specification for a quote.",
    "seo",
  );
  await upsertSetting("seo.robots", "index,follow", "seo");

  /* ------------------------------------------------------------------ */
  /* Social links table (footer)                                        */
  /* ------------------------------------------------------------------ */
  const socialRows = [
    { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/sriyaanmetals" },
    { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/sriyaanmetals" },
  ];
  for (const [i, s] of socialRows.entries()) {
    await db.socialLink.upsert({
      where: { platform: s.platform },
      update: { ...s, status: "PUBLISHED", sortOrder: i },
      create: { ...s, status: "PUBLISHED", sortOrder: i },
    });
  }

  /* ------------------------------------------------------------------ */
  /* Navigation items (header + footer groups)                          */
  /* ------------------------------------------------------------------ */
  await db.navigationItem.deleteMany({ where: { menu: { startsWith: "demo-" } } });

  const headerItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Industries", href: "/industries" },
    { label: "About", href: "/about" },
    { label: "Quality", href: "/quality" },
    { label: "Manufacturing", href: "/manufacturing" },
    { label: "Global Reach", href: "/global-reach" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];
  for (const [i, n] of headerItems.entries()) {
    await db.navigationItem.create({
      data: { menu: "demo-header", label: n.label, href: n.href, status: "PUBLISHED", sortOrder: i },
    });
  }

  /* ------------------------------------------------------------------ */
  /* Blog tags + assign to demo posts                                   */
  /* ------------------------------------------------------------------ */
  const tags = ["fasteners", "stainless", "quality", "company-update", "guides"];
  const tagIds: Record<string, string> = {};
  for (const t of tags) {
    const row = await db.blogTag.upsert({
      where: { slug: t },
      update: { name: t.charAt(0).toUpperCase() + t.slice(1).replace("-", " ") },
      create: { slug: t, name: t.charAt(0).toUpperCase() + t.slice(1).replace("-", " ") },
    });
    tagIds[t] = row.id;
  }
  const posts = await db.blogPost.findMany({ where: { slug: { contains: "-demo" } } });
  for (const post of posts) {
    await db.blogPostTag.deleteMany({ where: { postId: post.id } });
    const assign = post.slug.includes("fastener")
      ? ["fasteners", "guides"]
      : post.slug.includes("stainless")
        ? ["stainless", "guides"]
        : ["company-update"];
    await db.blogPostTag.createMany({
      data: assign.map((slug) => ({ postId: post.id, tagId: tagIds[slug] })),
    });
  }

  /* ------------------------------------------------------------------ */
  /* Product relations + product documents                              */
  /* ------------------------------------------------------------------ */
  const products = await db.product.findMany({ where: { slug: { contains: "-demo" } } });
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  if (bySlug["hex-bolt-demo"] && bySlug["ms-plate-demo"]) {
    await db.productRelation.upsert({
      where: {
        sourceProductId_relatedProductId_relationType: {
          sourceProductId: bySlug["hex-bolt-demo"].id,
          relatedProductId: bySlug["ms-plate-demo"].id,
          relationType: "ACCESSORY",
        },
      },
      update: {},
      create: {
        sourceProductId: bySlug["hex-bolt-demo"].id,
        relatedProductId: bySlug["ms-plate-demo"].id,
        relationType: "ACCESSORY",
      },
    });
  }
  if (bySlug["ss-coil-demo"] && bySlug["ss-sheet-demo"]) {
    await db.productRelation.upsert({
      where: {
        sourceProductId_relatedProductId_relationType: {
          sourceProductId: bySlug["ss-coil-demo"].id,
          relatedProductId: bySlug["ss-sheet-demo"].id,
          relationType: "ALTERNATIVE",
        },
      },
      update: {},
      create: {
        sourceProductId: bySlug["ss-coil-demo"].id,
        relatedProductId: bySlug["ss-sheet-demo"].id,
        relationType: "ALTERNATIVE",
      },
    });
  }

  // A datasheet media asset + document link per product.
  const datasheetMedia = await db.mediaAsset.upsert({
    where: { storageProvider_storageKey: { storageProvider: "local", storageKey: "documents/datasheet.pdf" } },
    update: {},
    create: {
      storageProvider: "local",
      storageKey: "documents/datasheet.pdf",
      publicUrl: null, // no real PDF in repo; link renders only when present
      filename: "datasheet.pdf",
      mimeType: "application/pdf",
      type: "DOCUMENT",
      altText: "Product datasheet",
    },
  });
  for (const p of products) {
    await db.productDocument.upsert({
      where: {
        // no unique constraint besides id; delete-then-create by product+name
        id: `${p.id}-datasheet`,
      },
      update: {},
      create: {
        id: `${p.id}-datasheet`,
        productId: p.id,
        mediaId: datasheetMedia.id,
        name: "Datasheet",
        type: "DATASHEET",
        sortOrder: 0,
      },
    }).catch(async () => {
      // id may collide on re-seed; fall back to find-or-create
      const existing = await db.productDocument.findFirst({
        where: { productId: p.id, name: "Datasheet" },
      });
      if (!existing) {
        await db.productDocument.create({
          data: { productId: p.id, mediaId: datasheetMedia.id, name: "Datasheet", type: "DATASHEET", sortOrder: 0 },
        });
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* SEO metadata for published categories/products/posts/pages         */
  /* ------------------------------------------------------------------ */
  async function attachSeo<T extends { id: string; seoId: string | null }>(
    row: T,
    title: string,
    description: string,
    update: (id: string, data: { seo: { connect: { id: string } } }) => Promise<unknown>,
  ) {
    if (row.seoId) {
      await db.seoMeta.update({ where: { id: row.seoId }, data: { metaTitle: title, metaDescription: description } });
      return;
    }
    const seo = await db.seoMeta.create({ data: { metaTitle: title, metaDescription: description } });
    await update(row.id, { seo: { connect: { id: seo.id } } });
  }

  // Categories in content seed use slugs fasteners, stainless-steel, etc.
  const allCats = await db.category.findMany({ where: { status: "PUBLISHED" } });
  for (const c of allCats) {
    await attachSeo(
      c,
      `${c.name} — SRIYAAN METALS`,
      c.description ?? `Explore ${c.name} from SRIYAAN METALS.`,
      (id, data) => db.category.update({ where: { id }, data }),
    );
  }

  for (const p of products) {
    await attachSeo(
      p,
      `${p.name} — SRIYAAN METALS`,
      p.shortDescription ?? `${p.name} — specification-driven supply from SRIYAAN METALS.`,
      (id, data) => db.product.update({ where: { id }, data }),
    );
  }

  for (const post of posts) {
    await attachSeo(
      post,
      `${post.title} — SRIYAAN METALS`,
      post.excerpt ?? `Notes from the SRIYAAN METALS desk.`,
      (id, data) => db.blogPost.update({ where: { id }, data }),
    );
  }

  const pages = await db.companyPage.findMany({ where: { status: "PUBLISHED" } });
  for (const pg of pages) {
    await attachSeo(
      pg,
      `${pg.title} — SRIYAAN METALS`,
      `SRIYAAN METALS company page.`,
      (id, data) => db.companyPage.update({ where: { id }, data }),
    );
  }

  console.log("Supplementary content seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
