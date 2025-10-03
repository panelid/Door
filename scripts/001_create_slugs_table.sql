-- Create slugs table to store all types of slugs
create table if not exists public.slugs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  slug text not null unique,
  type text not null check (type in ('whatsapp', 'paste', 'linktree', 'shorturl')),
  data jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create index for faster slug lookups
create index if not exists slugs_slug_idx on public.slugs(slug);
create index if not exists slugs_user_id_idx on public.slugs(user_id);

-- Enable Row Level Security
alter table public.slugs enable row level security;

-- RLS Policies for slugs table
-- Allow anyone to view slugs (for public access via slug)
create policy "slugs_select_all"
  on public.slugs for select
  using (true);

-- Allow users to insert their own slugs
create policy "slugs_insert_own"
  on public.slugs for insert
  with check (auth.uid() = user_id);

-- Allow users to update their own slugs
create policy "slugs_update_own"
  on public.slugs for update
  using (auth.uid() = user_id);

-- Allow users to delete their own slugs
create policy "slugs_delete_own"
  on public.slugs for delete
  using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger to automatically update updated_at
drop trigger if exists slugs_updated_at on public.slugs;
create trigger slugs_updated_at
  before update on public.slugs
  for each row
  execute function public.handle_updated_at();
