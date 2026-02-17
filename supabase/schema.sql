-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  college_name text,
  branch text,
  semester text,
  points integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- RESOURCES TABLE
create type resource_privacy as enum ('public', 'private');
create type resource_type_enum as enum ('Note', 'Paper', 'Assignment', 'Project', 'Other');

create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  file_url text not null,
  subject text,
  semester text,
  branch text,
  resource_type resource_type_enum default 'Note',
  year_batch text,
  privacy resource_privacy default 'public',
  uploader_id uuid references public.profiles(id) not null
);

-- RLS for Resources
alter table public.resources enable row level security;

create policy "Public resources are viewable by everyone."
  on resources for select
  using ( privacy = 'public' );

create policy "Authenticated users can upload resources."
  on resources for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update own resources."
  on resources for update
  using ( auth.uid() = uploader_id );

create policy "Users can delete own resources."
  on resources for delete
  using ( auth.uid() = uploader_id );

-- REVIEWS TABLE
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  resource_id uuid references public.resources(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Reviews
alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone."
  on reviews for select
  using ( true );

create policy "Authenticated users can create reviews."
  on reviews for insert
  with check ( auth.role() = 'authenticated' );

-- STORAGE BUCKET
-- Note: You have to create the bucket 'academic-resources' in the Supabase Dashboard > Storage
-- However, we can set up policies for it here if the bucket exists.

insert into storage.buckets (id, name, public) 
values ('academic-resources', 'academic-resources', true)
on conflict (id) do nothing;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'academic-resources' );

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'academic-resources' and auth.role() = 'authenticated' );

create policy "Users can update own files"
  on storage.objects for update
  using ( bucket_id = 'academic-resources' and auth.uid() = owner )
  with check ( bucket_id = 'academic-resources' and auth.uid() = owner );

create policy "Users can delete own files"
  on storage.objects for delete
  using ( bucket_id = 'academic-resources' and auth.uid() = owner );
