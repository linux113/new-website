# SRIYAAN METALS — Website

Corporate website and admin panel for SRIYAAN METALS, a Mumbai-based metals
trading, import and export company.

- **Public site:** product catalogue (fasteners, pipe fittings, flanges,
  carbon steel pipes), quality certifications, manufacturing process,
  global reach, insights, contact and enquiry forms.
- **Admin panel:** `/admin` — manage products, categories, blog posts,
  certifications, enquiries, contacts, vendor requests, media, SEO and
  site settings (including social links and catalogue downloads).

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, server actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma (pg driver adapter) |
| Validation | Zod |
| Auth | Custom session auth (opaque tokens, bcrypt, HttpOnly cookies) |

## Requirements

- Node.js 20+
- PostgreSQL 14+
- npm

## Local setup

```bash
npm install
node scripts/start-local-pg.mjs   # embedded PostgreSQL (terminal 1)
                                  # → writes DATABASE_URL to .env.local
npm run db:generate               # Prisma client (offline-safe fallback)
npm run db:migrate:apply          # apply database migrations
npm run db:seed                   # optional: development placeholders
npx tsx scripts/seed-content.ts   # optional: full catalogue content
npx tsx scripts/seed-site.ts      # optional: industries, certifications…
npx tsx scripts/seed-blog.ts      # optional: sample articles
npm run dev                       # http://localhost:3000
```

If you already run a PostgreSQL server, copy `.env.example` → `.env`,
fill `DATABASE_URL`, and skip the embedded-PostgreSQL step.

Admin panel: `http://localhost:3000/admin/login`
(first admin: `npx tsx scripts/create-admin.ts`)

## Environment variables

See `.env.example` for the full list. Required in production:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Creates the first admin user |
| `SEED_CONTENT` | Set to `1` to seed catalogue content on deploy |

## Production build

```bash
npm run build
npm start
```

## Documentation

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — hosting on Hostinger (VPS) or Vercel
- [`docs/DATABASE.md`](docs/DATABASE.md) — schema, migrations and seeds
