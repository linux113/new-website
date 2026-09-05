# Hostinger — connecting the PostgreSQL database

This site **requires PostgreSQL** (Prisma 7 + the `pg` driver adapter in
`src/lib/db.ts`). Hostinger's shared/Business/Cloud managed plans provide
**MySQL only** — PostgreSQL is not offered on those plans — so the correct
path depends on where the site runs:

| Where the site runs | Where the database lives | Section |
|---|---|---|
| Hostinger **Business / Cloud** (managed Node.js app, no SSH) | **Neon** (free managed Postgres) | [Path A](#path-a--hostinger-businesscloud--neon-postgres) |
| Hostinger **Business / Cloud**, Supabase preferred | **Supabase** (free managed Postgres) | [Path B](#path-b--hostinger-businesscloud--supabase) |
| Hostinger **VPS** | PostgreSQL installed on the VPS itself | [Path C](#path-c--hostinger-vps--postgresql-on-the-vps) |

> Already deployed and seeing placeholder cards / 404s on product links?
> That is the app running **without a reachable database**. Connecting the
> database and redeploying switches the homepage to the real catalogue.

Everything below ends the same way: `DATABASE_URL` set as an environment
variable, then a redeploy. The build script (`scripts/prod-build.mjs`)
detects `DATABASE_URL` automatically and, on every deploy:

1. generates the Prisma client,
2. applies pending migrations (`prisma migrate deploy`),
3. bootstraps the first admin + required settings rows (`ADMIN_*` vars),
4. runs `next build`.

**No SSH and no manual SQL ever needed on managed plans.**

---

## Path A — Hostinger Business/Cloud + Neon Postgres

*(recommended: fastest to set up, free tier is enough for this site)*

### A1. Create the database on Neon

1. Sign up at **neon.tech** (free — no credit card).
2. Click **Create project** → name it `sriyaan-prod`.
3. Choose a region close to your visitors (e.g. *Singapore* or *Mumbai* if
   offered — Mumbai gives the lowest latency from India).
4. After creation Neon shows a **Connection string**. Copy it. It looks like:

   ```
   postgresql://sriyaan_owner:AbC123xyz@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

   - Keep `?sslmode=require` (Neon requires TLS).
   - Neon offers a **Pooled** and a **Direct** string — either works for
     this app; prefer **Pooled**.

### A2. Create the app on Hostinger (skip if it already exists)

1. hPanel → **Websites** → **Add Website** → **Deploy Web App**.
2. Connect the GitHub repo (`linux113/new-website`) and pick this branch, or
   upload a ZIP (exclude `node_modules`, `.next`, `.env*`, `src/generated`,
   `.git`).
3. Framework auto-detects as **Next.js**; build command stays `npm run build`.
4. **Node.js version: 22.x** (or 24.x).

### A3. Set the environment variables

hPanel → your Node.js app → **Environment Variables** — add **before**
deploying (they are read during the build):

| Variable | Value |
|---|---|
| `DATABASE_URL` | the Neon connection string from A1 |
| `NEXT_PUBLIC_SITE_URL` | `https://sriyaanmetals.com` |
| `ADMIN_NAME` | your name |
| `ADMIN_EMAIL` | admin login email |
| `ADMIN_PASSWORD` | min 12 characters — this creates the first admin |
| `SEED_CONTENT` | `1` to seed the starter catalogue (remove after first deploy) |

R2 (`R2_*`) and email (`EMAIL_*`) keys go here too when you enable uploads
or notifications.

### A4. Deploy and verify

1. Click **Deploy**. Open **Deployments → View log**; a successful run shows:

   ```text
   [prod-build] 1/3 Generating Prisma client …
   [prod-build] 2/3 DATABASE_URL found — applying pending migrations …
   [prod-build] Running deploy bootstrap (admin / settings) …
   [prod-build] 3/3 Running next build …
   [prod-build] Done.
   ```

2. Open the site → the homepage "Selected products" section now lists the
   catalogue, and every product card opens its page (no 404s).
3. Log in at `https://sriyaanmetals.com/admin/login` with the `ADMIN_EMAIL`
   / `ADMIN_PASSWORD` values and start managing products from the admin
   panel.

---

## Path B — Hostinger Business/Cloud + Supabase

Supabase also gives a free managed PostgreSQL and has a **connect wizard**
inside Hostinger's Node.js dashboard.

### B1. Create the project on Supabase

1. Sign up at **supabase.com** → **New project** → name `sriyaan-prod`,
   pick a region near India, set a strong database password
   (**save it** — it goes into the connection string).
2. Open the project → top bar **Connect** button.
3. Under connection strings pick the **Transaction pooler** (port `6543`)
   string for app runtimes. It looks like:

   ```
   postgresql://postgres.sriyaanprod:YOUR-PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```

   - Replace `YOUR-PASSWORD` with the database password you set in step 1.
   - If the password contains special characters
     (`@ : / ? # & %` …), URL-encode them first (`@` → `%40`,
     `:` → `%3A`, `#` → `%23`, `/` → `%2F`).

### B2. Connect it in hPanel — two equivalent ways

**Wizard:** hPanel → your Node.js app → **Essentials → Database → Connect**
→ **Supabase** → sign in → choose the project. Hostinger injects the
connection variables into the next deployment. Then confirm in
**Environment Variables** that the variable is named exactly
`DATABASE_URL` (add it if the wizard used a different name).

**Manual:** hPanel → your Node.js app → **Environment Variables** → add
`DATABASE_URL` with the Supabase string from B1 (plus the same variables
as table A3).

### B3. Deploy and verify

Same as **A4**: deploy, check the deployment log for the
`[prod-build] 2/3 … applying pending migrations` line, then confirm the
homepage catalogue and `/admin/login`.

---

## Path C — Hostinger VPS + PostgreSQL on the VPS

Full control (and no external dependency): install PostgreSQL next to the
app. SSH as root, then:

### C1. Install PostgreSQL and Node.js

```bash
apt update && apt upgrade -y
apt install -y postgresql git curl nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
npm install -g pm2
systemctl enable --now postgresql
```

### C2. Create the database and user

```bash
sudo -u postgres psql <<'SQL'
CREATE USER sriyaan WITH ENCRYPTED PASSWORD 'USE-A-LONG-RANDOM-PASSWORD';
CREATE DATABASE sriyaan_prod OWNER sriyaan;
SQL
```

PostgreSQL 15+ (Ubuntu 22.04/24.04 ship 14+/15+) additionally restricts the
`public` schema — grant it to the new user:

```bash
sudo -u postgres psql -c "GRANT ALL ON SCHEMA public TO sriyaan;"
```

### C3. Point the app at it

```bash
adduser --disabled-password --gecos "" sriyaan && su - sriyaan
git clone https://github.com/linux113/new-website.git app && cd app
cp .env.example .env
```

Edit `.env`:

```bash
DATABASE_URL="postgresql://sriyaan:USE-A-LONG-RANDOM-PASSWORD@127.0.0.1:5432/sriyaan_prod"
NEXT_PUBLIC_SITE_URL="https://sriyaanmetals.com"
ADMIN_NAME="Your Name"
ADMIN_EMAIL="admin@sriyaanmetals.com"
ADMIN_PASSWORD="min-12-characters"
SEED_CONTENT=1
```

> URL-encode the password if it contains `@ : / # ? %` characters.
> Keep the host as `127.0.0.1` — the database should **not** listen on the
> public internet. The default Ubuntu config already limits it to
> localhost; leave it that way.

### C4. Build, run, publish

```bash
npm ci
npm run build          # generates Prisma client, applies migrations,
                       # bootstraps admin, builds Next.js
pm2 start npm --name sriyaan -- start
pm2 startup && pm2 save
```

Then the nginx reverse proxy + HTTPS steps from
[`docs/DEPLOYMENT.md` → Option A](./DEPLOYMENT.md#option-a--hostinger-vps).

### C5. Verify

```bash
psql "postgresql://sriyaan:PASSWORD@127.0.0.1:5432/sriyaan_prod" -c "\dt"
```

You should see the Prisma tables (`Product`, `Category`, `AdminUser`, …).
Then open the site and `/admin/login` as in A4.

---

## Troubleshooting

| Symptom | Cause → fix |
|---|---|
| Build log says `skipping migrations` | `DATABASE_URL` not set (or set after the build) → add it in Environment Variables and **redeploy** — env vars are baked in at build time. |
| `Error: P1001: Can't reach database server` | Wrong host/port, or the DB blocks the app's IP → re-copy the connection string from the provider; on Supabase use the **pooler** host (port `6543`), on Neon keep the `-pooler` host. |
| `password authentication failed for user …` | Wrong password, **or** unencoded special characters → URL-encode (`@`→`%40`, `:`→`%3A`, `#`→`%23`). |
| `SSL/TLS connection required` | Append `?sslmode=require` to `DATABASE_URL` (Neon/Supabase always need it). |
| `sslmode` + pooler string conflicts | Use exactly one query block: `…?sslmode=require` (add `&pgbouncer=true` only if a provider asks for it). |
| Admin login says invalid credentials | `ADMIN_*` vars were missing on the **first** build → set them, redeploy (bootstrap is idempotent), or create an admin from the VPS: `npx tsx scripts/create-admin.ts`. |
| Homepage shows placeholder products / product pages say "briefly offline" | The app still can't reach the DB at **runtime** → check `DATABASE_URL` is saved, redeploy, and test the network path (some hosts block outbound port `5432`; Neon/Supabase poolers run on `443`/`6543`-style ports that pass). |
| `relation "AdminUser" does not exist` | Migrations were skipped (no `DATABASE_URL` at build) → set it and redeploy; verify with `npm run db:migrate:status` where SSH is available. |

## Quick connection test (from your own computer)

```bash
psql "postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require" -c "select version();"
```

If this works from your machine but the Hostinger build still can't reach
the database, the blocked direction is **outbound from Hostinger** — switch
to the provider's pooler endpoint (ports `443`/`6543`) or contact Hostinger
support to open outbound `5432`.
