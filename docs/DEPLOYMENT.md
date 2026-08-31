# Deploying to Vercel

The repo is pre-wired for Vercel: the `vercel-build` script runs
`prisma generate` → `prisma migrate deploy` → `scripts/deploy-setup.ts`
(admin user + optional demo data) → `next build`. You only create the
accounts and set environment variables.

## 1. Database (Neon — free tier is fine)

1. Go to https://neon.tech → sign up → **New project** (region: Singapore
   `ap-southeast-1` is closest to Mumbai).
2. Copy the **connection string** (it looks like
   `postgresql://USER:PASSWORD@HOST/neondb?sslmode=require`).

## 2. Vercel project

1. Go to https://vercel.com → sign up with **GitHub** → **Add New →
   Project** → import `linux113/new-website`.
2. **Settings before first deploy** (Project Settings):
   - **Git → Production Branch**: `arena/01a023ea-new-website`
     (or merge that branch into `main` first and leave the default).
   - **Build & Development Settings → Build Command**: `npm run vercel-build`
3. **Environment Variables** (Production):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | the Neon connection string |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` (update after first deploy; later your real domain) |
   | `ADMIN_NAME` | e.g. `Admin` |
   | `ADMIN_EMAIL` | `admin@sriyaanmetals.com` |
   | `ADMIN_PASSWORD` | strong password, min 12 chars |
   | `SEED_DEMO` | `1` (demo content for the client presentation — REMOVE this var and redeploy once real content is entered) |

4. Click **Deploy**. First build takes ~2–4 minutes.

Result: `https://<project>.vercel.app` — public site at `/`, admin at
`/admin` (login with the ADMIN_EMAIL/ADMIN_PASSWORD you set).

## 3. After the first deploy

- Set `NEXT_PUBLIC_SITE_URL` to the real URL and redeploy (fixes
  sitemap/JSON-LD URLs).
- **Custom domain**: Vercel → Project → Settings → Domains → add
  `sriyaanmetals.com` and follow the DNS instructions at your
  registrar.
- **Media uploads**: production refuses local-disk uploads by design.
  Create a Cloudflare R2 bucket and set `R2_ACCOUNT_ID`,
  `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`,
  `R2_PUBLIC_URL`. Until then the site works fully except new uploads
  in the admin media library.
- **Email notifications**: set `EMAIL_PROVIDER_API_KEY` (Resend),
  `EMAIL_FROM`, `EMAIL_REPLY_TO`. Until then enquiries are stored in
  the admin inbox but no notification emails are sent.
- Remove `SEED_DEMO` once real products/content are entered, then
  delete demo rows from the admin panel (all are "(demo)"/"sample"
  marked; enquiry history uses source `demo-seed`).

## Notes

- Never set `PREVIEW_DEV_BYPASS` or `PREVIEW_CROSS_SITE_COOKIES` in
  production — those are sandbox-preview workarounds only.
- Session cookies are HttpOnly + Secure automatically in production.
- `prisma migrate deploy` is safe to run on every build (applies only
  pending migrations).
