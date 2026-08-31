import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "secondaryDark" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  /** Trailing arrow glyph that translates on hover/§22). */
  arrow?: boolean;
  /** External link (renders <a> instead of next/link). */
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

const SIZE: Record<Size, string> = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-13 px-8",
};

const VARIANT: Record<Variant, string> = {
  primary: cn(
    "bg-accent text-ink rounded-xs",
    "hover:bg-accent-hover",
  ),
  secondary: cn(
    "border border-paper/40 text-paper rounded-xs bg-transparent",
    "hover:border-paper hover:bg-paper hover:text-ink",
  ),
  secondaryDark: cn(
    "border border-paper text-paper rounded-xs bg-transparent",
    "hover:bg-paper hover:text-ink",
  ),
  ghost: "text-surface-fg hover:text-accent p-0 h-auto",
};

/**
 * Link styled as a button. All variants: uppercase 13px
 * label, radius-xs, transition duration-base; ghost renders as an
 * inline text link with arrow. One Primary per section max.
 */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  external = false,
  className,
  children,
}: ButtonLinkProps) {
  const classes = cn(
    "group/btn inline-flex items-center justify-center gap-2 text-label whitespace-nowrap",
    "transition-colors duration-(--duration-base) motion-reduce:transition-none",
    variant !== "ghost" && SIZE[size],
    VARIANT[variant],
    className,
  );

  const content = (
    <>
      {children}
      {arrow ? (
        <span
          aria-hidden="true"
          className="transition-transform duration-(--duration-base) group-hover/btn:translate-x-1 motion-reduce:transition-none"
        >
          →
        </span>
      ) : null}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
