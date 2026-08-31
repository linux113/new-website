"use client";

import { Globe, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { GlobalRegion } from "@/content/global-regions";

interface RegionCardProps {
  region: GlobalRegion;
  index: number;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}

/**
 * Interactive region row-card. Dark glass surface, 1px border, gold
 * left-edge glow on hover/active, arrow micro-interaction. Staggered
 * entrance via CSS animation delay.
 */
export function RegionCard({
  region,
  index,
  active,
  onEnter,
  onLeave,
  onToggle,
}: RegionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onToggle}
      className={cn(
        "group relative w-full overflow-hidden rounded-lg border border-transparent px-4 py-3 text-left",
        "transition-all duration-300 ease-out motion-reduce:transition-none",
        "hover:bg-white/[0.03]",
        active
          ? "border-[#D8A84E]/50 bg-white/[0.04]"
          : "hover:border-[#D8A84E]/35",
      )}
      style={{
        animation: "gr-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        animationDelay: `${500 + index * 90}ms`,
      }}
    >
      {/* Left accent bar — grows on hover/active */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#F2C766] to-[#B8892E] transition-all duration-300",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-80",
        )}
      />

      <div className="flex items-center gap-4">
        <Globe
          size={20}
          strokeWidth={1.5}
          className={cn(
            "shrink-0 transition-all duration-300 motion-reduce:transition-none",
            active
              ? "text-[#F2C766] drop-shadow-[0_0_8px_rgba(242,199,102,0.8)]"
              : "text-[#A9B2BA] group-hover:text-[#E5C074]",
          )}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className="truncate font-display text-[1.15rem] font-medium tracking-tight text-[#F5F7F8] sm:text-[1.35rem]">
              {region.name}
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#A9B2BA]">
              {region.confirmed ? "Confirmed" : "Pending"}
            </span>
          </div>
          <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-[#727D86]">
            {region.code} · {region.seq}
          </p>
        </div>

        <ArrowUpRight
          size={18}
          strokeWidth={1.5}
          className={cn(
            "shrink-0 transition-all duration-300 motion-reduce:transition-none",
            active
              ? "translate-x-0.5 -translate-y-0.5 text-[#F2C766]"
              : "text-[#727D86] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#E5C074]",
          )}
        />
      </div>
    </button>
  );
}
