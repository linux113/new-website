"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import type { MediaRef } from "@/content/types";

interface GalleryThumbsProps {
  media: MediaRef[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

const KIND_TAG: Record<NonNullable<MediaRef["kind"]>, string> = {
  img: "IMG",
  dwg: "DWG",
  vid: "VID",
};

/**
 * Thumbnail strip.
 * 1:1 hairline-bordered thumbs; active = 2px accent inset. Keyboard:
 * roving tabindex — Arrow keys move, Enter/Space selects (native
 * button). Mono media-type tag on non-photo entries.
 */
export function GalleryThumbs({
  media,
  activeIndex,
  onSelect,
  className,
}: GalleryThumbsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = Math.min(activeIndex + 1, media.length - 1);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = Math.max(activeIndex - 1, 0);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = media.length - 1;
    if (next !== null && next !== activeIndex) {
      e.preventDefault();
      onSelect(next);
      refs.current[next]?.focus();
    }
  };

  if (media.length <= 1) return null;

  return (
    <div
      role="listbox"
      aria-label="Product images"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className={cn("grid grid-cols-5 gap-3", className)}
    >
      {media.map((item, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={`${item.src ?? "pending"}-${i}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="option"
            aria-selected={active}
            aria-label={`Image ${i + 1}: ${item.alt || "pending"}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(i)}
            className={cn(
              "relative aspect-square overflow-hidden border bg-paper-sunken",
              "transition-colors duration-(--duration-fast) motion-reduce:transition-none",
              active
                ? "border-accent shadow-[inset_0_0_0_1px_var(--color-accent)]"
                : "border-edge hover:border-steel",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            )}
          >
            {item.src ? (
              <Image
                src={item.src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-mono-micro text-mist">
                —
              </span>
            )}
            {item.kind && item.kind !== "img" ? (
              <span className="absolute bottom-1 left-1 bg-ink/70 px-1 py-0.5 text-mono-micro text-paper">
                {KIND_TAG[item.kind]}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
