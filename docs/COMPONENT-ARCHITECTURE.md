# SRIYAAN METALS — Proposed Component Architecture

**Companion to:** `docs/DESIGN-SYSTEM.md` (`FORGE/01`, v1.0.0)
**Status:** Proposal — awaiting approval before implementation.
**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS. No database yet — all content flows from typed placeholder modules.

---

## 1. Principles

1. **Tokens → primitives → patterns → sections → pages.** Nothing skips a layer;
   sections never contain raw hex/px values, only tokens and primitives.
2. **Server-first.** Components are React Server Components by default; the
   `"use client"` boundary is pushed down to leaf interactivity (menus,
   carousels, counters, forms, reveal wrappers).
3. **Content out of components.** All copy, nav structure, and placeholder data
   live in `content/` as typed modules (design system §31). Swapping in real
   client content later must require zero component edits.
4. **One motion system.** All animation goes through the `motion/` primitives so
   `prefers-reduced-motion`, IntersectionObserver usage, and durations are
   enforced in exactly one place.
5. **Reusable over repeated.** If a UI fragment appears twice, it becomes a
   component; homepage sections are compositions, not bespoke markup.

---

## 2. Directory Layout

```
src/
├── app/
│   ├── layout.tsx                  # fonts (next/font), <SiteHeader>, <SiteFooter>, skip link
│   ├── page.tsx                    # homepage — composes sections (see §5)
│   ├── globals.css                 # design tokens (:root vars), @layer type-scale utilities
│   ├── error.tsx                   # 500 boundary (DS §29.5)
│   └── not-found.tsx               # 404 (DS §29.4)
│
├── components/
│   ├── ui/                         # PRIMITIVES — dumb, token-driven, no content
│   │   ├── Button.tsx              # primary | secondary | secondaryDark | ghost | icon; sm/md/lg; loading
│   │   ├── Badge.tsx               # outline | solid-ink | accent | status
│   │   ├── Card.tsx                # base surface + Card.Media / Card.Body slots
│   │   ├── RowItem.tsx             # ruled-list row: index + title + meta + arrow (DS §11 Card/Row)
│   │   ├── Container.tsx           # 1360px container, standard gutters
│   │   ├── Section.tsx             # py rhythm, hairline separation, light|dark|sunken surface, id
│   │   ├── SectionHeading.tsx      # eyebrow (mono code) + display-lg + optional lede, offset layout
│   │   ├── Eyebrow.tsx             # mono-meta label ("SM–04 / CAPABILITIES")
│   │   ├── IndexNumber.tsx         # mono "01"-style index glyphs
│   │   ├── Hairline.tsx            # semantic 1px rule (h/v)
│   │   ├── Icon.tsx                # Lucide wrapper: fixed 1.5px stroke, 16/20/24 sizes
│   │   ├── Input.tsx / Textarea.tsx / Select.tsx / FileDrop.tsx
│   │   ├── Field.tsx               # label + control + help/error wiring (aria-describedby)
│   │   ├── Skeleton.tsx            # geometry-matched shimmer blocks (DS §27)
│   │   ├── Spinner.tsx             # the single sanctioned spinner
│   │   ├── EmptyState.tsx          # DS §28 pattern
│   │   ├── Alert.tsx               # inline success/error panels (forms, async failures)
│   │   └── Toast.tsx               # bottom-left status toasts (role=status/alert)
│   │
│   ├── motion/                     # THE ONLY animation layer ("use client")
│   │   ├── Reveal.tsx              # scroll reveal: opacity+translateY, once, IO-based
│   │   ├── Stagger.tsx             # staggered children (60–80ms, max 6)
│   │   ├── Parallax.tsx            # image-only parallax (DS §21: quota, kill switches)
│   │   ├── CountUp.tsx             # number counters, tabular-nums, reduced-motion → static
│   │   └── useReducedMotion.ts     # shared hook; every motion component consumes it
│   │
│   ├── layout/
│   │   ├── SiteHeader.tsx          # composition of nav parts below
│   │   ├── Navbar.tsx              # transparent→scrolled morph, hide/reveal ("use client")
│   │   ├── MegaMenu.tsx            # full-width products panel, focus-trapped
│   │   ├── MobileNav.tsx           # full-screen Carbon sheet, staggered rows
│   │   ├── SiteFooter.tsx          # dark footer: nav columns, contact placeholders, legal, mono meta
│   │   ├── Breadcrumbs.tsx
│   │   └── SkipLink.tsx
│   │
│   ├── patterns/                   # REUSABLE COMPOSITES (used by ≥ 2 sections/pages)
│   │   ├── ProductCard.tsx         # DS §14 (+ ProductCard.Skeleton)
│   │   ├── ProductGrid.tsx         # responsive 2/3/4-up hairline grid
│   │   ├── CategoryTile.tsx        # media tile + mono index + title, editorial hover
│   │   ├── StatItem.tsx            # stat numeral (CountUp) + mono label, hairline-divided
│   │   ├── FeatureItem.tsx         # 24px stroke icon + heading + body (DS §11 Card/Feature)
│   │   ├── LogoSlot.tsx            # grey wordmark placeholder "[CLIENT LOGO]"
│   │   ├── TestimonialCard.tsx     # quote + role placeholders
│   │   ├── BlogCard.tsx            # 3:2 media + mono date + title + ghost link
│   │   ├── CertSlot.tsx            # certification placeholder panel (DS §31.2)
│   │   ├── IndustryRow.tsx         # ruled row for industries list
│   │   ├── SpecTable.tsx           # table ≥ md, stacked definition list < md
│   │   ├── MediaFigure.tsx         # graded image + mono caption ("FIG. 04 — …")
│   │   ├── WorldMap.tsx            # neutral map, zero highlights until data (DS §31.5)
│   │   ├── Carousel.tsx            # scroll-snap base w/ button controls (testimonials, mobile galleries)
│   │   └── gallery/
│   │       ├── ProductGallery.tsx  # sticky stage + thumbs (DS §15)
│   │       ├── GalleryStage.tsx / GalleryThumbs.tsx / Lightbox.tsx
│   │
│   ├── forms/
│   │   ├── QuoteForm.tsx           # RFQ form ("use client"; client-side validation only for now)
│   │   ├── ContactBlock.tsx        # contact placeholders + form shell
│   │   └── NewsletterInline.tsx    # fused input+button
│   │
│   └── sections/                   # HOMEPAGE SECTIONS — thin compositions (see §5)
│       └── home/…
│
├── content/
│   ├── placeholders.ts             # ALL placeholder copy/data — single sweep point (DS §31.7)
│   ├── site.ts                     # nav structure, footer links, meta, contact placeholders
│   └── types.ts                    # Product, Category, Metric, Industry, Post, Testimonial …
│
└── lib/
    ├── cn.ts                       # class merge helper
    └── format.ts                   # number/unit formatting (tabular data)
```

