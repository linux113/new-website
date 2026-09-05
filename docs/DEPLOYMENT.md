# Deployment

The app is a standard Next.js server — it needs Node.js 20.19+ (Node 22
LTS recommended), a MySQL 8 database, and a long-running process.

Supported paths:

- **Option A — Hostinger VPS** (recommended when you want full control / SSH)
- **Option B — Vercel** (managed)
- **Option C — Hostinger Node.js Web App** (Business / Cloud plans,
  managed deploys from GitHub or ZIP upload, **no SSH**)

> **Node version & the `EBADENGINE` warning.** `package.json` declares
> `"engines": { "node": "^20.19.0 || >=22.12.0" }`. Node 20.19+ builds
> fine. The `npm warn EBADENGINE … @prisma/streams-local … requires node
> >=22` line you may see during `npm install` comes from a *dev-only*
> Prisma CLI helper and is harmless on Node 20 — but to silence it pick
> **Node.js 22.x** (or 24.x) in your hosting panel / install Node 22 LTS
> on a VPS.

> **`npm run build` self-prepares Prisma.** The build script
> (`scripts/prod-build.mjs`) always:
> 1. generates the Prisma client from `prisma/schema.prisma` (the client
>    lives in `src/generated/`, which is gitignored — a plain `next build`
>    on a fresh checkout fails with `Module not found: Can't resolve
>    '@/generated/prisma/client'`), then
> 2. if `DATABASE_URL` is set, applies pending migrations
>    (`prisma migrate deploy`) and runs the deploy bootstrap
>    (`scripts/deploy-setup.ts`, creates the first admin / settings rows);
>    if it is not set these are skipped with a log line, and
> 3. runs `next build`.
>
> Vercel is wired separately via `vercel.json` → `npm run vercel-build`
> (the same steps, run explicitly).

---

## Option A — Hostinger VPS

### 1. Server preparation

```bash
# as root on a fresh Ubuntu/Debian VPS
apt update && apt upgrade -y
apt install -y nginx mysql-server git curl
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -   # Node.js 22 LTS
apt install -y nodejs
npm install -g pm2
```

### 2. Database

```bash
sudo mysql <<'SQL'
CREATE DATABASE sriyaan_prod
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sriyaan'@'localhost' IDENTIFIED BY 'use-a-strong-password';
GRANT ALL PRIVILEGES ON sriyaan_prod.* TO 'sriyaan'@'localhost';
FLUSH PRIVILEGES;
SQL
```

> The `utf8mb4` / `utf8mb4_unicode_ci` charset is required — it stores ₹,
> — and emoji, and its case-insensitive comparison is what the admin
> search relies on.

### 3. Application

```bash
adduser --disabled-password --gecos "" sriyaan   # or use your user
su - sriyaan
git clone https://github.com/linux113/new-website.git app
cd app
cp .env.example .env    # then edit (see table below)
npm ci
npm run build           # generates Prisma client, applies migrations,
                        # bootstraps admin, then runs next build
```

`.env` values:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `mysql://sriyaan:PASSWORD@127.0.0.1:3306/sriyaan_prod` (percent-encode reserved chars in the password) |
| `NEXT_PUBLIC_SITE_URL` | `https://sriyaanmetals.com` |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | first admin credentials (password min 12 chars) |
| `SEED_CONTENT` | `1` to seed the catalogue; remove and redeploy to stop |

### 4. Process manager (pm2)

```bash
pm2 start npm --name sriyaan -- start
pm2 startup && pm2 save     # start on boot
```

### 5. Nginx reverse proxy

```nginx
# /etc/nginx/sites-available/sriyaan
server {
    listen 80;
    server_name sriyaanmetals.com www.sriyaanmetals.com;

    client_max_body_size 10M;   # catalogue/media uploads

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/sriyaan /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 6. HTTPS

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d sriyaanmetals.com -d www.sriyaanmetals.com
```

### 7. Updating

