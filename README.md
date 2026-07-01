# Best Catnip — Setup Guide

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Wait for the database to be provisioned (~1 minute).

## 2. Run the database migration

In the Supabase dashboard → **SQL Editor**, paste and run the contents of:

```
supabase/migrations/001_create_products.sql
```

This creates the `products` table, indexes, and an `updated_at` trigger.

## 3. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

Find your keys in the Supabase dashboard under **Project Settings → API**:

| Variable | Where to find it |
|---|---|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret (never expose in browser) |
| `NEXT_PUBLIC_SUPABASE_URL` | Same as `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` public key |

**Never commit `.env.local` to git.** It's already in `.gitignore`.

## 4. Fill in the product CSV

Edit `data/products.csv`. Columns:

| Column | Required | Notes |
|---|---|---|
| `asin` | ✅ | Unique Amazon product ID, used as upsert key |
| `title` | ✅ | Full product name |
| `category` | ✅ | e.g. `catnip`, `toys`, `treats` |
| `price` | ✅ | Numeric, e.g. `9.99` |
| `image_url` | ✅ | Direct image URL |
| `amazon_url` | ✅ | Full Amazon URL with your affiliate tag |
| `features` | | Pipe-separated list, e.g. `100% organic\|No additives` |
| `description` | | Plain text product description |
| `slug` | | URL slug — auto-generated from title if blank |

## 5. Run the importer

```bash
# Install dotenv CLI once if needed: npm install -g dotenv-cli
dotenv -e .env.local -- npm run import

# Or with a custom CSV path:
dotenv -e .env.local -- npx tsx scripts/import.ts path/to/other.csv
```

The importer will print a report:

```
Parsed 12 row(s) from data/products.csv

──────────────────────────────────────────────────
  Inserted : 10
  Updated  : 2
  Skipped  : 0
──────────────────────────────────────────────────
Done.
```

**Re-running is safe** — existing rows are updated (upsert on `asin`), new rows are inserted.

## 6. Start the dev server

```bash
npm run dev
```

## 7. Re-importing after CSV changes

Simply re-run step 5. Existing products are updated; new rows are inserted; nothing is deleted.

To force the Next.js cache to pick up changes immediately (without waiting for the 1-hour ISR window), call `revalidateTag('products')` from a route handler, or redeploy.
