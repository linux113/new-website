# Hostinger — MySQL database setup (step by step)

This guide sets up the MySQL database this site runs on, using
Hostinger's hPanel. Follow it top to bottom; it takes about 15 minutes.

You need a Hostinger plan that includes MySQL databases (Premium,
Business, or Cloud shared hosting, or a VPS). Every current shared plan
includes MySQL, so no add-on is required.

---

## Step 1 — Create the database and its user

1. Log in at <https://hpanel.hostinger.com> .
2. Pick your website, then open **Databases → Management**
   (on some plans it is listed as **MySQL Databases**).
3. In the **Create a New MySQL Database** box, fill in:
   - **Database name** — e.g. `sriyaan` (hPanel prefixes it automatically,
     so the real name becomes something like `u123456789_sriyaan`).
   - **Database username** — e.g. `sriyaan` (also prefixed →
     `u123456789_sriyaan`).
   - **Password** — click the generator and use a long random password.
4. Press **Create**.
5. **Copy all three values now** — full database name, full username, and
   the password. The password is not shown again.

The new user is automatically granted all privileges on that database,
which is what this app needs (it creates tables during migration).

---

## Step 2 — Note the database host

In **Databases → Management**, find your database in the **List of
Current MySQL Databases and Users** table.

- **App running on the same Hostinger hosting** → the host is
  `localhost`.
- **App running anywhere else** (a VPS, Vercel, your laptop) → you need
  the remote hostname, which looks like `mysql.hostinger.com` or an IP.
  Click the database's **⋮ → Manage** / **Enter phpMyAdmin** and read the
  server address, or open a support chat to confirm it for your account.

The port is always **3306** unless Hostinger tells you otherwise.

---

## Step 3 — Allow remote access (only if the app is NOT on Hostinger)

Skip this step entirely if the site runs on the same Hostinger hosting.

1. Go to **Databases → Remote MySQL**.
2. In **Add Remote MySQL Database**, choose your database.
3. Enter the **IP address** of the server that will connect.
   - Tick **Any Host** only for a quick test — it exposes the database to
     the whole internet. Replace it with a specific IP as soon as you can.
4. Click **Create**.

---

## Step 4 — Confirm the character set

This site stores product names, addresses and blog content that can
include symbols and non-Latin characters, so the database must be
`utf8mb4`.

1. Open **Databases → phpMyAdmin** and click **Enter phpMyAdmin** for
   your database.
2. Select your database in the left sidebar, open the **Operations** tab.
3. Under **Collation**, choose **`utf8mb4_unicode_ci`** and press **Go**.

Hostinger usually defaults to this already; setting it explicitly costs
nothing and avoids broken characters later.

---

## Step 5 — Build the connection string

The app reads a single environment variable, `DATABASE_URL`, in this
shape:

```
mysql://USERNAME:PASSWORD@HOST:3306/DATABASE
```

Using the example values from Step 1:

```
mysql://u123456789_sriyaan:YourPassword@localhost:3306/u123456789_sriyaan
```

**If your password contains special characters** (`@ : / ? # & %` etc.)
you must percent-encode them, or the URL will be parsed wrongly:

| Character | Use instead |
| --------- | ----------- |
| `@`       | `%40`       |
| `:`       | `%3A`       |
| `/`       | `%2F`       |
| `#`       | `%23`       |
| `?`       | `%3F`       |
| `&`       | `%26`       |
| `%`       | `%25`       |

The simplest fix is to regenerate a password using only letters and
digits.

---

## Step 6 — Add the environment variables

Create a `.env` file next to the app (or set these in your host's
environment-variables UI):

```dotenv
DATABASE_URL="mysql://u123456789_sriyaan:YourPassword@localhost:3306/u123456789_sriyaan"

# Session signing secret — generate with: openssl rand -base64 32
AUTH_SECRET="paste-a-long-random-string-here"

# The public origin of the site, used for absolute URLs and cookies
NEXT_PUBLIC_SITE_URL="https://sriyaanmetals.com"

# First admin account, created by the setup script in Step 8
ADMIN_EMAIL="admin@sriyaanmetals.com"
ADMIN_PASSWORD="a-strong-password-you-choose"
ADMIN_NAME="Admin"
```

Never commit this file — `.env` is already in `.gitignore`.

---

## Step 7 — Create the tables

From the project directory on the server:

```bash
npm ci
npm run db:generate
npm run db:migrate:apply
```

`db:migrate:apply` runs `prisma/migrations/…_initial_mysql_schema/migration.sql`,
which creates all 32 tables as InnoDB with `utf8mb4_unicode_ci`.

**If the CLI cannot reach the database from your shell** (common on
shared hosting, where outbound MySQL is restricted), load the SQL by hand
instead:

1. Open **phpMyAdmin** for your database.
2. Go to the **Import** tab.
3. Choose the file
   `prisma/migrations/20260905000000_initial_mysql_schema/migration.sql`.
4. Press **Import**.

---

## Step 8 — Create the admin login and seed content

```bash
npx tsx scripts/deploy-setup.ts
```

This creates the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

To also load the starter catalogue, categories and blog posts:

```bash
npm run db:seed
```

---

## Step 9 — Build, start, and verify

```bash
npm run build
npm start
```

Then check:

1. Open `https://sriyaanmetals.com/admin` → it should redirect you to
   `/admin/login`.
2. Log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
3. Go to **Settings → Contact**, change a phone number, press Save.
4. Open the public site — the new number should appear in the header,
   footer and contact page.

If that round trip works, the database is correctly wired.

---

## Troubleshooting

**`Access denied for user …`**
The username or password is wrong, or you left off the `u123456789_`
prefix. Copy the exact full username from hPanel.

**`Unknown database …`**
Same cause — use the prefixed database name, not the short one you typed
into the create form.

**`ECONNREFUSED` or a 10-second timeout**
The app is not on Hostinger and you skipped Step 3, or you used
`localhost` from a remote machine. Add your server's IP under
**Remote MySQL** and use the real hostname.

**`ER_TOO_MANY_USER_CONNECTIONS`**
Shared plans cap concurrent connections. Lower the pool:

```dotenv
DATABASE_CONNECTION_LIMIT=3
```

**Garbled accented characters**
The database or a table is not `utf8mb4`. Redo Step 4, then re-import.

**Backups**
Use **Databases → phpMyAdmin → Export** (Quick, SQL) before every
deployment, or enable Hostinger's automatic backups under
**Files → Backups**.
