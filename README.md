# SRIYAAN METALS — Website

Corporate website and admin panel for SRIYAAN METALS, a Mumbai-based metals
trading, import and export company.

- **Public site:** product catalogue (fasteners, pipe fittings, flanges,
  carbon steel pipes), quality certifications, manufacturing process,
  global reach, insights, contact and enquiry forms.
- **Admin panel:** `/admin/login` then `/admin/dashboard` — products,
  categories, blog, certifications, enquiries, vendor requests, media,
  SEO, settings, and live traffic (visitors / visits by day, week, month).

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, server actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MySQL 8 + Prisma (MariaDB/MySQL driver adapter) |
| Validation | Zod |
| Auth | Custom session auth (opaque tokens, bcrypt, HttpOnly cookies) |

## Requirements

- Node.js 20.19+ (Node.js 22 LTS recommended — see `"engines"` in package.json)
- MySQL 8.0+ (or MariaDB 10.6+)
- npm

## Local setup

```bash
npm install

# A MySQL server must be reachable. Quickest option:
docker run --name sriyaan-mysql -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=sriyaan -p 3306:3306 -d mysql:8

npm run db:setup                  # create DB (utf8mb4) + write .env.local
npm run db:generate               # Prisma client (offline-safe fallback)
npm run db:migrate:apply          # apply database migrations
npm run db:seed                   # optional: development placeholders
npx tsx scripts/seed-content.ts   # optional: full catalogue content
npx tsx scripts/seed-site.ts      # optional: industries, certifications…
npx tsx scripts/seed-blog.ts      # optional: sample articles
npm run dev                       # http://localhost:3000
```

If you already run MySQL elsewhere, copy `.env.example` → `.env`, set
`DATABASE_URL=mysql://user:pass@host:3306/dbname`, and skip `db:setup`.
The database must use `utf8mb4` / `utf8mb4_unicode_ci`.

Admin panel: `http://localhost:3000/admin/login`
(first admin: `npx tsx scripts/create-admin.ts`)

## Environment variables

See `.env.example` for the full list. Required in production:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MySQL connection string (`mysql://user:pass@host:3306/db`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Creates the first admin user |
| `SEED_CONTENT` | Set to `1` to seed catalogue content on deploy |

## Production build

```bash
npm run build   # auto-generates the Prisma client, applies pending
                # migrations + runs the deploy bootstrap when
                # DATABASE_URL is set, then compiles the site
npm start
```

The generated Prisma client (`src/generated/`) is gitignored, so the
build step always regenerates it first — required on hosts (such as
Hostinger's managed Node.js hosting) that only run `npm install` +
`npm run build` with no SSH access.

## Documentation

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — hosting on Hostinger (VPS or
  managed Node.js Web App) or Vercel
- [`docs/DATABASE.md`](docs/DATABASE.md) — schema, migrations and seeds
