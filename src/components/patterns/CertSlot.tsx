import Image from "next/image";
import { FileText } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui";
import type { Certification } from "@/content/types";

interface CertSlotProps {
  certification: Certification;
  className?: string;
}

/**
 * Certification slot (DS §31.2).
 * Hairline panel. Until the client provides documents it renders the
 * explicit pending state — never a real standard's name, logo or
 * number. Once `status === "provided"` with a name (and optionally a
 * scanned document/PDF reference), it renders the neutral premium
 * treatment: mono name + document link.
 */
export function CertSlot({ certification, className }: CertSlotProps) {
  const pending = certification.status === "pending" || !certification.name;

  return (
    <div
      className={cn(
        "flex aspect-3/2 flex-col items-center justify-center gap-3 border border-edge bg-ink-soft p-6 text-center",
        className,
      )}
    >
      {pending ? (
        // PLACEHOLDER-CONTENT: certification slot awaiting client documents
        <p className="text-mono-micro text-mist">
          CERTIFICATION — UNDER VERIFICATION
        </p>
      ) : (
        <>
          {certification.document?.src ? (
            certification.document.kind === "img" ? (
              <span className="relative block h-16 w-full">
                <Image
                  src={certification.document.src}
                  alt={certification.document.alt || certification.name || ""}
                  fill
                  sizes="200px"
                  className="object-contain"
                />
              </span>
            ) : (
              <a
                href={certification.document.src}
                className="flex items-center gap-2 text-mist transition-colors duration-(--duration-fast) hover:text-paper"
              >
                <Icon icon={FileText} size={20} />
                <span className="text-mono-micro">VIEW DOCUMENT</span>
              </a>
            )
          ) : (
            <Icon icon={FileText} size={24} className="text-mist" />
          )}
          <p className="text-mono-meta text-paper">{certification.name}</p>
        </>
      )}
    </div>
  );
}
