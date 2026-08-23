import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui";

interface GlowCardProps {
  /** Neon accent as a hex colour, e.g. `#00F0FF`. */
  glow: string;
  /** Pill label rendered with a glowing status dot. */
  tag: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

/**
 * Dark neon card: 1px glowing border, outer bloom, inset sheen, and
 * two counter-rotating conic arcs driven by `--glow-a1` / `--glow-a2`.
 */
export function GlowCard({
  glow,
  tag,
  title,
  icon,
  children,
  className,
}: GlowCardProps) {
  return (
    <article
      className={cn("glow-card", className)}
      style={{ ["--glow" as string]: glow }}
    >
      <div className="glow-card-arcs" aria-hidden>
        <span className="glow-card-arc glow-card-arc-1" />
        <span className="glow-card-arc glow-card-arc-2" />
      </div>
      <div className="glow-card-face">
        <div className="flex items-start justify-between gap-4">
          <span className="glow-card-icon">
            <Icon icon={icon} size={24} />
          </span>
          <span className="glow-card-tag">
            <span className="glow-card-dot" aria-hidden />
            {tag}
          </span>
        </div>
        <h3 className="text-heading-sm mt-6 text-paper">{title}</h3>
        <div className="text-body-sm mt-3 text-mist">{children}</div>
      </div>
    </article>
  );
}
