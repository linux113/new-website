import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware — defense-in-depth for /admin.
 *
 * Fast cookie-presence check only (no DB at the edge): requests to
 * /admin/* without a session cookie are redirected to login before
 * any page code runs. REAL authorization happens server-side in
 * every page (requireAdminPage) and every mutation
 * (requireAdminAction) — middleware is an optimization, never the
 * only gate.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Preview bypass: page-level guards authenticate via env flag.
    if (process.env.PREVIEW_DEV_BYPASS === "1") return NextResponse.next();
    const hasCookie = request.cookies.has("sm_admin_session");
    if (!hasCookie) {
      const login = new URL("/admin/login", request.url);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
