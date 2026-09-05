import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Typography system–§5).
 * Display: Space Grotesk · Text: Inter · Mono: IBM Plex Mono.
 * Self-hosted via next/font/local: self-hosted, display swap,
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
    // The template appends "| SRIYAAN METALS", so the default must not
    // repeat the brand or every homepage title reads
    // "SRIYAAN METALS | … | SRIYAAN METALS" and Google truncates it.
    default: "Metal Supplier, Fasteners, Pipes & Fittings in Mumbai",
    template: "%s | SRIYAAN METALS",
  },
  description:
    "SRIYAAN METALS is a Mumbai-based metal trading, import and export company supplying industrial fasteners, bolts, nuts, pipes, pipe fittings, flanges and foundation bolts across India and global markets.",
  // Google Search Console ownership verification.
  //
  // The HTML-file method does not work here: Next.js only serves files
  // that were in public/ at build time, so uploading googleXXXX.html to
  // the server after a deploy 404s. Set GOOGLE_SITE_VERIFICATION to the
  // token from the "HTML tag" method instead (the content="…" value,
  // not the whole tag) and redeploy.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};


/**
 * Root layout: fonts + document shell only. The public site chrome
 * (header/footer/floating actions) lives in (public)/layout.tsx;
 * the admin shell lives in admin/(panel)/layout.tsx.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-theme="light"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>
        {/* Apply the saved theme (default: light) before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('sm-theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
