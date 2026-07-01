-- Migration: create products table
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

-- Keep updated_at current on every row update
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
