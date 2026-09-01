import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { db } from "@/lib/db";
import type { AdminRole } from "@/generated/prisma/enums";

/**
 * Admin session management (server-only).
 *
 * Design:
 * - Opaque 256-bit random token in an HttpOnly cookie.
 * - Only the SHA-256 hash of the token is stored in PostgreSQL —
 *   a database leak cannot be replayed as a session.
 * - Server-side expiry + revocation (logout deletes the row).
 * - Cookie: HttpOnly, SameSite=Lax (CSRF mitigation for top-level
 *   POSTs), Secure in production, scoped to path "/".
 * - Default sessions are BROWSER-SESSION cookies (no Max-Age) —
 *   closing the browser/app ends the login, so /admin/dashboard can
 *   never be re-opened days later without authenticating again.
 *   Only an explicit "Remember me" opt-in sends Max-Age (30 days).
 */

const COOKIE_NAME = "sm_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

/**
 * Cookie policy.
 * Default: SameSite=Lax (CSRF mitigation), Secure in production.
 * PREVIEW_CROSS_SITE_COOKIES=1 (sandbox preview ONLY): the preview
 * embeds the site in an iframe on another origin, and browsers drop
 * Lax cookies in cross-site iframes — the session dies immediately
 * after login. SameSite=None requires Secure; the preview proxy is
 * HTTPS so the browser accepts it. Never enable this in production.
 */
const CROSS_SITE = process.env.PREVIEW_CROSS_SITE_COOKIES === "1";

function cookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: CROSS_SITE ? ("none" as const) : ("lax" as const),
    secure: CROSS_SITE || process.env.NODE_ENV === "production",
    // CHIPS: 2026 browsers drop unpartitioned third-party cookies in
    // cross-origin iframes even with SameSite=None. Partitioned
    // cookies are the sanctioned mechanism for embedded contexts.
    partitioned: CROSS_SITE,
    path: "/" as const,
  };
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: string,
  ttlMs: number = SESSION_TTL_MS,
  persistent: boolean = false,
): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const h = await headers();

  await db.adminSession.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt: new Date(Date.now() + ttlMs),
      ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: h.get("user-agent")?.slice(0, 250) ?? null,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    ...cookieOptions(),
    // Only a persistent ("remember me") session gets Max-Age and
    // survives a browser restart. Default sessions are browser-session
    // cookies — server-side expiry (ttlMs) is always the hard bound.
    ...(persistent ? { maxAge: Math.floor(ttlMs / 1000) } : {}),
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await db.adminSession
      .delete({ where: { tokenHash: hashToken(token) } })
      .catch(() => undefined); // already gone — fine
  }
  cookieStore.delete(COOKIE_NAME);
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

/**
 * Resolve the current admin user from the session cookie.
 * Returns null for missing/expired/revoked sessions or
 * suspended users. Cached per-request via React cache().
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  // NOTE: the old PREVIEW_DEV_BYPASS auto-login backdoor was removed —
  // the admin panel always requires a real login, in every environment.
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await db.adminSession.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  if (session.user.status !== "ACTIVE") return null;

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
