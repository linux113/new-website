import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Testimonial } from "@/content/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

/**
 * Testimonial card (DS §31.3).
 * Quote + attribution. Placeholder quotes render bracketed and muted
 * — no invented names, roles or companies, ever. Avatar optional;
 * renders only when a real image is supplied (radius-full is
 * sanctioned for avatars, DS §7).
 */
export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const isPlaceholder = testimonial.quote.value === null;
  const quote = testimonial.quote.value ?? testimonial.quote.placeholder;

  return (
    <figure
      className={cn(
        "flex h-full flex-col gap-6 border border-edge bg-ink-soft p-6 lg:p-8",
        className,
      )}
    >
      <blockquote
        className={cn(
          "text-body-lg max-w-measure flex-1",
          isPlaceholder ? "text-slate" : "text-paper",
        )}
      >
        {isPlaceholder ? quote : `\u201C${quote}\u201D`}
      </blockquote>

      <figcaption className="flex items-center gap-4 border-t border-edge pt-5">
        {testimonial.avatar?.src ? (
          <span className="relative block size-10 shrink-0 overflow-hidden rounded-full bg-ink">
            <Image
              src={testimonial.avatar.src}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
        ) : null}
        <span className="flex flex-col gap-0.5">
          <span className="text-body-sm font-medium text-paper">
            {testimonial.name}
          </span>
          <span className="text-mono-micro text-mist">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
