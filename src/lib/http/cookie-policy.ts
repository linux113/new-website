/**
 * Cookie flags for admin session and analytics.
 * Supports standard production, localhost dev, and sandbox preview (cross-site iframe) environments.
 */

export function appCookieOptions() {
  const isE2B = process.env.E2B_SANDBOX === "true";
  const isCrossSite = process.env.PREVIEW_CROSS_SITE_COOKIES === "1" || isE2B;
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true as const,
    sameSite: isCrossSite ? ("none" as const) : ("lax" as const),
    secure: isCrossSite || isProd,
    partitioned: isCrossSite,
    path: "/" as const,
  };
}
