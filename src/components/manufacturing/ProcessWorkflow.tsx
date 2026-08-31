"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ProcessStep } from "@/content/manufacturing";

interface Props {
  steps: ProcessStep[];
}

/**
 * Four-step process panel. Rows reveal on scroll (staggered via CSS),
 * become interactive on hover and persist a selected state on click.
 */
export function ProcessWorkflow({ steps }: Props) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ol
      className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0C0D]/85 backdrop-blur-sm"
      aria-label="Manufacturing process"
    >
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = active === i;
        return (
          <li key={step.index}>
            <button
              type="button"
              onClick={() => setActive(isActive ? null : i)}
              aria-pressed={isActive}
              className={cn(
                "group relative flex w-full items-center gap-4 px-5 py-5 text-left transition-colors duration-300 motion-reduce:transition-none",
                "border-b border-white/8 last:border-b-0",
                "hover:bg-white/[0.035]",
                isActive && "bg-white/[0.045]",
              )}
              style={{
                animation: "mf-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
                animationDelay: `${700 + i * 110}ms`,
              }}
            >
              {/* Active/hover gold glow bar */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#F2C766] to-[#B8892E] transition-opacity duration-300",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                )}
              />

              <span className="font-mono text-xs tabular-nums tracking-[0.2em] text-[#727D86] transition-colors duration-300 group-hover:text-[#D8A84E]">
                {step.index}
              </span>

              <Icon
                size={22}
                strokeWidth={1.4}
                className={cn(
                  "shrink-0 transition-all duration-300 motion-reduce:transition-none",
                  isActive
                    ? "text-[#F2C766] drop-shadow-[0_0_8px_rgba(242,199,102,0.7)]"
                    : "text-[#A9B2BA] group-hover:text-[#E5C074] group-hover:drop-shadow-[0_0_6px_rgba(229,185,95,0.5)]",
                )}
                aria-hidden
              />

              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-medium tracking-tight text-[#F5F7F8]">
                  {step.title}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-[#A9B2BA]">
                  {step.description}
                </span>
              </span>

              <ArrowRight
                size={18}
                strokeWidth={1.6}
                className={cn(
                  "shrink-0 transition-all duration-300 motion-reduce:transition-none",
                  isActive
                    ? "translate-x-1 text-[#F2C766]"
                    : "text-[#727D86] group-hover:translate-x-1 group-hover:text-[#E5C074]",
                )}
                aria-hidden
              />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
