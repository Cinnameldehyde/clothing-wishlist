-- ============================================================
-- Clothing Wishlist — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

create extension if not exists "uuid-ossp";

create table if not exists public.wishlist_items (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  platform        text not null default 'other',
  category        text not null default 'Regular top',
  status          text not null default 'Saved',
  product_url     text not null,
  hostname        text not null,
  price           numeric(10, 2),
  currency        text default 'INR',
  image_urls      text[] not null default '{}',
  brand           text,
  color           text,
  size            text,
  available_sizes text[],
  priority        text not null default 'Medium'
                  check (priority in ('Low', 'Medium', 'High')),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Prevent duplicate URLs per user
create unique index if not exists idx_wishlist_user_url
  on public.wishlist_items(user_id, product_url);

create index if not exists idx_wishlist_user_id
  on public.wishlist_items(user_id);

create index if not exists idx_wishlist_created_at
  on public.wishlist_items(created_at desc);

-- Row Level Security
alter table public.wishlist_items enable row level security;

create policy "Users can select own items"
  on public.wishlist_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own items"
  on public.wishlist_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own items"
  on public.wishlist_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own items"
  on public.wishlist_items for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at on every row change
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wishlist_items_updated_at on public.wishlist_items;
create trigger wishlist_items_updated_at
  before update on public.wishlist_items
  for each row execute procedure public.handle_updated_at();
