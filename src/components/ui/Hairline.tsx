import { cn } from "@/lib/cn";

interface HairlineProps {
  /** Orientation of the 1px rule. Default: horizontal. */
  orientation?: "horizontal" | "vertical";
  /**
   * Decorative by default (aria-hidden). Set semantic to render a real
   * <hr> separator announced to assistive technology.
   */
  semantic?: boolean;
  className?: string;
}

/**
 * The 1px rule — the signature structural element of the
 * system "The Hairline System"). Color adapts to the active
 * surface via --surface-edge.
 */
export function Hairline({
  orientation = "horizontal",
  semantic = false,
  className,
}: HairlineProps) {
  if (semantic && orientation === "horizontal") {
    return (
      <hr className={cn("border-0 border-t border-edge", className)} />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        orientation === "horizontal"
          ? "h-px w-full bg-(--surface-edge)"
          : "w-px self-stretch bg-(--surface-edge)",
        className,
      )}
    />
  );
}
