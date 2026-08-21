# SRIYAAN METALS — Design System

**Codename:** `FORGE/01`
**Version:** 1.0.0 · 2026-08-21
**Status:** Approved for implementation — single source of truth for all UI work.

> Every component, page, and animation in this project must trace back to a rule
> in this document. If a pattern is not defined here, define it here first, then
> build it. External resources (21st.dev, Origin UI, AnimMasterLib, Aura, Motion
> Sites, DesignPrompts) are *inspiration inputs only* — everything ships in
> SRIYAAN METALS' own visual language described below.

> **Content policy:** No invented statistics, certifications, customers, export
> countries, or business claims anywhere in the UI. All such content uses the
> placeholder conventions in §31 until the client supplies real data.

---

## Table of Contents

1. [Brand Personality](#1-brand-personality)
2. [Visual Style](#2-visual-style)
3. [Color System](#3-color-system)
4. [Typography System](#4-typography-system)
5. [Font Pairing](#5-font-pairing)
6. [Spacing Scale](#6-spacing-scale)
7. [Border Radius System](#7-border-radius-system)
8. [Shadows](#8-shadows)
9. [Surface Styles](#9-surface-styles)
10. [Buttons](#10-buttons)
11. [Cards](#11-cards)
12. [Navigation](#12-navigation)
13. [Forms](#13-forms)
14. [Product Cards](#14-product-cards)
15. [Product Gallery](#15-product-gallery)
16. [Badges](#16-badges)
17. [Typography Hierarchy](#17-typography-hierarchy)
18. [Grid System](#18-grid-system)
19. [Responsive Breakpoints](#19-responsive-breakpoints)
20. [Motion Principles](#20-motion-principles)
21. [Parallax Rules](#21-parallax-rules)
22. [Hover Interactions](#22-hover-interactions)
23. [Accessibility Rules](#23-accessibility-rules)
24. [Mobile UX Rules](#24-mobile-ux-rules)
25. [Image Treatment](#25-image-treatment)
26. [Iconography](#26-iconography)
27. [Loading States](#27-loading-states)
28. [Empty States](#28-empty-states)
29. [Error States](#29-error-states)
30. [Design Tokens (Tailwind mapping)](#30-design-tokens-tailwind-mapping)
31. [Placeholder & Content Conventions](#31-placeholder--content-conventions)

---

## 1. Brand Personality

**One line:** *Precision-engineered metal, presented with editorial calm.*

SRIYAAN METALS should read like an international industrial house — closer to a
Swiss/German engineering brand or a global materials group than a conventional
regional trading website.

### Personality attributes

| Attribute | Expressed as | Never as |
|---|---|---|
| **Premium** | Generous whitespace, restrained palette, large photography | Gold gradients, glow effects, ornamental flourishes |
| **Industrial** | Steel tones, hairline rules, machined edges, texture of real material | Cartoon factory clip-art, stocky "construction" tropes |
| **Technical** | Mono-spaced data labels, spec tables, index numbers (01/02/03), fine grid lines | Fake dashboards, meaningless charts |
| **Precise** | Strict alignment to grid, consistent 1px rules, exact spacing steps | "Roughly aligned" layouts, arbitrary padding |
| **Reliable** | Calm motion, stable layouts (no CLS), consistent components | Attention-seeking animation, layout jumps |
| **International** | Neutral editorial tone, metric-first units, global typography | Locale-specific visual clichés |
| **Modern** | Contemporary grotesque type, asymmetric editorial grids | Skeuomorphism, dated bevels |
| **Trustworthy** | Verifiable-feeling detail (labels, codes, captions), honest placeholders | Invented numbers, unearned superlatives |

### Voice & tone (for UI copy)

- Declarative, short sentences. "Precision alloy supply." not "We are proud to offer…"
- Sentence case for body and UI copy; UPPERCASE reserved for small technical labels (eyebrows, badges, table headers).
- Numbers and units set precisely: `1,250 MT`, `±0.05 mm`, `EN 10204` — but only when supplied by the client (§31).

---

## 2. Visual Style

**Direction:** *Industrial Luxury × Precision Engineering.*

### The five signature moves

These recur across the whole site and make it recognizably SRIYAAN — this is what
prevents the "generic Tailwind site" look:

1. **The Hairline System.** 1px rules (`--color-line`) structure layouts the way
   machined seams structure a housing: full-bleed horizontal rules between page
   sections, vertical rules between grid columns on desktop, ruled table-style
   lists instead of floating card grids wherever content is enumerable.
2. **Index Numbering.** Sections and list items carry small mono-set index codes
   (`01`, `02`, `/ 03`) and section codes (`SM–04`), like engineering drawings.
3. **Editorial Asymmetry.** Content blocks sit on a 12-column grid with
   deliberate offsets (e.g. heading in cols 1–5, body in cols 7–12). Never
   center-stack every section.
4. **Material Photography.** Large, duotone-graded imagery of metal surfaces,
   coils, sections, and machining — treated as *material*, not decoration (§25).
5. **Mono Meta-layer.** A secondary information layer set in the mono font:
   eyebrows, captions, coordinates, spec labels, footer meta. It carries the
   "technical" personality while the display type carries the "premium" one.

### What we deliberately avoid

- Gradient-heavy hero backgrounds; max one *subtle* tonal gradient per page.
- Glassmorphism/backdrop-blur cards (allowed only on the scrolled navbar, §12).
- Rounded cards everywhere — default surfaces are square-cornered (§7).
- Huge glowing/pill CTAs, emoji in UI, generic SaaS three-column feature grids
  with icon-in-tinted-circle.
- Center-aligned everything; drop-shadow soup.

---

## 3. Color System

Philosophy: **a near-monochrome steel palette with one disciplined accent.**
Color is used to *organize*, not to decorate. Roughly 90% neutral, 8% ink/steel,
2% accent per viewport.

### 3.1 Core palette

| Token | Hex | Name | Role |
|---|---|---|---|
| `--color-ink` | `#0B0F14` | Carbon | Primary text, dark sections, footer background |
| `--color-ink-soft` | `#161C24` | Graphite | Raised dark surfaces, dark cards |
| `--color-steel` | `#2E3A47` | Steel Blue-Grey | Secondary headings on light, dark UI borders-on-light |
| `--color-slate` | `#5B6B7B` | Slate | Body text secondary, muted copy |
| `--color-mist` | `#9AA7B4` | Mist | Placeholder text, disabled labels, captions on dark |
| `--color-line` | `#DCE1E7` | Hairline | 1px rules, dividers, table borders (light mode) |
| `--color-line-dark` | `#232B35` | Hairline Dark | 1px rules on dark surfaces |
| `--color-paper` | `#F5F6F7` | Paper | Page background (not pure white — machined, matte) |
| `--color-paper-raised` | `#FFFFFF` | White | Cards/surfaces raised above Paper |
| `--color-paper-sunken` | `#EDEFF1` | Zinc Wash | Sunken wells, alternate section bands, input backgrounds |

### 3.2 Accent

| Token | Hex | Name | Role |
|---|---|---|---|
| `--color-accent` | `#C8461B` | Furnace Orange | Primary CTA, active states, index numbers, key underlines |
| `--color-accent-hover` | `#A93A15` | Furnace Deep | Hover/pressed accent |
| `--color-accent-tint` | `#FBEDE7` | Furnace Tint | Accent wash backgrounds (badges, focus tints) — use sparingly |

Furnace Orange is molten-metal derived: warm, industrial, unmistakably not the
default Tailwind orange/blue. **Rules:** never use accent for large area fills
(> a button/badge); never place body text in accent; max ~2 accent elements
visible per viewport.

### 3.3 Functional colors

| Token | Hex | Role |
|---|---|---|
| `--color-success` | `#1E7F4F` | Success text/icon; tint bg `#E7F3EC` |
| `--color-warning` | `#9A6B00` | Warning text/icon; tint bg `#FBF3E0` |
| `--color-error` | `#B3261E` | Error text/icon/borders; tint bg `#FBEAE9` |
| `--color-info` | `#22577A` | Informational; tint bg `#E8F0F5` |

Functional colors appear only in feedback UI (forms, alerts, toasts) — never as
decoration.

### 3.4 Dark sections

The site is light-first, but key sections (hero, manufacturing, global reach,
quote CTA, footer) run on Carbon/Graphite to create rhythm. On dark:

- Text: `#F5F6F7` (primary), `--color-mist` (secondary)
- Rules: `--color-line-dark`
- Accent unchanged (`#C8461B` passes contrast on Carbon for large text/graphics;
  for small text on dark use `#E0592B`, token `--color-accent-on-dark`).

### 3.5 Contrast requirements

All text pairs must meet WCAG 2.2 AA (§23). Pre-validated pairs:

- Carbon on Paper: 17.2:1 ✓ · Slate on Paper: 5.4:1 ✓ · Mist on Paper: **large/labels ≥18.66px only**
- Paper on Carbon: 16.9:1 ✓ · Mist on Carbon: 7.4:1 ✓
- White on Furnace Orange: 4.9:1 ✓ (buttons OK)

---

## 4. Typography System

Three-role system. Every text node on the site belongs to exactly one role.

| Role | Face | Usage |
|---|---|---|
| **Display** | *Space Grotesk* (variable) | H1–H3, hero statements, big numerals, pull quotes |
| **Text** | *Inter* (variable) | Body copy, UI labels, forms, navigation, H4–H6 |
| **Mono** | *IBM Plex Mono* | Eyebrows, index numbers, spec labels, captions, table meta, badges |

### Global rules

- Loaded via `next/font` with `display: swap`, subset `latin`, self-hosted. No FOIT.
- Body text: Inter 400/450, `16px/1.6` mobile, `17px/1.65` ≥ `lg`. Max measure: `65ch`.
- Display headings: Space Grotesk 500–600, tight tracking (`-0.02em` to `-0.03em`), line-height 0.95–1.1. Never bold-900.
- Mono meta: 11–13px, `letter-spacing: 0.08em`, UPPERCASE, color Slate (light) / Mist (dark).
- Numerals in data contexts: `font-variant-numeric: tabular-nums`.
- No more than 2 weights per face in the shipped bundle (variable fonts make this free, but *use* only defined weights).

Full scale in §17.

---

## 5. Font Pairing

**Space Grotesk + Inter + IBM Plex Mono** — chosen as a system, not a mood board:

- **Space Grotesk (Display):** a grotesque with machined, slightly angular
  terminals — technical character without novelty. Its quirky details read
  "engineered", distinguishing us from the ubiquitous Inter-for-everything look.
- **Inter (Text):** invisible, international, exceptional legibility at UI
  sizes; harmonizes with Space Grotesk's proportions (both closed-aperture
  grotesques) so the pairing feels like one family with two voices.
- **IBM Plex Mono (Mono):** engineering-document DNA; warmer than JetBrains
  Mono, more serious than Space Mono. Carries the entire "meta layer" (§2).

Fallback stacks:

```css
--font-display: "Space Grotesk", "Inter", system-ui, sans-serif;
--font-text:    "Inter", system-ui, -apple-system, sans-serif;
--font-mono:    "IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace;
```

Pairing rules: never set body paragraphs in Space Grotesk; never set headings in
Plex Mono (labels only); never mix roles inside one line except an inline mono
index (`01 — Alloy Structures`).

---

## 6. Spacing Scale

Base unit **4px**, with a curated set (not every multiple) to force rhythm:

| Token | px | Use |
|---|---|---|
| `space-1` | 4 | Icon gaps, badge padding-y |
| `space-2` | 8 | Tight label gaps, badge padding-x |
| `space-3` | 12 | Input padding-y, small stacks |
| `space-4` | 16 | Default component padding, body paragraph gap |
| `space-6` | 24 | Card padding (mobile), grid gutter (mobile) |
| `space-8` | 32 | Card padding (desktop), gutter (desktop), sub-section gap |
| `space-12` | 48 | Block separation within a section |
| `space-16` | 64 | Heading → content gap in large sections |
| `space-24` | 96 | Section padding-y (mobile) |
| `space-32` | 128 | Section padding-y (desktop) |
| `space-40` | 160 | Hero / marquee section padding-y (desktop only) |

Rules:

- **Section rhythm:** every homepage section uses `py-24` mobile / `py-32`
  desktop (`space-24/32`), separated by a full-bleed hairline — no arbitrary
  per-section padding.
- Whitespace is a premium signal: when unsure, take the next step **up**.
- Never introduce values off this scale except optical 1–2px adjustments in
  component internals.

---

## 7. Border Radius System

Machined, near-square. Softness comes from spacing and type, not corner radii.

| Token | Value | Use |
|---|---|---|
| `radius-none` | 0 | **Default.** Sections, cards, images, tables, surfaces |
| `radius-xs` | 2px | Inputs, buttons, badges, small controls |
| `radius-sm` | 4px | Dropdown/popover panels, toasts |
| `radius-full` | 9999px | Only: avatar images, carousel dots, toggle knobs |

Forbidden: `rounded-lg`+ on cards or images; mixed radii within one component;
pill buttons.

---

## 8. Shadows

Shadows are near-invisible structure, not decoration. Elevation is primarily
communicated by **hairlines and background steps** (§9); shadows only assist.

| Token | Value | Use |
|---|---|---|
| `shadow-hairline` | `0 0 0 1px var(--color-line)` | Border-as-shadow for flush surfaces |
| `shadow-raise` | `0 1px 2px rgb(11 15 20 / 0.06), 0 4px 12px rgb(11 15 20 / 0.06)` | Hover elevation on interactive cards |
| `shadow-float` | `0 4px 8px rgb(11 15 20 / 0.08), 0 12px 32px rgb(11 15 20 / 0.10)` | Dropdowns, popovers, mobile sheet |
| `shadow-modal` | `0 8px 16px rgb(11 15 20 / 0.10), 0 24px 64px rgb(11 15 20 / 0.16)` | Dialogs, lightbox |

Rules: no colored shadows, no glow, no inner shadows except `inset 0 0 0 1px`
borders. Resting cards have **no** drop shadow — only hairline. `shadow-raise`
appears on hover/focus and animates in 200ms.

---

## 9. Surface Styles

| Surface | Background | Border | Use |
|---|---|---|---|
| `surface-page` | Paper | — | Default page canvas |
| `surface-raised` | White | hairline | Cards, panels on Paper |
| `surface-sunken` | Zinc Wash | none or hairline | Alternating section bands, wells, input bg |
| `surface-dark` | Carbon | — | Dark full-bleed sections |
| `surface-dark-raised` | Graphite | hairline-dark | Cards inside dark sections |
| `surface-media` | Carbon under image | — | Any image container (prevents white flash while loading) |

Rules:

- Adjacent sections must differ by *either* background step *or* a full-bleed
  hairline — never both stacked, never neither.
- Glass/backdrop-blur: **only** the scrolled navbar (§12). Nowhere else.
- Dark sections should account for roughly 30–40% of the homepage for rhythm;
  never two dark sections adjacent.

---

## 10. Buttons

All buttons: `radius-xs`, Inter 500, `13px/1` UPPERCASE `tracking-[0.08em]`
label, height 44px (`md`, default) / 52px (`lg`, hero & CTA band) / 36px (`sm`,
table rows), horizontal padding 24px (md), icon gap 8px. Focus: 2px accent
outline, 2px offset (§23).

| Variant | Resting | Hover | Use |
|---|---|---|---|
| **Primary** | Furnace Orange bg, white text | Furnace Deep bg; arrow icon translates 4px right | One per section max. "Request a Quote" class of actions |
| **Secondary (light)** | transparent bg, 1px Carbon border, Carbon text | Carbon bg, Paper text (inverts) | Section-level secondary actions |
| **Secondary (dark)** | transparent, 1px Paper border, Paper text | Paper bg, Carbon text | Same, on dark surfaces |
| **Ghost** | no border, Carbon text + 8px mono `→` | text→accent, arrow translates | Inline "View all", card-level links |
| **Icon** | 44×44, hairline border | bg Zinc Wash | Carousel arrows, gallery controls |

States: `disabled` = 40% opacity + `cursor-not-allowed`; `loading` = label swaps
to inline spinner (§27), width preserved to avoid CLS.

Forbidden: pill radius, gradient fills, glow shadows, more than one Primary per
viewport region.

---

## 11. Cards

Base card recipe (`<Card>`):

- Surface: `surface-raised` (or `dark-raised`), `radius-none`, hairline border.
- Padding: `space-6` mobile / `space-8` desktop.
- Anatomy (top→bottom): optional mono index (`01`), optional media, Display
  heading (h3 size), Slate body (max 3 lines in grids), ghost link.
- Interactive cards: entire card is the link (stretched-link pattern), hover =
  `shadow-raise` + border-color→Steel + internal image scale 1.04 (§22).

Variants:

| Variant | Difference |
|---|---|
| `Card/Media` | Image top, 3:2, flush to card edges (no inner padding around image) |
| `Card/Stat` | Big Display numeral (§17 `stat`) + mono label underneath; no border on left-most, hairline-separated columns |
| `Card/Row` | Horizontal, used in ruled lists: index + title + meta + arrow, hairline between rows — the preferred "list of things" pattern over card grids |
| `Card/Feature` | Icon (24px, stroke) top-left, not in a tinted circle |

Rule: prefer **ruled rows and tables** over card grids when content is uniform
and enumerable (industries, categories index, blog list). Card grids max 3
columns.

---

## 12. Navigation

### Navbar

- **Structure:** left — wordmark (Space Grotesk 600, `SRIYAAN METALS`, optional
  mono suffix `®`/`EST. [YEAR — placeholder]`); center — primary links (Inter
  500, 14px); right — `Request a Quote` (Primary sm) + language placeholder.
- **Top-of-page state:** transparent over hero, Paper/Carbon-aware text, 1px
  bottom hairline at 40% opacity, height 80px.
- **Scrolled state:** height 64px, background `rgb(245 246 247 / 0.85)` +
  `backdrop-blur(12px)` (the single sanctioned glass use), full hairline.
  Transition 250ms.
- **Hide/reveal:** hides on scroll-down after 400px, reveals on scroll-up
  (translate, 300ms, disabled under reduced-motion).
- **Active link:** 2px accent underline offset 6px; hover: underline in Carbon.
- **Products dropdown:** full-width panel (mega-menu), `surface-raised` +
  `shadow-float`, categories as `Card/Row` list with mono indices; opens 150ms
  fade+4px rise; closes on `Esc`, focus-trapped for keyboard.

### Mobile

Hamburger (44×44) → full-screen Carbon sheet: links as oversized Display rows
(28px) with mono indices, staggered entrance 30ms/item, CTA pinned at bottom.
Body scroll locked, focus trapped.

### Secondary nav

- Breadcrumbs: mono 12px, `/`-separated, Slate; current page Carbon.
- Footer nav: 4 columns of Inter 14px links over Carbon (§ footer spec lives
  with component architecture).

---

## 13. Forms

Used for: quote request (RFQ), contact, newsletter.

- **Inputs:** `surface-sunken` bg, 1px hairline border, `radius-xs`, height
  48px, Inter 16px (prevents iOS zoom), padding 12/16px. No floating labels.
- **Labels:** above input, mono 12px UPPERCASE Slate, `space-2` gap. Required
  mark: accent `*`. Optional fields marked `(OPTIONAL)` — prefer marking
  optional over required.
- **Focus:** border→Carbon + `box-shadow: 0 0 0 1px` Carbon (2px total); error
  fields border→error + error text below (13px, icon + message).
- **Help text:** 13px Slate below input.
- **Validation:** on blur, re-validate on change after first error; errors never
  by color alone (icon + text). Submit disabled only *during* submission, not
  before (let users hit submit and see errors).
- **Selects / uploads:** native select styled to input recipe (custom chevron);
  file upload as dashed-hairline drop zone, mono label `ATTACH DRAWING / SPEC
  (PDF, DWG, XLSX — MAX 10 MB)`.
- **RFQ form specifics:** two-column ≥ `md` (Company / Contact | Requirement),
  one column mobile; textarea min 120px; success state = inline confirmation
  panel (§29 pattern, success variant) — no redirect.
- **Newsletter:** single-line combo — input + Secondary button fused (button
  borders share the input hairline).

---

## 14. Product Cards

The core commercial unit. Recipe (`<ProductCard>`):

```
┌───────────────────────────┐
│  media 4:3, Zinc Wash bg  │ ← product photo on neutral bg, scale 1.04 on hover
│  [badge top-left]         │ ← optional, one max (§16)
├───────────────────────────┤
│  MONO: CATEGORY · [CODE]  │ ← 11px mono, Slate  e.g. "SHEETS · SM-[XXX]"
│  Product Name             │ ← Space Grotesk 500, 18px, Carbon, 2-line clamp
│  Key spec placeholder     │ ← Inter 14px Slate, 1 line ("[Grade / size range]")
│  ─────────────────────    │ ← hairline
│  Enquire →      [specs ↗] │ ← ghost link + optional secondary
└───────────────────────────┘
```

Rules:

- Image: consistent object treatment (§25) so mixed client photography looks
  uniform; never crop product out of frame.
- **No prices** (B2B — enquiry-driven). The primary action is *Enquire*.
- Grid: 2-up mobile-landscape/`sm`, 3-up `lg`, 4-up only on index pages ≥ `xl`.
  Gutters `space-6/8`; rows separated by hairlines in list view.
- Hover: card border→Steel, `shadow-raise`, image scale, ghost arrow translates.
  Whole card clickable; inner links stop propagation.
- Skeleton variant defined in §27.

---

## 15. Product Gallery

Product detail media pattern:

- **Layout ≥ `lg`:** left column (7/12) sticky gallery; right column (5/12)
  scrolling spec/enquiry panel. Mobile: gallery as edge-to-edge swipe carousel
  with `scroll-snap-x mandatory`, 4:3.
- **Main stage:** 4:3, `surface-media`, `radius-none`; supports zoom-on-click →
  full-screen lightbox (Carbon 95% backdrop, `shadow-modal` image, mono caption
  + `[n / total]` counter, `Esc`/backdrop close, arrows + swipe).
- **Thumbnails:** 5-up strip under stage, 1:1, hairline border; active thumb =
  2px accent inset border; keyboard: arrow keys move, `Enter` selects.
- **Transitions:** stage image crossfade 250ms (no slide/zoom churn); reduced
  motion: instant swap.
- **Media types:** photo, technical drawing (rendered on White, not Zinc), video
  (poster + native controls in lightbox). Mono type tag on thumbs: `IMG` /
  `DWG` / `VID`.
- All images `next/image`, sized, `priority` only for first stage image.

---

## 16. Badges

Mono 11px UPPERCASE, `tracking 0.08em`, `radius-xs`, padding `4px 8px`, 1px
border, no shadow, no icon unless functional.

| Variant | Style | Use |
|---|---|---|
| `outline` | hairline border, Slate text, transparent bg | Default meta tags: `[CATEGORY]`, `[MATERIAL — TBD]` |
| `solid-ink` | Carbon bg, Paper text | Emphasis tags on light media: `NEW` (only when true) |
| `accent` | Accent-tint bg, Furnace Deep text, accent 1px border at 30% | Sparingly: featured/priority markers |
| `status` | Functional tint bg + functional text (§3.3) | Stock/availability *placeholders only* until real data |

Rules: max **one** badge per product card media area; badges are never
interactive (use ghost links instead); never fabricate certification badges —
certification area uses explicit placeholders (§31).

---

## 17. Typography Hierarchy

Fluid scale via `clamp()`; rem-based; steps named, not sized, in code.

| Token | Face/Weight | Size (min → max) | LH | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | Grotesk 600 | 40px → 76px | 0.98 | -0.03em | Hero H1 only |
| `display-lg` | Grotesk 600 | 32px → 52px | 1.05 | -0.02em | Section H2 |
| `display-md` | Grotesk 500 | 24px → 32px | 1.15 | -0.02em | Sub-section H3, card group titles |
| `heading-sm` | Inter 600 | 18px → 20px | 1.3 | -0.01em | H4, card titles |
| `stat` | Grotesk 500 | 40px → 64px | 1 | -0.02em | Metric numerals, tabular-nums |
| `body-lg` | Inter 450 | 18px → 20px | 1.6 | 0 | Section intros, lede paragraphs |
| `body` | Inter 400 | 16px → 17px | 1.6 | 0 | Default copy |
| `body-sm` | Inter 400 | 14px | 1.55 | 0 | Card body, captions-with-sentences |
| `label` | Inter 500 | 13px | 1 | 0.08em, UPPER | Buttons, nav, form-adjacent UI |
| `mono-meta` | Plex Mono 400 | 12px | 1.4 | 0.08em, UPPER | Eyebrows, indices, captions, table meta |
| `mono-micro` | Plex Mono 400 | 11px | 1.3 | 0.06em, UPPER | Badges, image credits, footnotes |

Section heading pattern (mandatory, keeps the site coherent):

```
MONO-META eyebrow        →  "SM–04 / CAPABILITIES"
display-lg heading       →  "Engineered for exacting tolerances"
body-lg intro (optional) →  max 65ch, cols 7–12 on desktop
```

One `display-xl` per page. Heading levels never skip (h1→h2→h3).

---

## 18. Grid System

- **Container:** max-width 1360px, padding-inline 20px (mobile) / 32px (`md`) /
  48px (`xl`). One container component — no ad-hoc max-widths.
- **Columns:** 12-col CSS grid ≥ `md`; 4-col on mobile. Gutter `space-6` mobile
  / `space-8` desktop.
- **Editorial offsets (signature):** standard section split = heading block cols
  1–5, content cols 6–12 or 7–12; media features may bleed to the viewport edge
  on one side (`full-bleed-right` utility) while text stays in the container.
- **Hairline grid:** enumerable content uses bordered grids — items share
  hairline borders (`divide-x divide-y`) rather than gapped floating cards.
- **Vertical rhythm:** 8px baseline; all component heights on 4px multiples.
- Optional dev aid: grid overlay toggle (`?grid=1`) rendering 12 columns at 4%
  opacity — precision is a brand value, verify it.

---

## 19. Responsive Breakpoints

Tailwind defaults, mobile-first, with usage contracts:

| BP | Min | Contract |
|---|---|---|
| (base) | 0 | 1-col stacks, 4-col grid, edge-to-edge media, 20px gutters |
| `sm` | 640px | 2-up product grids, inline form pairs |
| `md` | 768px | 12-col grid activates, editorial offsets begin, nav still mobile |
| `lg` | 1024px | Desktop navbar + mega-menu, 3-up grids, sticky gallery |
| `xl` | 1280px | 4-up index grids, full type scale ceiling approaches |
| `2xl` | 1536px | Container caps at 1360px; whitespace grows, content doesn't |

Rules: design mobile-first, verify at 360px, 768px, 1024px, 1440px, 1920px.
No horizontal scroll at any width ≥ 320px. Test mega-menu and tables at `md`
(the awkward zone) explicitly.

---

## 20. Motion Principles

**Philosophy: machinery, not theatre.** Motion confirms structure and state; it
never performs. If an animation would be noticed *as an animation*, cut it.

### Tokens

| Token | Value | Use |
|---|---|---|
| `duration-fast` | 150ms | Color/opacity state changes |
| `duration-base` | 250ms | Hover elevation, underlines, crossfades |
| `duration-slow` | 500ms | Scroll reveals, section entrances |
| `duration-counter` | 1200ms | Number counters (once) |
| `ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Default — entrances, reveals |
| `ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | Crossfades, nav transitions |

### Allowed (the full sanctioned list)

1. **Scroll reveal:** opacity 0→1 + translateY 16px→0, `duration-slow`,
   triggered at 20% element visibility, once per page load. Applied to section
   blocks, *not* individual paragraphs.
2. **Staggered entrance:** children of a revealed group offset by 60–80ms, max
   6 staggered items (beyond 6, reveal as one).
3. **Image parallax:** §21.
4. **Hover elevation / image scale:** §22.
5. **Number counters:** count-up on first visibility, `duration-counter`,
   ease-out, tabular-nums (no layout shift). Placeholder metrics animate too —
   pattern must be real even before data is.
6. **Subtle background movement:** one instance max per page — e.g. hero
   blueprint-grid drifting ≤ 8px over 20s, opacity ≤ 6%.
7. **Smooth navigation transitions:** navbar state morph (§12), mobile sheet
   slide, anchor scroll with `scroll-behavior: smooth`.

### Forbidden

Bounce/spring overshoot beyond 1.02; blur-in reveals; rotating/3D flip cards;
parallax on text; marquee text; scroll-jacking; animating `width/height/top`
(compositor-unfriendly); any entrance animation on content above the fold that
delays LCP; animation on more than ~30% of elements in a viewport.

### Performance & reduced motion

- Animate only `transform` and `opacity`. `will-change` applied just-in-time,
  removed after.
- **Every** animation is wrapped in the project's `useReducedMotion`-aware
  primitives: under `prefers-reduced-motion: reduce`, reveals render final state
  instantly, parallax is off, counters render final number, nav transitions
  become opacity-only.
- IntersectionObserver for all scroll triggers — no scroll-event listeners.
- Motion must never cause CLS; reveal wrappers reserve final layout.
- LCP element (hero image/heading) is never opacity-0 on first paint.

---

## 21. Parallax Rules

Parallax is a *material* effect here — images shift like heavy plates, slightly.

1. **Images only.** Never text, buttons, cards, or backgrounds with content.
2. **Depth budget:** translateY range ≤ 8% of image height (≈ 30–60px). One
   speed, no multi-layer scenes.
3. **Implementation:** image rendered 115% height inside `overflow-hidden`
   container, translated via `transform` from IntersectionObserver +
   `requestAnimationFrame` (or CSS `animation-timeline: scroll()` where
   supported, with JS fallback). No scroll-event math on main thread.
4. **Quota:** max 3 parallax containers per page (intended: hero media,
   manufacturing section media, global-reach backdrop).
5. **Kill switches:** disabled under `prefers-reduced-motion`, on touch devices
   `< lg` (scroll perf), and for `save-data`.
6. Parallax containers must have fixed aspect ratios — zero CLS.

---

## 22. Hover Interactions

Hover is confirmation, not spectacle. All hover effects `duration-base`,
`ease-out-quart`, and every hover state has a keyboard `:focus-visible`
equivalent.

| Element | Hover behavior |
|---|---|
| Interactive card | Border Carbon→Steel, `shadow-raise`, translateY(-2px) max |
| Card media / gallery thumb | Image `scale(1.04)` inside clipped frame; never scale the card itself |
| Primary button | Bg→Furnace Deep; trailing arrow `translateX(4px)` |
| Secondary button | Full invert (transparent→solid) |
| Ghost link | Text→accent, arrow `translateX(4px)`, underline draws left→right 250ms |
| Nav link | 2px underline draws in; active stays accent |
| Row (`Card/Row`) | Bg→Zinc Wash, index number→accent, arrow slides in |
| Table row | Bg→Zinc Wash only |
| Image link (editorial) | Duotone overlay lightens 8%; mono caption slides up 4px |
| Footer link | Mist→Paper |

Rules: one property family per element class (don't combine scale + rotate +
shadow + color); touch devices get `:active` compression (`scale(0.99)`) instead
of hover; no cursor-following effects, no magnetic buttons.

---

## 23. Accessibility Rules

Target: **WCAG 2.2 AA.** Non-negotiable; premium includes everyone.

1. **Contrast:** text ≥ 4.5:1 (≥ 3:1 for ≥ 24px/18.66px-bold); UI borders &
   focus indicators ≥ 3:1. Palette pairs pre-validated in §3.5 — new pairs must
   be checked before use.
2. **Keyboard:** every interactive element reachable and operable; visible
   `:focus-visible` (2px accent outline, 2px offset — on dark: Paper outline);
   skip-to-content link first in DOM; mega-menu and mobile sheet focus-trapped
   with `Esc` close; carousels operable via buttons, not just swipe.
3. **Semantics:** landmarks (`header/nav/main/footer`), one `h1`, ordered
   heading levels, `nav` with `aria-label`s, buttons vs links used correctly
   (links navigate, buttons act).
4. **Images:** meaningful `alt` (product name + view, e.g. "placeholder: coil
   stock, front view"); decorative images `alt=""`; no text baked into images.
5. **Motion:** full `prefers-reduced-motion` compliance (§20); no autoplaying
   video with sound; no flashing > 3/s.
6. **Forms:** programmatic label association, `aria-describedby` for errors,
   `aria-invalid`, error summary focus management on submit.
7. **Touch targets:** ≥ 44×44px with ≥ 8px separation (nav icons, thumbs,
   carousel controls included).
8. **Language/meta:** `lang="en"`, page titles per route, `aria-live="polite"`
   for async feedback (form success, counters excluded).
9. Tap/hover-revealed content also available on focus and dismissible.
10. CI habit: axe/Lighthouse a11y pass ≥ 95 before any page ships.

---

## 24. Mobile UX Rules

Mobile is a first-class B2B context (buyers browse on phones, enquire on
desktops — both must be complete).

1. **Thumb-first:** primary actions in bottom half where possible; sticky
   bottom-edge `Request a Quote` bar appears after hero on product pages
   (height 56px, Carbon bg, safe-area padded) — one per page, dismissible.
2. **Type floor:** body never < 16px; mono meta may be 11px but never conveys
   sole meaning.
3. **Media:** full-bleed images; carousels use native scroll-snap with visible
   partial next slide (peek ~12%) so swipeability is self-evident; no custom JS
   momentum.
4. **Nav:** §12 mobile sheet; tel/mail links native (`tel:`, `mailto:` with
   placeholder values until supplied).
5. **Tables (specs):** ≥ `md` render as tables; `< md` transform to stacked
   definition lists (mono label + value rows) — never horizontal-scroll a spec
   table unless it's genuinely matrix data, then with a visible edge fade +
   `tabindex=0` scroll region.
6. **Performance floor:** mobile Lighthouse ≥ 90 perf; hero image ≤ 180KB
   (AVIF/WebP), fonts subset, zero third-party scripts without a reason.
7. Forms: correct `inputmode`/`autocomplete`; input font-size ≥ 16px (no iOS
   zoom); labels never placeholder-only.
8. No hover-dependent functionality; all §22 hovers have tap/active parity.
9. Respect safe areas (`env(safe-area-inset-*)`) on sticky bars and the mobile
   sheet.

---

## 25. Image Treatment

Photography is the brand's material evidence. Treatment makes disparate source
photos (client-supplied, varied quality) read as one system.

1. **Grade — "Steel Duotone":** editorial/environment imagery gets a unified
   treatment via CSS: `filter: saturate(0.72) contrast(1.06) brightness(0.98)`
   + a Carbon overlay `rgb(11 15 20 / 0.28)` where text sits on top (hero,
   section backdrops). Implemented as `image-graded` utility; product photos on
   Zinc Wash are **not** graded (accuracy > mood for product truth).
2. **Aspect ratios (fixed, enforced):** hero 16:9 (mobile 4:5), editorial 3:2,
   product 4:3, thumbnails 1:1, people/avatars 1:1. Every image container
   declares aspect ratio — zero CLS.
3. **Text on image:** only over graded images with overlay; contrast rules
   still apply; text confined to lower/left third; never center text on busy
   imagery.
4. **Captions:** mono-micro, below or overlaid bottom-left, format
   `FIG. 04 — [DESCRIPTION PLACEHOLDER]`.
5. **Technical framing:** prefer straight-on or 90°/45° angles, tight crops on
   material texture (threads, mill finish, coil edges) — avoid lifestyle-stock
   feel, handshakes, and hard-hat clichés.
6. **Delivery:** `next/image` everywhere; AVIF/WebP; `sizes` attribute
   mandatory; `priority` only for LCP image; `loading=lazy` otherwise;
   `surface-media` (Carbon) behind all images while loading — no white flash.
7. **Placeholders (pre-client-content):** neutral grey material renders or
   solid Zinc panels with mono label `IMAGE — [AWAITING CLIENT ASSET: coil
   stock]`; never watermark-style fake photos of claimed facilities.

---

## 26. Iconography

- **Set:** Lucide (single set, no mixing), stroke style only.
- **Stroke:** 1.5px fixed; sizes 16 / 20 / 24px on grid; color inherits text
  color (Carbon/Slate/Paper contextually); accent only for active states.
- **No** filled icons, no duotone icons, no icon-in-tinted-circle chips, no
  emoji.
- Icons are functional (chevrons, arrows, close, menu, file types, form
  feedback) or lightly semantic (capability markers in `Card/Feature`). Max one
  semantic icon per card.
- Custom icons (if needed for industry/process glyphs) drawn on the same 24px
  grid, 1.5px stroke, squared terminals to match the machined aesthetic —
  documented here before use.
- Directional arrows: use `→` glyph in text contexts (ghost links), Lucide
  `arrow-right` in buttons — never both in one element.
- All icon-only buttons have `aria-label`.

---

## 27. Loading States

Loading must feel machined: precise skeletons, no bouncing spinners.

1. **Skeletons:** exact-geometry placeholders (same aspect ratios, radii,
   spacing as loaded content — zero CLS). Fill Zinc Wash with a subtle
   left-to-right shimmer (`opacity` pulse 1.6s linear, not a gradient sweep on
   low-end; reduced-motion: static). Components with skeleton variants:
   `ProductCard`, `Card/Row`, gallery stage+thumbs, blog card, table rows.
2. **Spinner:** single sanctioned spinner — 16/20px, 1.5px stroke arc, Carbon
   (or Paper on dark), 800ms linear rotation. Used inside buttons and inline
   fetches only.
3. **Buttons loading:** label → spinner + `aria-busy`, width locked.
4. **Page transitions:** rely on Next.js streaming + skeleton layouts; no
   full-screen loader overlays, no progress bars for < 400ms operations
   (show nothing under 400ms — flashing loaders read as jank).
5. **Images:** Carbon `surface-media` + fade-in 250ms on load (reduced-motion:
   instant).
6. All async regions: `aria-busy="true"` while pending; announce completion via
   `aria-live="polite"` only for user-initiated actions (form submit), not
   ambient content.

---

## 28. Empty States

Empty states are honest and useful — especially important pre-launch when
client data is pending.

Pattern (`<EmptyState>`): centered in the content region (not the viewport),
max-width 420px:

```
mono-meta:    "NO RESULTS — SM/EMPTY"
display-md:   short factual heading
body-sm:      one sentence of guidance
action:       one Secondary button or Ghost link (never Primary)
```

| Context | Heading | Guidance | Action |
|---|---|---|---|
| Product filter, no matches | "No products match these filters" | Suggest clearing filters | "Clear filters" (Secondary) |
| Search, no results | "Nothing found for '[query]'" | Suggest categories | "Browse categories" (Ghost) |
| Blog, none published | "Insights are coming soon" | — | Newsletter signup |
| Data pending from client | "Content pending" | mono: `AWAITING CLIENT DATA — SEE §31` (internal builds only) | — |

Rules: no illustrations/mascots; optional single 24px stroke icon; never fake
content to hide emptiness; empty ≠ error (no functional colors here).

---

## 29. Error States

Errors are calm, specific, and recovery-oriented. Error color used exactly as
specified in §3.3 — never as decoration elsewhere, which keeps it meaningful.

1. **Field-level (forms):** §13 — border→error, 13px message with 16px icon
   below field, `aria-describedby` + `aria-invalid`, message says *how to fix*
   ("Enter a valid email like name@company.com"), not just "Invalid".
2. **Form-level:** error summary panel above the form (error-tint bg, 1px error
   border, `radius-xs`), lists failing fields as anchor links, receives focus
   on failed submit.
3. **Async/action failures (RFQ submit failed):** inline alert in place of the
   success area: "Your request wasn't sent." + retry Secondary button + fallback
   contact line (placeholder email). Never lose entered form data.
4. **404:** dark Carbon page. Mono `ERROR — 404 / PAGE NOT FOUND`, display-lg
   "This page doesn't exist.", ghost links: Home, Products, Contact. No jokes.
5. **500 / error boundary:** same structure, mono `ERROR — 500 / INTERNAL`,
   apology one-liner, "Reload" Secondary. Root `error.tsx` + per-route
   boundaries so one failed section never blanks the page.
6. **Offline/degraded:** non-critical sections fail silently into `EmptyState`;
   critical actions surface pattern 3.
7. Toasts: bottom-left, `radius-sm`, `shadow-float`, auto-dismiss 6s + manual
   close, `role="status"` (success) / `role="alert"` (error). Errors that
   require action are inline, never toast-only.

---

## 30. Design Tokens (Tailwind mapping)

Single source: CSS custom properties in `app/globals.css` (`:root` +
`[data-theme]` scopes for dark sections), consumed by Tailwind config. No hex
values, px paddings, or ad-hoc shadows in component code — tokens only.

```ts
// tailwind.config.ts (excerpt — implementation reference)
{
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)", "ink-soft": "var(--color-ink-soft)",
        steel: "var(--color-steel)", slate: "var(--color-slate)",
        mist: "var(--color-mist)", line: "var(--color-line)",
        "line-dark": "var(--color-line-dark)",
        paper: { DEFAULT: "var(--color-paper)", raised: "var(--color-paper-raised)", sunken: "var(--color-paper-sunken)" },
        accent: { DEFAULT: "var(--color-accent)", hover: "var(--color-accent-hover)", tint: "var(--color-accent-tint)", ondark: "var(--color-accent-on-dark)" },
      },
      fontFamily: {
        display: "var(--font-display)", sans: "var(--font-text)", mono: "var(--font-mono)",
      },
      borderRadius: { none: "0", xs: "2px", sm: "4px" },
      boxShadow: {
        hairline: "0 0 0 1px var(--color-line)",
        raise: "0 1px 2px rgb(11 15 20 / .06), 0 4px 12px rgb(11 15 20 / .06)",
        float: "0 4px 8px rgb(11 15 20 / .08), 0 12px 32px rgb(11 15 20 / .10)",
        modal: "0 8px 16px rgb(11 15 20 / .10), 0 24px 64px rgb(11 15 20 / .16)",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        inout: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDuration: { fast: "150ms", base: "250ms", slow: "500ms" },
      maxWidth: { container: "1360px" },
    },
  },
}
```

Type scale utilities (`display-xl` … `mono-micro`) implemented as Tailwind
component classes (plugin or `@layer components`) so hierarchy names — not raw
sizes — appear in JSX.

---

## 31. Placeholder & Content Conventions

Until the client supplies real content, the site must be **honest by
construction**:

1. **Numeric claims** (metrics, capacities, tolerances, years): render as
   `[—]` or clearly bracketed placeholders, e.g. `[XX]+ YEARS — PLACEHOLDER`.
   Counters animate to placeholder-safe values only when clearly labeled.
2. **Certifications:** the Quality section shows *slots*: hairline panels with
   mono label `CERTIFICATION — [PENDING CLIENT INPUT]`. Never render real
   standard logos (ISO, CE, etc.) or numbers until documents are provided.
3. **Customers / testimonials:** grey wordmark slots labeled `[CLIENT LOGO]`;
   testimonial cards carry `[Testimonial pending — placeholder text]` with
   role placeholders, no invented names or companies.
4. **Products / categories:** use *generic, plausible-neutral* category labels
   ("Sheets & Plates — placeholder") clearly marked in code with
   `// PLACEHOLDER-CONTENT` and centralized in `content/placeholders.ts` so a
   single sweep replaces everything.
5. **Geography:** the Global Reach map ships with zero highlighted countries
   and mono note `EXPORT MARKETS — TO BE CONFIRMED`.
6. **Contact data:** `[+00 000 000 0000]`, `[info@sriyaanmetals-placeholder]`,
   `[Registered address pending]`.
7. All placeholder content flows from one module (`content/placeholders.ts`) —
   nothing hardcoded in components — so real content is a data swap, not a
   redesign.

---

*End of design system. Component architecture: see `docs/COMPONENT-ARCHITECTURE.md`.*
