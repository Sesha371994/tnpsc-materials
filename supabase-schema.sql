-- Run this whole file in Supabase Dashboard -> SQL Editor -> New query -> Run

-- 1. Profiles table (one row per user, linked to Supabase auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  is_admin boolean not null default false,
  is_premium boolean not null default false, -- unused until payments go live
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are viewable by authenticated users"
  on profiles for select
  to authenticated
  using (true);

create policy "users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- 2. Categories table
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

alter table categories enable row level security;

create policy "categories are viewable by authenticated users"
  on categories for select
  to authenticated
  using (true);

insert into categories (name, slug) values
  ('TET Paper 1', 'tet-paper-1'),
  ('TET Paper 2', 'tet-paper-2'),
  ('TNPSC Group 1', 'tnpsc-group-1'),
  ('TNPSC Group 2', 'tnpsc-group-2'),
  ('TNPSC Group 4', 'tnpsc-group-4'),
  ('General Tamil', 'general-tamil'),
  ('General English', 'general-english'),
  ('General Studies', 'general-studies'),
  ('Aptitude', 'aptitude'),
  ('Current Affairs', 'current-affairs')
on conflict (slug) do nothing;

-- 3. Materials table (metadata for every uploaded file)
create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category_id uuid not null references categories(id) on delete cascade,
  file_type text not null check (file_type in ('pdf', 'word', 'image')),
  file_path text not null,
  is_premium boolean not null default false, -- unused until payments go live
  created_at timestamptz not null default now()
);

alter table materials enable row level security;

create policy "materials are viewable by authenticated users"
  on materials for select
  to authenticated
  using (true);

create policy "only admins can insert materials"
  on materials for insert
  to authenticated
  with check (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "only admins can delete materials"
  on materials for delete
  to authenticated
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- 4. Storage bucket + policies
-- Create the bucket first from Dashboard -> Storage -> "New bucket" -> name: materials -> Private
-- Then run the policies below.

create policy "authenticated users can read materials files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'materials');

create policy "only admins can upload materials files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'materials'
    and exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "only admins can delete materials files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'materials'
    and exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- 5. After you sign up your own account through the app, run this to make
--    yourself an admin (replace with your chosen username):
-- update profiles set is_admin = true where username = 'your_username_here';