*(If the running project uses a non-`src` root or Pages Router, the same layers
apply — paths adjust during implementation.)*

---

## 3. Primitive API Sketches (contracts, not code)

```ts
<Button variant="primary|secondary|secondaryDark|ghost|icon"
        size="sm|md|lg" loading? icon? asChild? />

<Section surface="page|sunken|dark" bleed? id? aria-labelledby? />

<SectionHeading code="SM–04" eyebrow="CAPABILITIES"
                title="…" lede? align="offset|start" />

<Card interactive? surface="raised|darkRaised">
  <Card.Media ratio="4/3|3/2|16/9" /> <Card.Body /> </Card>

<Reveal as? delay? disabled?>…</Reveal>
<Stagger interval={70}>…</Stagger>
<Parallax range={0.08} ratio="16/9"><Image …/></Parallax>
<CountUp value={n} suffix="+" placeholder="[—]" />

<Field label required? optionalTag? help? error?><Input …/></Field>
```

All variants map 1:1 to design-system specs; no component accepts raw color or
spacing props.

---

## 4. Client/Server Boundary Map

| `"use client"` | Server (default) |
|---|---|
| Navbar (scroll state), MegaMenu, MobileNav | Layout, Footer, all `sections/home/*` shells |
| Reveal, Stagger, Parallax, CountUp | Container, Section, SectionHeading, Card, RowItem |
| Carousel, ProductGallery/Lightbox | ProductGrid, StatItem markup, BlogCard, SpecTable |
| QuoteForm, NewsletterInline, Toast | content modules, EmptyState, Badge, Hairline |

Rule of thumb: sections render on the server and *wrap* leaf client components;
no section is itself a client component.

---

## 5. Homepage Composition (`app/page.tsx`)

Sixteen sections, each a thin composition in `components/sections/home/`.
Surface rhythm (L = light Paper, S = sunken Zinc, D = dark Carbon) creates the
editorial pacing — never two D's adjacent (DS §9).

