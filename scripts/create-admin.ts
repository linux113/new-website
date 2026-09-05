import "./env.mjs";
import { createInterface } from "node:readline/promises";
import bcrypt from "bcryptjs";
import { createScriptClient } from "./db-client.mjs";

/**
 * Bootstrap/rotate an admin user (interactive or env-driven).
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts
 *   ADMIN_NAME=.. ADMIN_EMAIL=.. ADMIN_PASSWORD=.. npx tsx scripts/create-admin.ts
 *
 * Never hardcode credentials. Password is bcrypt-hashed (cost 12);
 * plaintext is never persisted anywhere.
 */

const db = createScriptClient();

async function main() {
  let name = process.env.ADMIN_NAME;
  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    name = name || (await rl.question("Admin name: "));
    email = email || (await rl.question("Admin email: "));
    password = password || (await rl.question("Admin password (min 12 chars): "));
    rl.close();
  }

  if (!name || !email || !password) throw new Error("All fields are required.");
  if (password.length < 12) throw new Error("Password must be at least 12 characters.");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await db.adminUser.upsert({
    where: { email: email.toLowerCase() },
    create: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    update: { passwordHash, status: "ACTIVE" },
  });
  console.log(`Admin user ready: ${user.email} (${user.role})`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
