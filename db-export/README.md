# Database import

Two files. Pick one:

| File | Use when |
| --- | --- |
| `sriyaan-full-import.sql` | The database is **empty**. |
| `sriyaan-reset-and-import.sql` | The database **already has tables** — e.g. you got `#1050 Table already exists`. Drops everything first, then imports. |

Both produce exactly the same end state.

## Check you have the current file

Both files start with a `FILE VERSION:` line. Open the `.sql` in a text
editor and confirm it says **v3**. If it does not, you are importing a
cached download — re-download it.

The `contact.address` row is the quickest tell. In v3 it looks like
`CONVERT(0x22466C6F... USING utf8mb4)`. If you can read the address as
plain text with `\n` in it, that is an older file and it will fail with
`#4025`.

## If you saw "#1050 - Table 'SeoMeta' already exists"

A previous import stopped partway and left tables behind. Use
`sriyaan-reset-and-import.sql` — it drops all 32 tables before
recreating them, so it works on a half-finished database and can be
re-run safely.

**It deletes everything in the database.** If you already have real
enquiries or admin edits, back up first: phpMyAdmin -> Export -> Go.

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
