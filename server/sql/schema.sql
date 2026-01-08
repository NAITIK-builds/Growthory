-- Enable Vector Extension
create extension if not exists vector;

-- Drop existing trigger and functions to avoid "already exists" or type mismatch errors
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.match_startups(vector, float, int);
drop function if exists public.match_jobs(vector, float, int);

-- Users Table (Extends Supabase Auth)
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('founder', 'investor', 'professional')),
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Startups Table
create table if not exists public.startups (
  id uuid default gen_random_uuid() primary key,
  founder_id uuid references public.users not null,
  name text not null,
  tagline text,
  description_raw text,
  industry text,
  stage text,
  website text,
  logo_url text, -- optional DALL-E generated
  pitch_deck_url text,
  embedding vector(1536), -- for semantic search
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Startup Analysis (AI)
create table if not exists public.startup_analysis (
  id uuid default gen_random_uuid() primary key,
  startup_id uuid references public.startups on delete cascade not null,
  one_line_pitch text,
  strengths jsonb,
  weaknesses jsonb,
  suggestions jsonb,
  investor_appeal_score int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Investor Profiles
create table if not exists public.investor_profiles (
  id uuid references public.users not null primary key,
  ticket_size_min int,
  ticket_size_max int,
  interested_industries text[],
  interested_stages text[],
  bio text
);

-- Professional Profiles
create table if not exists public.professional_profiles (
  id uuid references public.users not null primary key,
  resume_url text,
  skills text[],
  experience_years int,
  parsed_resume_data jsonb
);

-- Job Listings
create table if not exists public.job_listings (
  id uuid default gen_random_uuid() primary key,
  startup_id uuid references public.startups not null,
  title text not null,
  description text,
  requirements text,
  salary_range text,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Matches / Recommendations
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  source_id uuid not null, -- Investor/Pro ID
  target_id uuid not null, -- Startup/Job ID
  match_type text check (match_type in ('investor_startup', 'candidate_job')),
  score float,
  reason text, -- AI explanation
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
drop policy if exists "Public profiles are viewable by everyone" on public.users;
create policy "Public profiles are viewable by everyone" on public.users for select using (true);

drop policy if exists "Users can insert their own profile" on public.users;
create policy "Users can insert their own profile" on public.users for insert with check (auth.uid() = id);

drop policy if exists "Founders can update own startups" on public.startups;
create policy "Founders can update own startups" on public.startups for update using (auth.uid() = founder_id);

drop policy if exists "Startups viewable by investors and candidates" on public.startups;
create policy "Startups viewable by investors and candidates" on public.startups for select using (true);

-- Function to handle new user signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Vector Match Function for Startups
create or replace function match_startups (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  tagline text,
  industry text,
  stage text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    startups.id,
    startups.name,
    startups.tagline,
    startups.industry,
    startups.stage,
    1 - (startups.embedding <=> query_embedding) as similarity
  from startups
  where 1 - (startups.embedding <=> query_embedding) > match_threshold
  order by startups.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Vector Match Function for Jobs
create or replace function match_jobs (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  startup_id uuid,
  title text,
  description text,
  salary_range text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    job_listings.id,
    job_listings.startup_id,
    job_listings.title,
    job_listings.description,
    job_listings.salary_range,
    1 - (job_listings.embedding <=> query_embedding) as similarity
  from job_listings
  where 1 - (job_listings.embedding <=> query_embedding) > match_threshold
  order by job_listings.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Startup Likes
create table if not exists public.startup_likes (
  id uuid default gen_random_uuid() primary key,
  startup_id uuid references public.startups on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(startup_id, user_id)
);

-- Startup Comments
create table if not exists public.startup_comments (
  id uuid default gen_random_uuid() primary key,
  startup_id uuid references public.startups on delete cascade not null,
  user_id uuid references public.users on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on new tables
alter table public.startup_likes enable row level security;
alter table public.startup_comments enable row level security;

create policy "Likes viewable by everyone" on public.startup_likes for select using (true);
create policy "Users can like" on public.startup_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on public.startup_likes for delete using (auth.uid() = user_id);

create policy "Comments viewable by everyone" on public.startup_comments for select using (true);
create policy "Users can comment" on public.startup_comments for insert with check (auth.uid() = user_id);
