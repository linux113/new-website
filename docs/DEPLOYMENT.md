# Deployment

Two supported paths: **Hostinger VPS** (recommended for full control) or
**Vercel** (managed). The app is a standard Next.js server — it needs
Node.js 20+, a PostgreSQL database, and a long-running process.

---

## Option A — Hostinger VPS

### 1. Server preparation

```bash
# as root on a fresh Ubuntu/Debian VPS
apt update && apt upgrade -y
apt install -y nginx postgresql git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -   # Node.js 20
apt install -y nodejs
npm install -g pm2
```

### 2. Database

```bash
sudo -u postgres psql <<'SQL'
CREATE USER sriyaan WITH PASSWORD 'use-a-strong-password';
CREATE DATABASE sriyaan_prod OWNER sriyaan;
SQL
```

### 3. Application

```bash
adduser --disabled-password --gecos "" sriyaan   # or use your user
su - sriyaan
git clone https://github.com/linux113/new-website.git app
cd app
cp .env.example .env    # then edit (see table below)
npm ci
npm run db:generate
npx prisma migrate deploy
npm run build
```

`.env` values:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://sriyaan:PASSWORD@127.0.0.1:5432/sriyaan_prod` |
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
npx prisma migrate deploy
npm run build
pm2 restart sriyaan
```

---

## Option B — Vercel (managed)

1. Create a PostgreSQL database (Neon, Supabase or Hostinger's managed
   PostgreSQL) and copy the connection string.
2. Import the GitHub repository at vercel.com.
3. Set the environment variables from the table above (build command is
   pre-wired via `npm run vercel-build`, which runs migrations, the
   deploy bootstrap and the production build).
4. Deploy, then point your domain's DNS at Vercel.

---

## Post-deploy checklist

- [ ] Public pages load (`/`, `/products`, `/quality`, `/contact`)
- [ ] `/admin/login` shows the login form (not the dashboard)
- [ ] Log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Admin → Settings: set social media URLs (they drive the footer icons)
- [ ] Admin → Enquiries: submit the public contact form and confirm it appears
- [ ] HTTPS certificate active
