import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon, IndexNumber } from "@/components/ui";

interface FeatureItemProps {
  /** Lucide icon (DS §11 Card/Feature: 24px stroke, top-left, no tinted circle). */
  icon?: LucideIcon;
  /** Optional engineering index (renders instead of / above icon meta). */
  index?: number;
  heading: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Feature item (DS §11 Card/Feature).
 * Editorial: 24px stroke icon top-left — never in a tinted circle —
 * optional mono index, heading, body. Composes into ruled 2×2 grids
 * via parent `divide-*` hairlines (DS §18).
 */
export function FeatureItem({
  icon,
  index,
  heading,
  children,
  className,
}: FeatureItemProps) {
  return (
    <div className={cn("group flex flex-col gap-4 p-6 lg:p-8", className)}>
      <div className="flex items-center justify-between">
        {icon ? <Icon icon={icon} size={24} className="text-surface-fg" /> : null}
        {typeof index === "number" ? <IndexNumber value={index} /> : null}
      </div>
      <h3 className="text-heading-sm text-surface-fg">{heading}</h3>
      <p className="text-body-sm text-surface-muted max-w-measure">{children}</p>
    </div>
  );
}
