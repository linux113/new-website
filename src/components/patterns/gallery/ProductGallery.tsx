"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { MediaRef } from "@/content/types";
import { GalleryStage } from "./GalleryStage";
import { GalleryThumbs } from "./GalleryThumbs";
import { Lightbox } from "./Lightbox";

interface ProductGalleryProps {
  media: MediaRef[];
  className?: string;
}

/**
 * Product gallery composition.
 * Stage (4:3) + 5-up thumb strip + full-screen lightbox. The sticky
 * left-column placement on product pages is the *page's* concern
 * (`lg:sticky lg:top-24` on the wrapper) — the gallery itself stays
 * layout-agnostic and database/API-independent.
 *
 * With no media, renders the single honest placeholder stage.
 */
export function ProductGallery({ media, className }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeActive = Math.min(active, Math.max(media.length - 1, 0));
  const current = media[safeActive] ?? null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <GalleryStage
        media={current}
        index={safeActive + 1}
        total={Math.max(media.length, 1)}
        onZoom={current?.src ? () => setLightboxOpen(true) : undefined}
      />

      <GalleryThumbs
        media={media}
        activeIndex={safeActive}
        onSelect={setActive}
      />

      <Lightbox
        media={media}
        index={safeActive}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setActive}
      />
    </div>
  );
}
