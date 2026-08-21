import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter, SiteHeader, SkipLink } from "@/components/layout";
import "./globals.css";

/**
 * Typography system (DS §4–§5).
 * Display: Space Grotesk · Text: Inter · Mono: IBM Plex Mono.
 * Self-hosted via next/font/local (DS §4: self-hosted, display swap,
 * latin subset — zero FOIT, zero third-party font requests).
 * Font files: SIL Open Font License, sourced from Fontsource.
 * Exposed as CSS variables consumed by @theme inline in globals.css.
 */
const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});

const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const plexMono = localFont({
  src: [
    {
      path: "../fonts/ibm-plex-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sriyaanmetals.com"),
  title: {
    default: "SRIYAAN METALS",
    template: "%s — SRIYAAN METALS",
  },
  description:
    "SRIYAAN METALS — Mumbai-based metals trading, import and export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <SkipLink />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
