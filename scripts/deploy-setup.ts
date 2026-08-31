import "./env.mjs";
import { execSync } from "node:child_process";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * One-shot production bootstrap, run automatically during the Vercel
 * build (see "vercel-build" in package.json) AFTER `prisma migrate
 * deploy`. Everything is optional and idempotent:
 *
 * - ADMIN_NAME + ADMIN_EMAIL + ADMIN_PASSWORD set
 *     → upserts the SUPER_ADMIN user (safe to leave set; re-runs
 *       simply re-hash the same password).
 * - SEED_DEMO="1"
 *     → seeds the "(demo)"-marked presentation content + analytics
 *       history. Remove the env var once real content is entered.
 *
 * Without these env vars the script does nothing and the build
 * continues — so it never blocks a normal deploy.
 */

async function main() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL } = process.env;

  if (!DATABASE_URL) {
    console.log("[deploy-setup] DATABASE_URL not set — skipping bootstrap.");
    return;
  }

  if (ADMIN_NAME && ADMIN_EMAIL && ADMIN_PASSWORD) {
    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("[deploy-setup] ADMIN_PASSWORD must be at least 12 characters.");
    }
    const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const user = await db.adminUser.upsert({
      where: { email: ADMIN_EMAIL.toLowerCase() },
      create: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
      },
      update: { passwordHash, status: "ACTIVE" },
    });
    console.log(`[deploy-setup] Admin user ready: ${user.email} (${user.role})`);
    await db.$disconnect();
  } else {
    console.log("[deploy-setup] ADMIN_* env vars not set — skipping admin bootstrap.");
  }

  const SEED = process.env.SEED_CONTENT ?? process.env.SEED_DEMO; // SEED_DEMO kept for existing environments
  if (SEED === "1") {
    console.log("[deploy-setup] SEED_CONTENT=1 — seeding catalogue content…");
    execSync("npx tsx scripts/seed-content.ts", { stdio: "inherit" });
    execSync("npx tsx scripts/seed-site.ts", { stdio: "inherit" });
    execSync("npx tsx scripts/seed-blog.ts", { stdio: "inherit" });
    // NOTE: demo analytics seeding removed — the admin panel shows
    // only REAL enquiries, contacts and vendor requests. Legacy demo
    // analytics rows are purged by seed-content.ts.

  } else {
    console.log("[deploy-setup] SEED_DEMO not set — skipping demo data.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
