/**
 * Cookie flags for admin session and analytics.
 * PREVIEW_CROSS_SITE_COOKIES=1 is for the sandbox iframe only.
 */

const CROSS_SITE = process.env.PREVIEW_CROSS_SITE_COOKIES === "1";

export function appCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: CROSS_SITE ? ("none" as const) : ("lax" as const),
    secure: CROSS_SITE || process.env.NODE_ENV === "production",
    partitioned: CROSS_SITE,
    path: "/" as const,
  };
}
