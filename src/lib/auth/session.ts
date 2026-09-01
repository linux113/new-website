import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { db } from "@/lib/db";
import type { AdminRole } from "@/generated/prisma/enums";
import { appCookieOptions } from "@/lib/http/cookie-policy";

/**
 * Admin session management (server-only).
 *
 * Design:
 * - Opaque 256-bit cryptographically secure random token in an HttpOnly cookie.
 * - Only the SHA-256 hash of the token is stored in PostgreSQL —
 *   a database leak cannot be replayed as a session.
 * - Server-side expiry + instant revocation (logout deletes the row).
 * - Cookie: HttpOnly, SameSite (Lax in prod, None+Secure in sandbox preview),
 *   Secure in production/preview, scoped to path "/".
 * - Default sessions are browser-session cookies (no Max-Age).
 *   "Remember me" sets Max-Age to 30 days.
 */

export const ADMIN_SESSION_COOKIE = "sm_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const TOKEN_RE = /^[A-Za-z0-9_-]{32,128}$/;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function readToken(value: string | undefined): string | null {
  if (!value || !TOKEN_RE.test(value)) return null;
  return value;
}

export async function createSession(
  userId: string,
  ttlMs: number = SESSION_TTL_MS,
  persistent: boolean = false,
): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const h = await headers();
  const ip =
    h.get("cf-connecting-ip")?.trim() ||
    h.get("x-real-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null;
  const userAgent = h.get("user-agent")?.slice(0, 250) ?? null;

  await db.adminSession.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(Date.now() + ttlMs),
      ip,
      userAgent,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    ...appCookieOptions(),
    ...(persistent ? { maxAge: Math.floor(ttlMs / 1000) } : {}),
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = readToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (token) {
    await db.adminSession
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => undefined);
  }
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    ...appCookieOptions(),
    maxAge: 0,
  });
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

/**
 * Resolve the current admin user from the session cookie.
 * Returns null for missing, malformed, expired or revoked sessions,
 * and for suspended users. Cached per-request via React cache().
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = readToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!token) return null;

  const session = await db.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await db.adminSession.deleteMany({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  if (session.user.status !== "ACTIVE") return null;

  // Opportunistic background pruning of expired sessions (1 in 20 requests)
  if (Math.random() < 0.05) {
    db.adminSession
      .deleteMany({ where: { expiresAt: { lt: new Date() } } })
      .catch(() => undefined);
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };
});

/** Constant-time string comparison helper for sensitive values. */
export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}
