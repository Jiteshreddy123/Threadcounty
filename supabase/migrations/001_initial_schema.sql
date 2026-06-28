-- ThreadCounty database schema
-- Run this in your Supabase SQL Editor to enable full features + Realtime

-- Profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can upsert own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Analyses table (powers History + Realtime)
create table if not exists public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  image_url text not null,
  file_name text not null,
  warp_count integer,
  weft_count integer,
  thread_density integer,
  fabric_type text,
  confidence numeric,
  status text default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz default now()
);

alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can update own analyses"
  on public.analyses for update
  using (auth.uid() = user_id or user_id is null);

create policy "Users can delete own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- Enable Realtime for instant History updates
alter publication supabase_realtime add table public.analyses;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Contact messages table (stores form submissions from /contact)
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text,
  email text not null,
  subject text default 'General Inquiry',
  message text not null,
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

-- Anyone can submit a contact message (including unauthenticated users)
create policy "Anyone can insert contact messages"
  on public.contact_messages for insert
  with check (true);

-- Only service role (admin) can read contact messages
create policy "Service role can read contact messages"
  on public.contact_messages for select
  using (auth.role() = 'service_role');

