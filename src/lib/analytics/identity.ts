import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { appCookieOptions } from "@/lib/http/cookie-policy";

/**
 * Anonymous first-party identity for public traffic.
 * sm_vid — visitor (1 year). sm_sid — visit (30 minutes).
 */

const VISITOR_COOKIE = "sm_vid";
const SESSION_COOKIE = "sm_sid";
const VISITOR_TTL_S = 60 * 60 * 24 * 365;
const SESSION_TTL_S = 60 * 30;
const TOKEN_RE = /^[A-Za-z0-9_-]{16,64}$/;

function newToken(): string {
  return randomBytes(16).toString("base64url");
}

function plausible(value: string | undefined): string | null {
  if (!value || !TOKEN_RE.test(value)) return null;
  return value;
}

export interface AnalyticsIdentity {
  visitorId: string;
  sessionId: string;
}

export async function resolveAnalyticsIdentity(): Promise<AnalyticsIdentity> {
  const store = await cookies();
  let visitorId = plausible(store.get(VISITOR_COOKIE)?.value);
  let sessionId = plausible(store.get(SESSION_COOKIE)?.value);

  if (!visitorId) visitorId = newToken();
  if (!sessionId) sessionId = newToken();

  const base = appCookieOptions();
  store.set(VISITOR_COOKIE, visitorId, { ...base, maxAge: VISITOR_TTL_S });
  store.set(SESSION_COOKIE, sessionId, { ...base, maxAge: SESSION_TTL_S });

  return { visitorId, sessionId };
}
