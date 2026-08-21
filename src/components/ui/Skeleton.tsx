import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton block (DS §27.1). Exact-geometry placeholder: consumers
 * size it identically to the loaded content (zero CLS). Zinc Wash
 * fill with a subtle opacity pulse; static under reduced motion.
 * Wrap groups in aria-busy on the container; the block itself is
 * hidden from AT.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-paper-sunken animate-pulse motion-reduce:animate-none",
        className,
      )}
    />
  );
}
