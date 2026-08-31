"use client";

import { useActionState, useState } from "react";
import { subscribeNewsletterAction, type PublicFormState } from "@/lib/public-actions";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Mail,
  ShieldCheck,
  Truck,
  Globe2,
  Headphones,
  Sparkles,
  BookOpen,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/components/motion";

/** Serializable post shape returned from the server page. */
export interface InsightPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  date: string; // ISO
  dateLabel: string;
  readTime: string;
  image: { src: string; alt: string } | null;
}

interface InsightsClientProps {
  posts: InsightPost[];
  categories: { slug: string; name: string; count: number }[];
}

const TRUST = [
  { icon: Sparkles, label: "Technical excellence" },
  { icon: BookOpen, label: "Industry knowledge" },
  { icon: BadgeCheck, label: "Trusted by Professionals" },
];

const VALUE = [
  { icon: ShieldCheck, title: "Quality Assured", sub: "Tested & certified materials" },
  { icon: Truck, title: "Timely Delivery", sub: "On-time, every time" },
  { icon: Globe2, title: "Global Standards", sub: "ISO & industry compliant" },
  { icon: Headphones, title: "Expert Support", sub: "Here to help you" },
];

export function InsightsClient({ posts, categories }: InsightsClientProps) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [nlState, nlAction] = useActionState(subscribeNewsletterAction, {} as PublicFormState);

  const filtered = posts.filter((p) => {
    const matchCat =
      filter === "all"
        ? true
        : filter === "guides"
          ? p.categorySlug === "guides"
          : filter === "knowledge"
            ? p.categorySlug === "knowledge"
            : p.categorySlug === "updates";
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden pb-16 pt-6 lg:pb-24">
        {/* Right hero image — stays cinematic (dark) in both themes */}
        <div
          aria-hidden
          className="keep-dark pointer-events-none absolute inset-y-0 right-0 hidden w-3/5 lg:block"
        >
          <div className="relative h-full w-full">
            <Image
              src="/images/blog/insights-hero.jpg"
              alt=""
              fill
              priority
              sizes="60vw"
              className="object-cover object-center in-hero-img"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg,#05080B 0%,rgba(5,8,11,0.85) 18%,rgba(5,8,11,0.4) 55%,rgba(5,8,11,0.0) 80%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05080B] via-transparent to-transparent" />
          </div>
        </div>

        {/* Ambient particles */}
        {!reduced && (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="in-dust absolute block h-1 w-1 rounded-full bg-[#D8A84E]/50"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 100}%`,
                  animation: `in-drift ${9 + (i % 6)}s linear ${i * 0.6}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-6">
            <p
              className="in-fade font-mono text-xs uppercase tracking-[0.3em]"
              style={{ animationDelay: "60ms" }}
            >
              <span className="text-[#D8A84E]">Insights</span>
            </p>

            <h1
              id="insights-heading"
              className="mt-6 font-display font-semibold leading-[0.98] tracking-[-0.03em] text-[#F5F7F8]"
            >
              <span
                className="in-line block text-[clamp(2.6rem,6vw,5rem)]"
                style={{ animationDelay: "160ms" }}
              >
                From{" "}
              </span>
              <span
                className="in-line in-gold relative mt-1 block text-[clamp(2.6rem,6vw,5rem)]"
                style={{ animationDelay: "280ms" }}
              >
                the desk
                <span
                  aria-hidden
                  className="in-sheen absolute -bottom-1 left-0 h-px w-full"
                />
              </span>
            </h1>

            <p
              className="in-fade mt-7 max-w-xl text-[15px] leading-relaxed text-[#A9B2BA] sm:text-base"
              style={{ animationDelay: "420ms" }}
            >
              Technical guides, industry knowledge and company updates
              — crafted for buyers, engineers and partners.
            </p>

            <ul
              className="in-fade mt-9 flex flex-wrap gap-x-7 gap-y-3"
              style={{ animationDelay: "560ms" }}
            >
              {TRUST.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.label} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8A84E]/25 bg-[#D8A84E]/5">
                      <Icon
                        size={15}
                        strokeWidth={1.6}
                        className="text-[#D8A84E]"
                        aria-hidden
                      />
                    </span>
                    <span className="font-mono text-xs tracking-[0.08em] text-[#A9B2BA]">
                      {t.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ===================== TOOLBAR ===================== */}
      <section className="relative">
        <div className="flex flex-col gap-5 border-y border-white/10 py-4 md:flex-row md:items-center md:justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { slug: "all", name: "All" },
              ...categories.map((c) => ({ slug: c.slug, name: c.name })),
            ].map((c) => {
              const active =
                filter === c.slug ||
                (c.slug === "updates" && filter === "updates");
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setFilter(c.slug)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.16em] transition-all duration-300",
                    active
                      ? "border-[#D8A84E] bg-[#D8A84E]/10 text-[#F0C66D] shadow-[0_0_18px_-6px_rgba(216,168,78,0.6)]"
                      : "border-white/10 text-[#A9B2BA] hover:border-[#D8A84E]/45 hover:text-white",
                  )}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727D86]"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              aria-label="Search articles"
              className="h-11 w-full rounded-lg border border-white/10 bg-[#0A1015] pl-10 pr-4 text-sm text-[#F5F7F8] placeholder:text-[#727D86] transition-colors duration-200 focus:border-[#D8A84E] focus:outline-none focus:shadow-[0_0_0_1px_rgba(216,168,78,0.25)]"
            />
          </div>
        </div>
      </section>

      {/* ===================== GRID ===================== */}
      <section aria-labelledby="articles-heading" className="py-14 lg:py-20">
        <h2 id="articles-heading" className="sr-only">
          Latest articles
        </h2>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#0A1015] px-6 py-16 text-center">
            <p className="font-display text-xl text-[#F5F7F8]">
              No articles found
            </p>
            <p className="mt-2 text-sm text-[#727D86]">
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {filtered.map((post, i) => (
              <article
                key={post.slug}
                className="in-card group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0A1015] transition-all duration-[400ms] ease-out hover:-translate-y-1.5 hover:border-[#D8A84E]/45 hover:shadow-[0_24px_60px_-30px_rgba(216,168,78,0.45)]"
                style={{
                  animation: reduced
                    ? undefined
                    : `in-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both`,
                  animationDelay: `${i * 90}ms`,
                }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="absolute inset-0 z-20"
                  aria-label={post.title}
                />
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image.src}
                      alt={post.image.alt}
                      fill
                      sizes="(min-width:1024px) 33vw,(min-width:640px) 50vw,100vw"
                      className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#111b24] to-[#05080B]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1015] via-transparent to-transparent" />
                  {/* Category badge */}
                  <span
                    className={cn(
                      "keep-dark absolute left-3 top-3 z-10 rounded-md border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-[0_0_16px_-4px_rgba(216,168,78,0.8)]",
                      post.categorySlug === "guides"
                        ? "border-[#D8A84E]/50 bg-[#D8A84E]/15 text-[#F0C66D]"
                        : "border-white/15 bg-black/45 text-[#C9D0D5]",
                    )}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-xs tracking-[0.1em] text-[#727D86]">
                    {post.dateLabel}
                  </p>
                  <h3 className="mt-2.5 font-display text-[1.05rem] font-semibold leading-snug tracking-tight text-[#F5F7F8] transition-colors duration-300 group-hover:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-[#A9B2BA]">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-4">
                    <span className="relative z-30 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-[#D8A84E]">
                      Read more
                      <ArrowRight
                        size={14}
                        strokeWidth={1.8}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                    <span className="font-mono text-xs tracking-[0.06em] text-[#727D86]">
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section
        aria-labelledby="newsletter-heading"
        className="in-fade relative overflow-hidden rounded-xl border border-[#D8A84E]/25 bg-gradient-to-br from-[#0A1015] to-[#05080B] p-7 sm:p-10 lg:p-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(216,168,78,0.18), transparent 70%)",
          }}
        />
        {!reduced && (
          <span
            aria-hidden
            className="in-streak pointer-events-none absolute inset-y-0 w-1/3"
          />
        )}

        <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D8A84E]/30 bg-[#D8A84E]/10">
              <Mail size={20} className="text-[#F0C66D]" aria-hidden />
            </span>
            <h2
              id="newsletter-heading"
              className="mt-5 font-display text-2xl font-semibold leading-tight tracking-tight text-[#F5F7F8] sm:text-3xl"
            >
              Stay ahead with
              <br />
              industry insights
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#A9B2BA]">
              Subscribe to get the latest guides, updates and best
              practices straight to your inbox.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form action={nlAction} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                className="h-13 flex-1 rounded-lg border border-white/10 bg-[#05080B]/70 px-4 text-sm text-[#F5F7F8] placeholder:text-[#727D86] transition-colors duration-200 focus:border-[#D8A84E] focus:outline-none focus:shadow-[0_0_0_1px_rgba(216,168,78,0.3)]"
              />
              <button
                type="submit"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D8A84E] to-[#F0C66D] px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#05080B] shadow-[0_8px_30px_-10px_rgba(216,168,78,0.8)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_12px_40px_-8px_rgba(216,168,78,0.95)]"
              >
                Subscribe
                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </button>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
            </form>
            {nlState.ok ? (
              <p
                role="status"
                className="mt-3 font-mono text-xs tracking-[0.08em] text-[#F0C66D]"
              >
                ✓ Thank you — you are subscribed.
              </p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs tracking-[0.06em] text-[#727D86]">
                <li className="flex items-center gap-1.5">
                  <Check /> No spam
                </li>
                <li className="flex items-center gap-1.5">
                  <Check /> Unsubscribe anytime
                </li>
                <li className="flex items-center gap-1.5">
                  <Check /> Industry updates
                </li>
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ===================== VALUE CARDS ===================== */}
      <section aria-label="Why SRIYAAN METALS" className="mt-8">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE.map((v) => {
            const Icon = v.icon;
            return (
              <li
                key={v.title}
                className="group flex items-start gap-4 rounded-xl border border-white/10 bg-[#0A1015] p-5 transition-all duration-300 hover:border-[#D8A84E]/40 hover:bg-[#0D141A]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#D8A84E]/25 bg-[#D8A84E]/5 text-[#D8A84E] transition-all duration-300 group-hover:shadow-[0_0_20px_-6px_rgba(216,168,78,0.7)]">
                  <Icon size={20} strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[15px] font-semibold text-[#F5F7F8]">
                    {v.title}
                  </p>
                  <p className="mt-1 text-[12.5px] text-[#727D86]">{v.sub}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <style>{`
        @keyframes in-fade { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:none;} }
        @keyframes in-line { from{opacity:0;transform:translateY(26px);filter:blur(8px);} to{opacity:1;transform:none;filter:blur(0);} }
        @keyframes in-fade-up { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:none;} }
        @keyframes in-sheen { 0%{transform:translateX(-100%);opacity:0;} 20%{opacity:1;} 100%{transform:translateX(120%);opacity:0;} }
        @keyframes in-drift { 0%{transform:translateY(0) translateX(0);opacity:0;} 10%{opacity:.6;} 90%{opacity:.5;} 100%{transform:translateY(-120px) translateX(20px);opacity:0;} }
        @keyframes in-streak { 0%{transform:translateX(-120%);} 100%{transform:translateX(260%);} }
        .in-fade { animation: in-fade .7s cubic-bezier(0.22,1,0.36,1) both; }
        .in-line { animation: in-line .9s cubic-bezier(0.22,1,0.36,1) both; }
        .in-gold { background:linear-gradient(90deg,#F0C66D,#D8A84E 55%,#B8892E); -webkit-background-clip:text; background-clip:text; color:transparent; text-shadow:0 0 26px rgba(216,168,78,.25); transition:filter .4s ease,text-shadow .4s ease; }
        .in-gold:hover { filter:brightness(1.08); text-shadow:0 0 34px rgba(240,198,109,.55); }
        .in-sheen { background:linear-gradient(90deg,transparent,rgba(240,198,109,.9),transparent); filter:drop-shadow(0 0 6px rgba(240,198,109,.8)); animation:in-sheen 2.8s ease-out .9s 1; }
        .in-hero-img { animation: in-hero-img 6s ease-out both; }
        @keyframes in-hero-img { from{transform:scale(1.06);opacity:.4;} to{transform:scale(1);opacity:1;} }
        .in-dust { width:3px;height:3px; }
        .in-streak { background:linear-gradient(90deg,transparent,rgba(240,198,109,.12),transparent); filter:blur(2px); animation:in-streak 7s ease-in-out 2s infinite; }
        @media (prefers-reduced-motion: reduce){ .in-fade,.in-line,.in-fade-up,.in-hero-img,.in-sheen,.in-dust,.in-streak{animation:none!important;opacity:1!important;transform:none!important;filter:none!important;} }
      `}</style>
    </>
  );
}

function Check() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D8A84E"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
