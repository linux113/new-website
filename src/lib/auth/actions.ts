"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession } from "./session";
import { checkRateLimit, clearAttempts, recordFailedAttempt } from "./rate-limit";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

export interface LoginState {
  error?: string;
}

async function resolveClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("cf-connecting-ip")?.trim() ||
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

/**
 * Login server action.
 * - Strict Zod validation
 * - Multi-tier rate limiting (Account, IP, and IP:Email)
 * - bcrypt comparison against a dummy hash even for unknown emails
 *   (constant-work — eliminates user-enumeration timing signals)
 * - Generic error message (no distinction between invalid password vs missing user)
 * - Destroys previous session before creating fresh session
 * - Direct redirect to /admin/dashboard on success
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }
  const { email, password } = parsed.data;

  const ip = await resolveClientIp();
  const rateCtx = { ip, email };

  const limit = checkRateLimit(rateCtx);
  if (!limit.allowed) {
    return {
      error: `Too many attempts. Try again in ${limit.retryAfterMin} minute${limit.retryAfterMin === 1 ? "" : "s"}.`,
    };
  }

  const user = await db.adminUser.findUnique({ where: { email } });

  // Constant-work comparison: hash even when the user doesn't exist.
  const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO7ZBpDLhOK1DEfLd8bqykZaB6dDmXxPy";
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !ok || user.status !== "ACTIVE") {
    recordFailedAttempt(rateCtx);
    return { error: "Invalid email or password." };
  }

  clearAttempts(rateCtx);

  await db.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await destroySession();

  // "Remember me" extends the session from 12 hours to 30 days AND makes
  // the cookie persistent (survives browser restarts).
  const remember = formData.get("remember") === "on";
  await createSession(
    user.id,
    remember ? 1000 * 60 * 60 * 24 * 30 : undefined,
    remember,
  );

  redirect("/admin/dashboard");
}

/** Logout server action — revokes the server-side session. */
export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
