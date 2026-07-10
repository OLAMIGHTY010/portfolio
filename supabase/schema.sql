
-- ============================================================
-- PORTFOLIO CMS — SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor after creating your project
-- ============================================================

-- ============================================================
-- 0. CLEANUP (Drop existing tables to prevent "already exists" errors)
-- ============================================================
drop table if exists public.profiles cascade;
drop table if exists public.projects cascade;
drop table if exists public.certificates cascade;
drop table if exists public.blog_posts cascade;
drop table if exists public.messages cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.stats cascade;
drop table if exists public.timeline cascade;
drop table if exists public.experiences cascade;
drop table if exists public.skill_categories cascade;

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES TABLE (linked to Supabase Auth)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text default 'user' check (role in ('admin', 'user')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Admins can do everything on profiles"
  on public.profiles for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists before recreating
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. PROJECTS TABLE
-- ============================================================
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text not null,
  case_study text,
  image_url text,
  tech_stack text[] default '{}',
  github_url text,
  live_url text,
  featured boolean default false,
  published boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.projects enable row level security;

create policy "Published projects are viewable by everyone"
  on public.projects for select using (published = true);

create policy "Admins can do everything on projects"
  on public.projects for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- 3. CERTIFICATES TABLE
-- ============================================================
create table if not exists public.certificates (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  organization text not null,
  date_achieved date not null,
  image_url text,
  verification_url text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.certificates enable row level security;

create policy "Certificates are viewable by everyone"
  on public.certificates for select using (true);

create policy "Admins can do everything on certificates"
  on public.certificates for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- 4. BLOG POSTS TABLE
-- ============================================================
create table if not exists public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  cover_image text,
  tags text[] default '{}',
  published boolean default true,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.blog_posts enable row level security;

create policy "Published blog posts viewable by everyone"
  on public.blog_posts for select using (published = true);

create policy "Admins can do everything on blog posts"
  on public.blog_posts for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- 5. MESSAGES TABLE (Contact Form)
-- ============================================================
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.messages enable row level security;

create policy "Anyone can insert messages"
  on public.messages for insert with check (true);

create policy "Only admins can view messages"
  on public.messages for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update messages"
  on public.messages for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete messages"
  on public.messages for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- AUTO-UPDATE UPDATED_AT TIMESTAMP
-- ============================================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing triggers if they exist
drop trigger if exists update_projects_updated_at on public.projects;
drop trigger if exists update_certificates_updated_at on public.certificates;
drop trigger if exists update_blog_posts_updated_at on public.blog_posts;
drop trigger if exists update_profiles_updated_at on public.profiles;

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_updated_at_column();

create trigger update_certificates_updated_at
  before update on public.certificates
  for each row execute procedure public.update_updated_at_column();

create trigger update_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute procedure public.update_updated_at_column();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();


-- ============================================================
-- 6. SITE SETTINGS TABLE
-- ============================================================
create table if not exists public.site_settings (
  id text primary key default 'default',
  site_name text default 'Your Name',
  site_title text default 'Full Stack Developer & Business Analyst',
  site_description text default 'Welcome to my professional portfolio',
  site_url text default 'https://yourwebsite.com',
  github_url text default 'https://github.com/yourusername',
  linkedin_url text default 'https://linkedin.com/in/yourusername',
  twitter_url text default 'https://twitter.com/yourusername',
  email text default 'contact@yourwebsite.com',
  is_open_to_work boolean default true,
  about_text text default 'I am a passionate professional...',
  hero_image_url text,
  about_image_url text,
  theme_color text default '#0ea5e9',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for site settings
alter table public.site_settings enable row level security;

create policy "Site settings are viewable by everyone"
  on public.site_settings for select using (true);

create policy "Admins can do everything on site settings"
  on public.site_settings for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop trigger if exists update_site_settings_updated_at on public.site_settings;
create trigger update_site_settings_updated_at
  before update on public.site_settings
  for each row execute procedure public.update_updated_at_column();

-- ============================================================
-- 7. STATS TABLE
-- ============================================================
create table if not exists public.stats (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  value integer not null,
  suffix text default '+',
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for stats
alter table public.stats enable row level security;

create policy "Stats are viewable by everyone"
  on public.stats for select using (true);

create policy "Admins can do everything on stats"
  on public.stats for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop trigger if exists update_stats_updated_at on public.stats;
create trigger update_stats_updated_at
  before update on public.stats
  for each row execute procedure public.update_updated_at_column();

-- ============================================================
-- 8. TIMELINE TABLE (Milestones)
-- ============================================================
create table if not exists public.timeline (
  id uuid default uuid_generate_v4() primary key,
  year text not null,
  title text not null,
  institution text not null,
  description text not null,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for timeline
alter table public.timeline enable row level security;

create policy "Timeline is viewable by everyone"
  on public.timeline for select using (true);

create policy "Admins can do everything on timeline"
  on public.timeline for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop trigger if exists update_timeline_updated_at on public.timeline;
create trigger update_timeline_updated_at
  before update on public.timeline
  for each row execute procedure public.update_updated_at_column();

-- ============================================================
-- 9. EXPERIENCES TABLE
-- ============================================================
create table if not exists public.experiences (
  id uuid default uuid_generate_v4() primary key,
  role text not null,
  company text not null,
  period text not null,
  location text not null,
  description text not null,
  responsibilities text[] default '{}',
  technologies text[] default '{}',
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for experiences
alter table public.experiences enable row level security;

create policy "Experiences are viewable by everyone"
  on public.experiences for select using (true);

create policy "Admins can do everything on experiences"
  on public.experiences for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop trigger if exists update_experiences_updated_at on public.experiences;
create trigger update_experiences_updated_at
  before update on public.experiences
  for each row execute procedure public.update_updated_at_column();

-- ============================================================
-- 10. SKILL CATEGORIES TABLE
-- ============================================================
create table if not exists public.skill_categories (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  skill_names text[] default '{}',
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS for skill_categories
alter table public.skill_categories enable row level security;

create policy "Skill categories are viewable by everyone"
  on public.skill_categories for select using (true);

create policy "Admins can do everything on skill_categories"
  on public.skill_categories for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop trigger if exists update_skill_categories_updated_at on public.skill_categories;
create trigger update_skill_categories_updated_at
  before update on public.skill_categories
  for each row execute procedure public.update_updated_at_column();


-- ============================================================
-- SEED DATA FOR NEW TABLES
-- ============================================================

-- Seed Site Settings (ensure single default row exists)
insert into public.site_settings (id) values ('default')
on conflict (id) do nothing;

-- Seed Stats
insert into public.stats (label, value, suffix, sort_order) values
('Years of Experience', 5, '+', 1),
('Projects Completed', 12, '+', 2),
('Technologies', 15, '+', 3),
('Certifications', 8, '+', 4)
on conflict do nothing;

-- Seed Timeline
insert into public.timeline (year, title, institution, description, sort_order) values
('2012', 'Primary Education', 'Complete Child Academy', 'Foundation years where curiosity and problem-solving skills were first nurtured.', 1),
('2015', 'Secondary Education', 'Owo High School', 'Developed strong analytical thinking and a passion for mathematics and science.', 2),
('2019', 'Higher National Diploma', 'Rufus Giwa Polytechnic', 'Studied Computer Science, building a solid foundation in programming, databases, and systems thinking.', 3),
('2022', 'Tech Fellowship', 'Learn2Earn Fellowship', 'Intensive program focused on practical tech skills, business analysis, and professional development.', 4),
('2023', 'Professional Deployment', 'NJFP — Marina, Lagos', 'Deployed as a Service Monitoring Officer in the banking sector, handling real-time transaction monitoring and incident management.', 5)
on conflict do nothing;

-- Seed Experiences
insert into public.experiences (role, company, period, location, description, responsibilities, technologies, sort_order) values
(
  'Service Monitoring Officer',
  'Banking Operations — Marina, Lagos',
  '2023 — Present',
  'Lagos, Nigeria',
  'Responsible for real-time monitoring of banking transactions, incident management, root cause analysis, and ensuring service availability across all channels.',
  array[
    'Monitor real-time transaction flows across all banking channels (Mobile, USSD, Web, ATM, POS) to ensure service availability and performance',
    'Detect, escalate, and manage incidents using structured escalation protocols, reducing mean time to resolution (MTTR)',
    'Conduct root cause analysis (RCA) for service disruptions and document findings for post-incident reviews',
    'Communicate with cross-functional stakeholders including engineering, operations, and management during critical incidents',
    'Generate daily, weekly, and monthly service availability and performance reports for senior management',
    'Maintain and improve monitoring dashboards using SQL queries and Power BI visualizations',
    'Implement proactive monitoring alerts and threshold configurations to prevent incidents before they impact customers',
    'Collaborate with the engineering team on system reliability improvements based on incident trends and pattern analysis'
  ],
  array[
    'SQL',
    'Power BI',
    'Python',
    'Excel',
    'Jira',
    'Grafana',
    'Transaction Monitoring Systems'
  ],
  1
)
on conflict do nothing;

-- Seed Skill Categories
insert into public.skill_categories (title, description, skill_names, sort_order) values
(
  'Business Analysis',
  'Bridging the gap between business needs and technical solutions',
  array[
    'Requirements Gathering',
    'Stakeholder Management',
    'Process Mapping (BPMN)',
    'User Stories & Acceptance Criteria',
    'Business Case Development',
    'Gap Analysis',
    'Agile/Scrum Methodology',
    'Data-Driven Decision Making'
  ],
  1
),
(
  'Data Analytics',
  'Turning raw data into actionable business intelligence',
  array[
    'SQL (PostgreSQL, MySQL)',
    'Power BI',
    'Python (Pandas, NumPy)',
    'Data Modeling',
    'ETL Pipelines',
    'Statistical Analysis',
    'Data Visualization',
    'Excel Advanced Analytics'
  ],
  2
),
(
  'Development',
  'Building products from concept to deployment',
  array[
    'TypeScript / JavaScript',
    'Go (Golang)',
    'Python',
    'Next.js / React',
    'Node.js',
    'PostgreSQL',
    'REST APIs',
    'Git & GitHub'
  ],
  3
),
(
  'Tools & Platforms',
  'Professional tools that power my daily workflow',
  array[
    'Jira',
    'Figma',
    'VS Code',
    'Postman',
    'Supabase',
    'Vercel',
    'Power BI Desktop',
    'Confluence'
  ],
  4
)
on conflict do nothing;

