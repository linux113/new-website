import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Demo analytics seed — creates clearly "(demo)"-marked enquiry
 * history spread over the past ~120 days so the admin dashboard's
 * DB-driven charts have realistic shape for the client demo.
 * Idempotent: deletes previous rows with source "demo-seed" first.
 * NEVER run against production data.
 */
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const NAMES = ["Rahul Verma", "Priya Nair", "Amit Shah", "Sneha Kulkarni", "Vikram Rao", "Farhan Sheikh", "Deepa Iyer", "Manoj Gupta", "Kavita Joshi", "Arjun Mehta", "Rohit Patil", "Nisha Reddy"];
const COMPANIES = ["Apex Engineering (demo)", "Shree Fabricators (demo)", "Coastal Infra (demo)", "Precision Tools Co (demo)", "Metro Buildwell (demo)", "Orbit Industries (demo)", "Sterling Projects (demo)", "Vertex Manufacturing (demo)", "Galaxy Traders (demo)", "Pinnacle EPC (demo)"];
const STATUSES = ["NEW", "IN_PROGRESS", "CONTACTED", "CLOSED", "CLOSED", "CONTACTED", "IN_PROGRESS", "NEW"] as const;

// Deterministic PRNG so re-seeding is stable.
let s = 42;
const rand = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];

async function main() {
  const products = await db.product.findMany({ select: { id: true }, where: { status: "PUBLISHED" } });

  await db.productEnquiry.deleteMany({ where: { source: "demo-seed" } });
  await db.contactMessage.deleteMany({ where: { source: "demo-seed" } });
  await db.vendorRequest.deleteMany({ where: { source: "demo-seed" } });

  const now = Date.now();
  const DAY = 86_400_000;
  const enquiries: Parameters<typeof db.productEnquiry.create>[0]["data"][] = [];

  for (let d = 120; d >= 0; d--) {
    // Gentle upward trend + weekly rhythm (weekends quieter).
    const date = new Date(now - d * DAY);
    const dow = date.getDay();
    const base = 0.55 + (120 - d) / 160 + (dow === 0 || dow === 6 ? -0.45 : 0);
    const count = Math.max(0, Math.round(base + (rand() - 0.35) * 2));
    for (let i = 0; i < count; i++) {
      const created = new Date(date.getTime() - Math.floor(rand() * 10) * 3_600_000);
      const status = d < 3 ? (rand() < 0.7 ? "NEW" : "IN_PROGRESS") : pick(STATUSES);
      enquiries.push({
        name: pick(NAMES),
        company: pick(COMPANIES),
        email: "buyer@example.com",
        phone: "+91 90000 00000",
        message: "Sample enquiry generated for demo analytics. (demo)",
        requirement: pick(["500 kg", "2 MT", "1,200 pcs", "5 MT", "300 pcs"]),
        productId: rand() < 0.85 && products.length ? pick(products).id : null,
        status,
        source: "demo-seed",
        createdAt: created,
        updatedAt: created,
      });
    }
  }

  for (const data of enquiries) await db.productEnquiry.create({ data });

  // A lighter stream of contact messages + vendor requests.
  for (let i = 0; i < 14; i++) {
    const created = new Date(now - Math.floor(rand() * 110) * DAY);
    await db.contactMessage.create({
      data: {
        name: pick(NAMES), company: pick(COMPANIES), email: "hello@example.com",
        subject: "General enquiry (demo)", message: "Sample contact message for demo analytics. (demo)",
        status: pick(STATUSES), source: "demo-seed", createdAt: created, updatedAt: created,
      },
    });
  }
  for (let i = 0; i < 8; i++) {
    const created = new Date(now - Math.floor(rand() * 110) * DAY);
    await db.vendorRequest.create({
      data: {
        name: pick(NAMES), company: pick(COMPANIES), email: "vendor@example.com",
        offering: pick(["MS scrap supply", "Fastener stock", "SS coils", "Logistics services"]) + " (demo)",
        message: "Sample vendor request for demo analytics. (demo)",
        status: pick(STATUSES), source: "demo-seed", createdAt: created, updatedAt: created,
      },
    });
  }

  console.log(`Seeded ${enquiries.length} demo enquiries + 14 contacts + 8 vendor requests.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
