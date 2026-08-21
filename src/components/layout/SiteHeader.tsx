import { MAIN_NAV, QUOTE_CTA, SITE_NAME } from "@/content/site";
import { Navbar } from "./Navbar";

/**
 * Site header composition (server component).
 * Reads the nav structure from content/site.ts and hands it to the
 * interactive Navbar — the "use client" boundary starts there.
 */
export function SiteHeader() {
  return <Navbar siteName={SITE_NAME} nav={MAIN_NAV} cta={QUOTE_CTA} />;
}
