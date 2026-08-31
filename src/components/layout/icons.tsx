/**
 * Minimal inline icon set for the layout shell: single stroke
 * style, 1.5px, squared terminals; no icon library dependency added
 * for four glyphs). Decorative by default (aria-hidden) — icon-only
 * buttons carry their own aria-label.
 */

interface IconProps {
  size?: 16 | 20 | 24;
  className?: string;
}

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true as const,
  };
}

export function MenuIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 12h16m0 0l-6-6m6 6l-6 6" />
    </svg>
  );
}