| # | Section component | Surface | Composes | Motion |
|---|---|---|---|---|
| 01 | `HeroSection` | D | full-bleed graded media, `display-xl`, mono coords line, Primary + Secondary(dark) CTAs | Parallax (1/3), no entrance delay on LCP |
| 02 | `MetricsBand` | L | 3–4 × `StatItem` in hairline-divided row — placeholder values `[—]` | `CountUp`, Stagger |
| 03 | `CategoriesSection` | L | `SectionHeading` + `CategoryTile` asymmetric grid (one tile full-bleed right) | Reveal, hover scale |
| 04 | `FeaturedProducts` | S | `SectionHeading` + `ProductGrid` (3-up) + ghost "View all" | Stagger |
| 05 | `WhyChooseUs` | L | offset heading cols 1–5; 4 × `FeatureItem` ruled 2×2 grid cols 6–12 | Reveal |
| 06 | `ManufacturingSection` | D | editorial split: `MediaFigure` (Parallax 2/3) + process `RowItem` list `01–04` | Reveal, row hovers |
| 07 | `QualitySection` | L | copy block + `CertSlot` hairline grid — *placeholder slots only* | Reveal |
| 08 | `IndustriesSection` | S | `IndustryRow` ruled list (preferred over card grid, DS §11) | Stagger rows |
| 09 | `GlobalReachSection` | D | `WorldMap` (zero highlights) + mono note `EXPORT MARKETS — TO BE CONFIRMED` | subtle bg drift (the one per-page instance) |
| 10 | `ImportExportSection` | D→L split | two-column: import / export capability copy, hairline-divided; placeholders | Reveal |
| 11 | `CustomersSection` | L | `LogoSlot` strip (greyed placeholder marks) | none — static |
| 12 | `TestimonialsSection` | S | `Carousel` of `TestimonialCard` (placeholder quotes) | crossfade only |
| 13 | `BlogSection` | L | 3 × `BlogCard` or `EmptyState` ("Insights are coming soon") | Reveal |
| 14 | `QuoteCtaSection` | D | `display-lg` statement + `QuoteForm` (compact) or Primary CTA → contact | Reveal |
| 15 | — | — | `SiteFooter` (in layout, not a section) | footer link hovers |

Navbar (`SiteHeader`) sits in `app/layout.tsx` above all pages.

Parallax quota check: Hero (1) + Manufacturing (2) = 2 of 3 used; reserve the
third for the product detail page later.

---

## 6. Content & Types (no DB yet)

```ts
// content/types.ts (excerpt)
type Placeholder<T> = { value: T | null; placeholder: string };

interface Metric   { id: string; label: string; value: Placeholder<number>; suffix?: string }
interface Category { slug: string; title: string; index: string; image: MediaRef | null }
interface Product  { slug: string; name: string; category: string; code: string;
                     specSummary: Placeholder<string>; media: MediaRef[] }
interface CertSlot { id: string; note: "PENDING CLIENT INPUT" }
```

- `content/placeholders.ts` exports typed arrays consumed by sections; every
  entry carries `// PLACEHOLDER-CONTENT` markers.
- When real data arrives: replace this module (or later, back it with a
  DB/CMS adapter behind the same types) — components untouched.

---

## 7. Implementation Order (proposed, next phase)

1. **Foundation:** `globals.css` tokens, Tailwind config mapping (DS §30),
   fonts via `next/font`, `Container`/`Section`/`Hairline`/type-scale utilities.
2. **Primitives:** Button, Badge, Card, RowItem, Eyebrow, SectionHeading, Icon,
   form primitives, Skeleton/Spinner/EmptyState/Alert.
3. **Motion layer:** useReducedMotion, Reveal, Stagger, CountUp, Parallax.
4. **Layout shell:** Navbar + MegaMenu + MobileNav, SiteFooter, SkipLink,
   error/not-found pages.
5. **Patterns:** ProductCard, ProductGrid, StatItem, FeatureItem, MediaFigure,
   CertSlot, LogoSlot, IndustryRow, TestimonialCard, BlogCard, Carousel.
6. **Homepage sections 01→14**, verifying against DS checkpoints (grid overlay,
   reduced-motion pass, axe ≥ 95, Lighthouse mobile ≥ 90) per section.
7. QuoteForm + validation states; product gallery deferred to product-page phase.

---

**STOP POINT.** Per brief: design system + component architecture only. No
homepage implementation has been started. Awaiting approval / client content
before Phase 1 build.
