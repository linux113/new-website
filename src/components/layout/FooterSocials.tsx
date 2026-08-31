"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Premium social icons (Instagram, Facebook) with a subtle 3D
 * perspective tilt toward the cursor, lift, scale and gold glow.
 * Pointer tracking is rAF-throttled; motion is disabled under
 * prefers-reduced-motion and on touch (coarse pointers).
 */

/** Icon artwork per platform. */
const ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8v.01" />
    </>
  ),
  Facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
};

/**
 * Social links come from the admin panel (WebsiteSetting social.*).
 * `links` carries the admin-configured URLs — the icons render ONLY
 * for platforms with a saved URL, so each icon opens the configured
 * profile, never a bare platform homepage. No hardcoded hrefs.
 */
export function FooterSocials({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setDisabled(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          window.matchMedia("(pointer: coarse)").matches,
      ),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <ul className="flex items-center gap-3" aria-label="Social media">
      {links.map((s) => {
        const icon = ICONS[s.label];
        if (!icon) return null;
        return (
          <li key={s.label}>
            <SocialButton
              label={s.label}
              href={s.href}
              disabled={disabled}
            >
              {icon}
            </SocialButton>
          </li>
        );
      })}
    </ul>
  );
}

function SocialButton({
  label,
  href,
  children,
  disabled,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `perspective(500px) rotateY(${(px * 20).toFixed(
        2,
      )}deg) rotateX(${(-py * 20).toFixed(2)}deg) translateZ(10px) scale(1.1)`;
      el.style.boxShadow =
        "0 10px 24px -10px rgba(200,164,93,0.7), 0 0 0 1px rgba(200,164,93,0.4)";
      el.style.borderColor = "rgba(200,164,93,0.6)";
      el.style.color = "#E5C074";
    });
  };

  const onLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
    el.style.borderColor = "";
    el.style.color = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onBlur={onLeave}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-[#A9B2BA] transition-colors duration-200 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A45D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05080B]"
      style={{
        transformStyle: "preserve-3d",
        transition:
          "transform 300ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms ease, border-color 300ms ease, color 300ms ease",
        willChange: "transform",
      }}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {children}
      </svg>
    </a>
  );
}