```bash
cd ~/app
git pull
npm ci
npm run build           # re-generates client, applies new migrations
pm2 restart sriyaan
```

---

## Option B — Vercel (managed)

1. Create a MySQL database (PlanetScale, Aiven, Hostinger's managed MySQL,
   or any MySQL 8 host) and copy the connection string.
2. Import the GitHub repository at vercel.com.
3. Set the environment variables from the table above (build command is
   pre-wired via `npm run vercel-build`, which runs migrations, the
   deploy bootstrap and the production build).
4. Deploy, then point your domain's DNS at Vercel.

---

## Option C — Hostinger Node.js Web App (Business / Cloud)

Hostinger runs `npm install` followed by the `build` script on the server
and gives **no SSH / npm access** — so everything Prisma must happen
inside `npm run build`, which this repo now does automatically
(see the note at the top). The typical reason a first Hostinger deploy
failed with output ending at `Creating an optimized production build …`
was the missing generated Prisma client.

1. **Create a MySQL database** the app can reach:
   - In hPanel → *Databases* → **MySQL Databases**, create a database and
     user, then build the URL as
     `mysql://USER:PASSWORD@HOST:3306/DATABASE`.
   - Set the collation to **`utf8mb4_unicode_ci`**.
   - This works on every Hostinger plan, including **Business** (which
     offers MySQL only) — no external database provider is needed.
2. **Add the website**: hPanel → Websites → *Add Website* → **Deploy Web
   App** → choose **GitHub integration** (recommended, auto-builds on
   push) or **Upload your website files** (a ZIP of the repo; exclude
   `node_modules`, `.next`, `.env*`, `src/generated`, `.git`).
3. **Build settings** during setup: the framework auto-detects as
   **Next.js** and the build command is `npm run build` (already the
   package.json script). Leave the defaults.
4. **Node.js version**: choose **22.x** (or 24.x) to match the engine
   requirements and avoid `EBADENGINE` warnings.
5. **Environment variables** — set them in the app dashboard
   (*Environment Variables*) **before** deploying:

   | Variable | Purpose |
   |---|---|
   | `DATABASE_URL` | MySQL connection string (required for migrations + runtime) |
   | `NEXT_PUBLIC_SITE_URL` | `https://sriyaanmetals.com` (inlined at build) |
   | `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | first admin credentials (password min 12 chars) |
   | `SEED_CONTENT` | `1` to seed the catalogue; remove and redeploy to stop |

   R2 / email provider keys go here too when you use them. Env vars are
   injected into both the build and the running app.
6. **Deploy**, then open the **Deployments** tab → *View log*. A
   successful log shows, in order:

   ```text
   [prod-build] 1/3 Generating Prisma client …
   [prod-build] 2/3 DATABASE_URL found — applying pending migrations …
   [prod-build] Running deploy bootstrap (admin / settings) …
   [prod-build] 3/3 Running next build …
   ✓ Compiled successfully
   ✓ Generating static pages …
   [prod-build] Done.
   ```

   If `DATABASE_URL` was not set yet, step 2 logs *"skipping migrations"*
   and the build still succeeds — set the variable and redeploy before
   going live.
7. **Login**: open `https://your-domain/admin/login` with the
   `ADMIN_EMAIL` / `ADMIN_PASSWORD` values from step 5.
8. **Updates**: push to the connected GitHub branch (or re-upload a ZIP)
   — each deploy re-generates the client, applies new migrations and
   rebuilds. Use the dashboard **Restart** button to restart the running
   process without rebuilding.

---

## Post-deploy checklist

- [ ] Public pages load (`/`, `/products`, `/quality`, `/contact`)
- [ ] `/admin/login` shows the login form (not the dashboard)
- [ ] Log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Admin → Settings: set social media URLs (they drive the footer icons)
- [ ] Admin → Enquiries: submit the public contact form and confirm it appears
- [ ] HTTPS certificate active
