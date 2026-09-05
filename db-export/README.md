# Database import

`sriyaan-full-import.sql` creates the entire database in one step.

## Import it

1. hPanel → **Databases → phpMyAdmin**, open `u391782884_sriyaanmetals`.
2. **Import** tab → **Choose File** → select `sriyaan-full-import.sql`.
3. Press **Go**.

Run it against an **empty** database. It creates 32 tables (InnoDB,
utf8mb4_unicode_ci), loads the starter catalogue and site content, and
creates one admin login.

## Admin login

| | |
| --- | --- |
| URL | `https://sriyaanmetals.com/admin/login` |
| Email | `admin@sriyaanmetals.com` |
| Password | `SriyaanAdmin2026!` |

**Change this password immediately after your first sign-in.** The
password is a bcrypt hash in the file, not plaintext, but it is
committed to the repository so treat it as public.

## What it contains

| Table | Rows |
| --- | --- |
| MediaAsset | 27 |
| SeoMeta | 10 |
| Category | 6 |
| Product | 11 |
| ProductImage | 11 |
| ProductSpecification | 26 |
| BlogCategory / BlogPost | 3 / 7 |
| Certification | 5 |
| Industry | 4 |
| InfrastructureItem | 2 |
| Capability | 3 |
| Customer | 6 |
| GlobalCountry | 5 |
| CompanyPage | 4 |
| WebsiteSetting | 23 |
| AdminUser | 1 |

All of it is editable from the admin panel.

## After importing

Set `DATABASE_URL` in `.env` on the server. If the site runs on the same
Hostinger machine, use `localhost` — no Remote MySQL entry needed:

```dotenv
DATABASE_URL="mysql://u391782884_sriyaan:YOURPASSWORD@localhost:3306/u391782884_sriyaanmetals"
```

Then confirm everything is wired up:

```bash
npm run db:check
```

It should report 32 tables and 1 admin. You do **not** need to run
migrations or seeds — this file already did both.

## Re-importing

The file has no `DROP TABLE` statements, so importing twice fails on
duplicate keys. To start over, drop all tables in phpMyAdmin
(**Check all → Drop**) and import again.
