import { cn } from "@/lib/cn";

export type SectionSurface = "page" | "sunken" | "dark";

interface SectionProps extends React.ComponentPropsWithoutRef<"section"> {
  /**
   * Surface style (DS §9). Sets data-surface so semantic variables
   * (--surface-bg / fg / edge) cascade to all children.
   */
  surface?: SectionSurface;
  /**
   * Vertical rhythm (DS §6): "default" = py-24 → py-32,
   * "hero" = py-24 → py-40, "none" = no padding (custom internals).
   */
  rhythm?: "default" | "hero" | "none";
  /** Draw the full-bleed top hairline separating sections (DS §9). */
  rule?: boolean;
}

const surfaceAttr: Record<SectionSurface, string | undefined> = {
  page: undefined,
  sunken: "sunken",
  dark: "dark",
};

/**
 * Full-bleed page section (DS §6, §9).
 * Enforces the site-wide section rhythm and surface system; content
 * inside should be wrapped in <Container>.
 */
export function Section({
  surface = "page",
  rhythm = "default",
  rule = false,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      data-surface={surfaceAttr[surface]}
      className={cn(
        "bg-surface text-surface-fg",
        rhythm === "default" && "py-24 lg:py-32",
        rhythm === "hero" && "py-24 lg:py-40",
        rule && "border-t border-edge",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
