import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface IconProps {
  /** Lucide icon component, e.g. `import { Factory } from "lucide-react"`. */
  icon: LucideIcon;
  /** Grid sizes only (DS §26): 16 / 20 / 24. */
  size?: 16 | 20 | 24;
  /** Announce to AT. Omit for decorative (default: hidden). */
  label?: string;
  className?: string;
}

/**
 * The Lucide wrapper (DS §26). Enforces the single icon style:
 * 1.5px stroke, fixed grid sizes, color inherited from text.
 * Decorative by default; pass `label` to expose to screen readers.
 * No filled icons, no tinted-circle chips (those are forbidden).
 */
export function Icon({ icon: LucideGlyph, size = 24, label, className }: IconProps) {
  return (
    <LucideGlyph
      size={size}
      strokeWidth={1.5}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn("shrink-0", className)}
    />
  );
}
