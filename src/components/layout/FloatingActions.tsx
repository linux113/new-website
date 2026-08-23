import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Icon } from "@/components/ui";
import { whatsappGeneralUrl } from "@/lib/whatsapp";

/**
 * Floating contact actions (DS §24.1 adjacent): WhatsApp +
 * Get a Quote, pinned bottom-right, safe-area padded. Server
 * component — plain links, zero JS. Subtle: compact, token-styled,
 * no animation (nothing to reduce for reduced-motion users).
 */
export function FloatingActions() {
  return (
    <div
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex flex-col items-end gap-2 print:hidden"
      role="complementary"
      aria-label="Quick contact"
    >
      <a
        href={whatsappGeneralUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex size-12 items-center justify-center rounded-full bg-ink text-paper shadow-float transition-colors duration-(--duration-base) hover:bg-ink-soft motion-reduce:transition-none"
      >
        <Icon icon={MessageCircle} size={20} />
      </a>
      <Link
        href="/enquiry"
        className="flex h-12 items-center rounded-xs bg-accent px-5 text-label text-paper-raised shadow-float transition-colors duration-(--duration-base) hover:bg-accent-hover motion-reduce:transition-none"
      >
        Get a Quote
      </Link>
    </div>
  );
}
