"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui";
import { useReducedMotion } from "@/components/motion";

interface CarouselProps {
  children: React.ReactNode;
  /** Accessible name for the region, e.g. "Testimonials". */
  label: string;
  /**
   * Slide width classes per breakpoint. Default shows a ~12% peek of
   * the next slide on mobile (DS §24.3) and 2–3-up on larger screens.
   */
  itemClassName?: string;
  /** Hide prev/next buttons (mobile galleries where swipe suffices). */
  hideControls?: boolean;
  className?: string;
}

/**
 * Carousel foundation (DS §24.3, §23.2).
 * Native CSS scroll-snap (touch-friendly, no JS momentum) + button
 * controls (carousels must be operable via buttons, not just swipe).
 * Keyboard: the scroll region is focusable; buttons step one slide.
 * Reduced motion: instant jumps instead of smooth scrolling.
 * No autoplay — ever. Reusable for testimonials, galleries, mobile rows.
 */
export function Carousel({
  children,
  label,
  itemClassName = "w-[88%] sm:w-[47%] lg:w-[31.5%]",
  hideControls = false,
  className,
}: CarouselProps) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateControls();
    track.addEventListener("scroll", updateControls, { passive: true });
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", updateControls);
      observer.disconnect();
    };
  }, [updateControls]);

  const step = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const slide = track.querySelector("li");
      const amount = slide ? slide.getBoundingClientRect().width + 24 : track.clientWidth;
      track.scrollBy({
        left: direction * amount,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  const count = Children.count(children);

  return (
    <section aria-roledescription="carousel" aria-label={label} className={className}>
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label={`${label} — ${count} items, scrollable`}
        className={cn(
          "flex snap-x snap-mandatory list-none gap-6 overflow-x-auto",
          "overscroll-x-contain scroll-smooth motion-reduce:scroll-auto",
          // Hide scrollbar but keep the region keyboard-scrollable
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        )}
      >
        {Children.map(children, (child, i) => (
          <li
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className={cn("shrink-0 snap-start", itemClassName)}
          >
            {child}
          </li>
        ))}
      </ul>

      {!hideControls && count > 1 ? (
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!canPrev}
            aria-label="Previous slide"
            className={cn(
              "flex size-11 items-center justify-center rounded-xs border border-edge text-surface-fg",
              "transition-colors duration-(--duration-base) hover:bg-paper-sunken",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
            )}
          >
            <Icon icon={ArrowLeft} size={20} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canNext}
            aria-label="Next slide"
            className={cn(
              "flex size-11 items-center justify-center rounded-xs border border-edge text-surface-fg",
              "transition-colors duration-(--duration-base) hover:bg-paper-sunken",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
            )}
          >
            <Icon icon={ArrowRight} size={20} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
