import { cn } from "@/lib/cn";
import { CountUp } from "@/components/motion";
import type { Metric } from "@/content/types";

interface StatItemProps {
  metric: Metric;
  /**
   * Animate with CountUp when the value exists. Placeholder values
   * (value: null) always render static placeholders — the counter
   * pattern is real even before the data is (DS §20.5, §31.1).
   */
  animated?: boolean;
  className?: string;
}

/**
 * Stat item (DS §11 Card/Stat): big display numeral + mono label.
 * Designed for hairline-divided rows — compose with
 * `divide-x divide-(--surface-edge)` on the parent (DS §18).
 * Reduced motion → CountUp renders the final value instantly.
 */
export function StatItem({ metric, animated = true, className }: StatItemProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-stat text-surface-fg">
        {animated ? (
          <CountUp
            value={metric.value.value}
            placeholder={metric.value.placeholder}
            prefix={metric.prefix}
            suffix={metric.suffix}
          />
        ) : (
          <span className="tabular-nums">
            {metric.value.value !== null
              ? `${metric.prefix ?? ""}${metric.value.value.toLocaleString("en")}${metric.suffix ?? ""}`
              : metric.value.placeholder}
          </span>
        )}
      </p>
      <p className="text-mono-meta text-surface-muted">{metric.label}</p>
    </div>
  );
}
