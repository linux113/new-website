"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui";
import type { MediaRef } from "@/content/types";

interface LightboxProps {
  media: MediaRef[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen lightbox.
 * Carbon 95% backdrop, shadow-modal image, mono caption + counter.
 * Esc/backdrop close; arrows + swipe navigate; focus trapped; body
 * scroll locked. Crossfade only (reduced motion: instant).
 */
export function Lightbox({ media, index, open, onClose, onNavigate }: LightboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const current = media[index];
  const total = media.length;

  const prev = () => onNavigate((index - 1 + total) % total);
  const next = () => onNavigate((index + 1) % total);

  // Scroll lock.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Keyboard: Esc close, arrows navigate, Tab trapped.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab") {
        const root = rootRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, total]);

  if (!open || !current) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer, ${index + 1} of ${total}`}
      data-surface="dark"
      className="fixed inset-0 z-50 flex flex-col bg-ink/95"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 48) (dx > 0 ? prev : next)();
        touchStartX.current = null;
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <p className="text-mono-meta text-mist">
          {(index + 1).toString().padStart(2, "0")} /{" "}
          {total.toString().padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close image viewer"
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-xs border border-line-dark text-paper transition-colors duration-(--duration-fast) hover:bg-ink-soft"
        >
          <Icon icon={X} size={24} />
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex-1 px-4 pb-4 md:px-16">
        {current.src ? (
          <div className="relative h-full w-full">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              className={cn(
                "object-contain shadow-modal",
                "animate-[fade-in_250ms_var(--ease-inout)] motion-reduce:animate-none",
              )}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-mono-meta text-mist">
              {current.placeholderLabel ?? "IMAGE — [AWAITING CLIENT ASSET]"}
            </p>
          </div>
        )}
      </div>

      {/* Bottom bar: caption + arrows */}
      <div className="flex items-center justify-between gap-4 p-4 md:p-6">
        <p className="min-w-0 truncate text-mono-micro text-mist">{current.alt}</p>
        {total > 1 ? (
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="flex size-11 items-center justify-center rounded-xs border border-line-dark text-paper transition-colors duration-(--duration-fast) hover:bg-ink-soft"
            >
              <Icon icon={ArrowLeft} size={20} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="flex size-11 items-center justify-center rounded-xs border border-line-dark text-paper transition-colors duration-(--duration-fast) hover:bg-ink-soft"
            >
              <Icon icon={ArrowRight} size={20} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
