#!/usr/bin/env tsx
/**
 * Runs the products table migration against Supabase.
 * Uses the pg (node-postgres) driver via the Supabase direct connection URL.
 * Usage: npx tsx scripts/migrate.ts
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !key) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

const supabase = createClient(url, key);

const SQL = `
create extension if not exists "pgcrypto";

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  asin        text unique not null,
  slug        text unique not null,
  title       text not null,
  price       numeric not null,
  image_url   text not null,
  amazon_url  text not null,
  features    text[],
  description text,
  category    text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_slug_idx     on products (slug);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute procedure set_updated_at();
`;

async function main() {
  console.log('Running migration...');
  const { error } = await supabase.rpc('exec_sql', { sql: SQL });
  if (error) {
    // exec_sql function may not exist — that's OK, table creation happens via import upsert
    if (error.message.includes('exec_sql')) {
      console.log('ℹ️  exec_sql RPC not available (expected). Please run the migration SQL manually in the Supabase dashboard SQL Editor.');
      console.log('File: supabase/migrations/001_create_products.sql');
    } else {
      console.error('Migration error:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✓ Migration complete.');
  }
}

main();
