import Image from "next/image";
import { cn } from "@/lib/cn";
import type { MediaRef } from "@/content/types";

interface LogoSlotProps {
  /** Client logo once supplied; null renders the neutral slot (DS §31.3). */
  logo?: MediaRef | null;
  /** Optional client name (used for alt/label once real). */
  name?: string;
  className?: string;
}

/**
 * Customer logo slot (DS §31.3).
 * Until real client logos are supplied: a grey hairline slot labeled
 * "[CLIENT LOGO]" — never a fake wordmark. Real logos render greyed
 * (grayscale, restores on hover) at a consistent 3:2 box.
 */
export function LogoSlot({ logo, name, className }: LogoSlotProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-3/2 items-center justify-center border border-edge bg-surface p-6",
        className,
      )}
    >
      {logo?.src ? (
        <Image
          src={logo.src}
          alt={logo.alt || name || ""}
          fill
          sizes="(min-width: 64rem) 16vw, (min-width: 40rem) 33vw, 50vw"
          className="object-contain p-6 grayscale opacity-70 transition-[filter,opacity] duration-(--duration-base) hover:grayscale-0 hover:opacity-100 motion-reduce:transition-none"
        />
      ) : (
        // PLACEHOLDER-CONTENT: neutral slot until client supplies logos
        <p className="text-mono-micro text-mist">
          {name ? name.toUpperCase() : "LOGO — RESERVED"}
        </p>
      )}
    </div>
  );
}
