import { MessageCircle } from "lucide-react";
import { Icon } from "@/components/ui";
import { whatsappGeneralUrl } from "@/lib/whatsapp";

/**
 * Floating WhatsApp action (bottom-right), safe-area padded.
 * Server component — plain link, zero JS.
 */
export function FloatingActions() {
  return (
    <div
      className="fixed right-5 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex flex-col items-end gap-2 print:hidden"
      role="complementary"
      aria-label="Quick contact"
    >
      <a
        href={whatsappGeneralUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex size-12 items-center justify-center rounded-full bg-ink text-paper shadow-float ring-1 ring-[#D8A84D]/30 transition-colors duration-200 hover:bg-ink-soft motion-reduce:transition-none"
      >
        <Icon icon={MessageCircle} size={20} />
      </a>
    </div>
  );
}
