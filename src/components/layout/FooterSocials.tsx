"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Premium social icons (LinkedIn, X, YouTube) with a subtle 3D
 * perspective tilt toward the cursor, lift, scale and gold glow.
 * Pointer tracking is rAF-throttled; motion is disabled under
 * prefers-reduced-motion and on touch (coarse pointers).
 */

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10v7M8 7.5v.01M12 17v-4a2 2 0 0 1 4 0v4" />
      </>
    ),
  },
  {
    label: "X",
    href: "https://www.x.com",
    path: <path d="M4 4l16 16M20 4 4 20" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    path: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="m10 9 5 3-5 3V9Z" />
      </>
    ),
  },
];

export function FooterSocials() {
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
      {SOCIALS.map((s) => (
        <li key={s.label}>
          <SocialButton
            label={s.label}
            href={s.href}
            disabled={disabled}
          >
            {s.path}
          </SocialButton>
        </li>
      ))}
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
