import Link from "next/link";
import { Container, Hairline } from "@/components/ui";
import {
  CONTACT,
  FOOTER_COLUMNS,
  LEGAL_LINKS,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/content/site";

/**
 * Premium industrial footer (server component, dark Carbon surface).
 * Contact, address, hours and GST are verified client-supplied data;
 * remaining bracketed values are placeholders (DS §31).
 */
export function SiteFooter() {
  return (
    <footer data-surface="dark" className="bg-ink text-paper">
      <Container className="py-16 lg:py-24">
        {/* Top band: wordmark + nav groups + contact */}
        <div className="grid grid-cols-4 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-x-8">
          {/* Company block */}
          <div className="col-span-4 flex flex-col gap-4 md:col-span-3">
            <p className="text-display-md font-display">{SITE_NAME}</p>
            <p className="text-body-sm text-mist max-w-measure">
              {/* PLACEHOLDER-CONTENT: company one-liner pending client copy */}
              [Company description — pending client input]
            </p>
            <address className="text-body-sm text-mist not-italic">
              {CONTACT.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="text-mono-micro text-mist">{CONTACT.gst}</p>
          </div>

          {/* Nav groups */}
          {FOOTER_COLUMNS.map((col) => (
            <nav
              key={col.heading}
              aria-label={`Footer — ${col.heading}`}
              className="col-span-2 md:col-span-2"
            >
              <p className="text-mono-meta text-mist">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-mist transition-colors duration-(--duration-fast) hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact block — verified data */}
          <div className="col-span-4 md:col-span-3">
            <p className="text-mono-meta text-mist">Contact</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-body-sm">
              {CONTACT.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="text-mist transition-colors duration-(--duration-fast) hover:text-paper"
                  >
                    {phone.value}
                  </a>
                </li>
              ))}
              {CONTACT.emails.map((email) => (
                <li key={email.href}>
                  <a
                    href={email.href}
                    className="text-mist transition-colors duration-(--duration-fast) hover:text-paper"
                  >
                    <span className="text-mono-micro">{email.label}</span>{" "}
                    {email.value}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-mono-meta text-mist">Hours</p>
            <p className="mt-2 text-body-sm text-mist">{CONTACT.hours}</p>
          </div>
        </div>

        <Hairline className="my-10" />

        {/* Bottom band: social + legal + copyright */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <ul className="flex items-center gap-6" aria-label="Social media">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  className="text-mono-meta text-mist transition-colors duration-(--duration-fast) hover:text-paper"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <ul className="flex items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-mono-micro text-mist transition-colors duration-(--duration-fast) hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-mono-micro text-mist">
              © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
