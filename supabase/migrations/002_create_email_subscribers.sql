create table if not exists email_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists email_subscribers_created_at_idx on email_subscribers (created_at desc);
