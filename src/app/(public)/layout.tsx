import { SiteFooter, SiteHeader, SkipLink } from "@/components/layout";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * Public site chrome: skip link, fixed navbar, page content, footer,
 * floating contact actions. Admin routes have their own shell and
 * are untouched by this layout.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <SkipLink />
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <FloatingActions />
    </>
  );
}
