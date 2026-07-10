-- ============================================================
-- PORTFOLIO CMS — SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor after creating your project
-- ============================================================

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

create or replace trigger on_auth_user_created
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
  content text not null,
  excerpt text,
  cover_image_url text,
  published boolean default false,
  reading_time integer default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.blog_posts enable row level security;

create policy "Published posts are viewable by everyone"
  on public.blog_posts for select using (published = true);

create policy "Admins can do everything on blog_posts"
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
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.messages enable row level security;

create policy "Anyone can insert messages"
  on public.messages for insert with check (true);

create policy "Admins can view messages"
  on public.messages for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update messages"
  on public.messages for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete messages"
  on public.messages for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

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
-- SEED DATA
-- ============================================================

-- Seed Projects
insert into public.projects (title, slug, description, case_study, tech_stack, github_url, featured, published, sort_order) values
(
  'Banking Transaction Monitor',
  'banking-transaction-monitor',
  'Automated real-time monitoring system that tracks transaction flows, detects anomalies, and triggers instant alerts for the banking operations team.',
  '## The Problem

In high-volume banking environments, thousands of transactions flow through the system every minute. Manual monitoring was error-prone, slow, and led to delayed incident detection — costing the organization both revenue and customer trust.

## Research & Discovery

I conducted stakeholder interviews with the operations team, analyzed 6 months of incident reports, and mapped the existing manual monitoring workflow. Key findings:

- **Average detection time**: 45 minutes (unacceptable for critical transactions)
- **False escalation rate**: 32% due to manual threshold checks
- **Root cause identification**: Often took 2+ hours

## Solution Architecture

Built an automated monitoring pipeline that:

1. **Ingests** transaction data from core banking APIs in real-time
2. **Analyzes** patterns using configurable threshold rules and statistical anomaly detection
3. **Alerts** the operations team via email and dashboard notifications within seconds
4. **Logs** all incidents with full context for root cause analysis

## Technical Implementation

- Python scripts for data ingestion and anomaly detection
- PostgreSQL for transaction logging and historical analysis
- SQL-based reporting dashboards for trend visualization
- Cron-based scheduling with error recovery mechanisms

## Results

- Reduced detection time from **45 minutes to under 2 minutes**
- Decreased false escalation rate to **8%**
- Saved the team approximately **15 hours/week** in manual monitoring effort
- Improved SLA compliance by **23%**',
  '{Python,SQL,PostgreSQL,Pandas,Automation}',
  'https://github.com/olatunbosun',
  true,
  true,
  1
),
(
  'Executive Power BI Dashboard Suite',
  'executive-power-bi-dashboard',
  'Interactive business intelligence dashboards providing real-time KPI tracking, trend analysis, and executive-level reporting for banking operations.',
  '## The Problem

Senior management relied on static Excel reports that were outdated by the time they reached decision-makers. There was no single source of truth for operational KPIs, and generating ad-hoc reports required significant manual effort from the analytics team.

## Research & Discovery

I facilitated workshops with department heads to identify the most critical metrics. Through affinity mapping and prioritization exercises, we narrowed down 25+ requested metrics to 12 core KPIs that truly drove business decisions.

## Solution

Designed and built a suite of interconnected Power BI dashboards:

- **Operations Overview**: Real-time transaction volumes, success rates, channel performance
- **Incident Management**: MTTR trends, root cause distribution, SLA compliance
- **Service Availability**: Uptime tracking across all banking channels
- **Executive Summary**: High-level scorecard with drill-down capability

## Technical Details

- Connected directly to PostgreSQL and SQL Server data sources
- Implemented DAX measures for complex YoY comparisons and rolling averages
- Used bookmarks and drillthrough pages for interactive exploration
- Scheduled refresh every 30 minutes via Power BI Gateway

## Impact

- Reduced report generation time from **2 days to real-time**
- Enabled data-driven decision making at the executive level
- Adopted by **4 departments** across the organization
- Became the official reporting standard for quarterly business reviews',
  '{Power BI,DAX,SQL,PostgreSQL,Data Modeling}',
  null,
  true,
  true,
  2
),
(
  'SQL Analytics & Reporting Engine',
  'sql-analytics-reporting-engine',
  'Advanced SQL-based analytics system for extracting actionable business insights from large-scale banking transaction datasets.',
  '## The Problem

The data team was spending 60% of their time writing repetitive SQL queries for ad-hoc report requests. There was no standardized query library, leading to inconsistent metrics across teams.

## Solution

Built a comprehensive SQL analytics framework:

- **Standardized query templates** for common business questions
- **Materialized views** for frequently accessed metrics
- **Stored procedures** for complex multi-step analyses
- **Documentation** with a query catalog and business glossary

## Key Analyses Built

1. Customer transaction pattern analysis (segmentation by volume, frequency, channel)
2. Service availability time-series analysis with anomaly detection
3. Revenue attribution modeling across product lines
4. Churn prediction feature engineering pipeline

## Results

- Reduced ad-hoc query turnaround from **4 hours to 15 minutes**
- Standardized 40+ business metrics across the organization
- Trained 6 team members on the query framework',
  '{SQL,PostgreSQL,Python,Data Analysis,ETL}',
  'https://github.com/olatunbosun',
  false,
  true,
  3
),
(
  'DevOps CLI Toolkit',
  'devops-cli-toolkit',
  'A collection of Go-based command-line tools for automating repetitive DevOps and data operations tasks.',
  '## The Problem

As I grew into building products, I found myself repeatedly performing the same operations: spinning up development environments, running database migrations, managing deployment configurations, and monitoring service health. These tasks were time-consuming and error-prone when done manually.

## Solution

Built a modular CLI toolkit in Go that automates common workflows:

- **db-migrate**: Database migration runner with rollback support
- **health-check**: Multi-service health monitoring with configurable alerts
- **env-setup**: Development environment bootstrapper
- **log-parser**: Structured log analysis and filtering tool

## Technical Highlights

- Written in Go for cross-platform compatibility and fast execution
- Uses Cobra for CLI framework and Viper for configuration management
- Comprehensive error handling with meaningful exit codes
- Unit tested with Go''s built-in testing framework

## Results

- Reduced environment setup time from **30 minutes to 2 minutes**
- Eliminated manual errors in database migration workflows
- Shared across the team — now used by **5 engineers** daily',
  '{Go,CLI,Cobra,PostgreSQL,DevOps}',
  'https://github.com/olatunbosun',
  false,
  true,
  4
);

-- Seed Certificates
insert into public.certificates (name, organization, date_achieved, verification_url, sort_order) values
('Introduction to Cybersecurity', 'Cisco Networking Academy', '2024-03-15', 'https://www.credly.com/', 1),
('SQL for Data Science', 'Coursera / UC Davis', '2023-11-20', 'https://www.coursera.org/', 2),
('Power BI Data Analyst Associate', 'Microsoft', '2024-01-10', 'https://learn.microsoft.com/', 3),
('Business Agility Foundation', 'ICAgile', '2023-08-05', 'https://www.icagile.com/', 4),
('Anti-Money Laundering (AML) Compliance', 'FITC Nigeria', '2023-06-18', 'https://www.fitc-ng.com/', 5);

-- Seed Blog Posts
insert into public.blog_posts (title, slug, content, excerpt, published, reading_time) values
(
  'How I Built FlowMart: From Idea to MVP',
  'how-i-built-flowmart',
  '# How I Built FlowMart: From Idea to MVP

The journey from identifying a market gap to shipping a working product taught me more about software engineering, product thinking, and resilience than any course ever could.

## The Spark

Working in banking operations, I noticed a recurring pattern: small and medium businesses in Nigeria struggled with inventory management. They relied on paper notebooks, WhatsApp messages, and memory. The result? Lost revenue, stockouts, and zero visibility into their business performance.

I thought: *What if I could build something simple enough for a shop owner in Oshodi Market, yet powerful enough to handle real business operations?*

That question became **FlowMart**.

## Defining the MVP

I started with user research — visiting markets, talking to shop owners, observing their workflows. Three core needs emerged:

1. **Inventory tracking** — Know what you have, what is running low
2. **Sales recording** — Track daily sales without manual calculations
3. **Basic reporting** — See weekly/monthly performance at a glance

I ruthlessly cut everything else. No AI recommendations. No multi-currency. No social features. Just the core.

## The Tech Stack Decision

After evaluating options, I settled on:

- **Next.js** — For the web application (SSR + API routes)
- **Go** — For performance-critical backend microservices
- **PostgreSQL** — Reliable, scalable, and I know it well
- **Paystack/Flutterwave** — Payment gateway integrations for Nigerian businesses
- **Supabase** — Authentication and real-time features

Why Go for the backend? Two reasons: I wanted to learn it deeply, and its concurrency model is perfect for handling multiple payment webhooks and inventory updates simultaneously.

## Building in Public

I made the deliberate choice to build in public on GitHub. Every commit, every design decision, every pivot — documented. This kept me accountable and attracted early feedback from other developers.

## Lessons Learned

1. **Start with the user, not the technology** — I spent more time in markets than in my code editor during week one
2. **Shipping beats perfection** — My first version had bugs. Users still found it valuable
3. **Product thinking > code** — The hardest problems were not technical; they were understanding what users actually needed vs. what they said they needed

## What is Next

FlowMart is currently in beta testing with 5 pilot stores. Next milestones:
- Mobile app (React Native)
- Multi-store management
- Supplier marketplace integration

*Building something from zero is the best education in tech. If you are thinking about it — just start.*',
  'The journey from identifying a market gap to shipping a working product taught me more about software engineering, product thinking, and resilience than any course ever could.',
  true,
  8
),
(
  '10 SQL Techniques Every Business Analyst Should Master',
  'sql-techniques-business-analysts',
  '# 10 SQL Techniques Every Business Analyst Should Master

SQL is not just a database language — it is the business analyst''s most powerful tool for turning raw data into actionable insights. After years of writing SQL in banking and analytics roles, here are the techniques that have made the biggest difference in my work.

## 1. Window Functions for Running Totals

```sql
SELECT 
  transaction_date,
  amount,
  SUM(amount) OVER (ORDER BY transaction_date) as running_total
FROM transactions
WHERE account_id = ''ACC001'';
```

Window functions let you perform calculations across rows without collapsing your result set. Running totals, moving averages, and rankings become trivial.

## 2. CTEs for Readable Complex Queries

```sql
WITH monthly_revenue AS (
  SELECT 
    DATE_TRUNC(''month'', created_at) as month,
    SUM(amount) as revenue
  FROM transactions
  GROUP BY 1
),
revenue_growth AS (
  SELECT 
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) as prev_month,
    ROUND(((revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month)) * 100, 2) as growth_pct
  FROM monthly_revenue
)
SELECT * FROM revenue_growth;
```

Common Table Expressions make complex queries self-documenting. Your future self will thank you.

## 3. CASE Statements for Business Logic

Transform raw data into business categories directly in your queries. Map transaction codes to human-readable labels. Create custom segments without touching application code.

## 4. Subqueries in WHERE Clauses

Filter your data using the results of another query. Find all customers whose transaction volume exceeds the average. Identify outliers dynamically.

## 5. GROUP BY with HAVING

Filter aggregated results — find product categories with declining sales, departments exceeding budget, or service channels with below-threshold performance.

## 6. Date Functions for Time Intelligence

Master DATE_TRUNC, EXTRACT, and interval arithmetic. Year-over-year comparisons, cohort analysis, and seasonal pattern detection all depend on date manipulation.

## 7. LEFT JOINs for Finding Missing Data

Use LEFT JOINs with NULL checks to find what is missing: customers who have not transacted, products never ordered, services not used.

## 8. String Functions for Data Cleaning

TRIM, UPPER, REGEXP_REPLACE — data is never clean. Build cleaning steps into your query pipeline.

## 9. EXPLAIN ANALYZE for Performance

Before running a heavy query on production data, understand its execution plan. Index usage, sequential scans, and join strategies all impact whether your query takes 2 seconds or 2 hours.

## 10. Materialized Views for Repeated Reports

If stakeholders request the same report weekly, materialize it. Pre-computed results that refresh on schedule save everyone time.

---

*SQL mastery is not about memorizing syntax — it is about knowing which tool to reach for when facing a business question. Practice these techniques on real datasets, and you will become the analyst everyone wants on their team.*',
  'After years of writing SQL in banking and analytics roles, here are the 10 techniques that made the biggest difference.',
  true,
  10
),
(
  'How AI is Reshaping the Business Analyst Role',
  'ai-reshaping-business-analyst-role',
  '# How AI is Reshaping the Business Analyst Role

The rise of AI tools — from ChatGPT to GitHub Copilot to automated analytics platforms — has sparked a common fear: *Will AI replace business analysts?*

Having worked at the intersection of business analysis, data analytics, and product development, my answer is nuanced: **AI will not replace business analysts. But business analysts who use AI will replace those who do not.**

## What AI Does Well

- **Pattern recognition at scale**: AI can analyze millions of data points and surface patterns that would take humans weeks to find
- **Report generation**: Natural language queries can now generate SQL, build dashboards, and summarize findings
- **Automation**: Repetitive data cleaning, formatting, and basic analysis tasks are increasingly automated

## What AI Cannot Do (Yet)

- **Understand business context**: AI does not know your organization''s politics, culture, or strategic priorities
- **Stakeholder management**: Building trust, facilitating workshops, and navigating conflicting requirements is deeply human
- **Ethical judgment**: Deciding what *should* be built vs. what *can* be built requires values and empathy
- **Creative problem framing**: The most valuable BA skill — reframing a stakeholder''s stated problem into the actual underlying need

## The New BA Skill Stack

The modern business analyst needs to add AI literacy to their toolkit:

1. **Prompt engineering**: Knowing how to ask AI the right questions to get useful outputs
2. **AI output validation**: Critically evaluating AI-generated analysis for accuracy and bias
3. **Tool integration**: Using AI assistants alongside traditional BA tools (Jira, Figma, SQL, Power BI)
4. **Process redesign**: Identifying which parts of your workflow can be augmented by AI

## My Approach

I use AI as a **force multiplier**, not a replacement:

- **Code generation**: GitHub Copilot helps me write boilerplate SQL and Python faster
- **Research synthesis**: AI summarizes lengthy reports and extracts key findings
- **Documentation**: AI drafts initial BRDs and user stories that I refine with domain knowledge
- **Learning**: AI explains unfamiliar technical concepts in business-friendly language

## The Bottom Line

The business analysts who thrive in the AI era will be those who combine deep business understanding with technical fluency and AI literacy. The role is not disappearing — it is evolving. And for those willing to evolve with it, the opportunities have never been greater.

*Invest in understanding AI. But invest even more in the uniquely human skills that make you irreplaceable: empathy, judgment, communication, and creative problem-solving.*',
  'AI will not replace business analysts. But business analysts who use AI will replace those who do not.',
  true,
  7
);

-- ============================================================
-- STORAGE BUCKETS (Run these separately or via Supabase dashboard)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('certificates', 'certificates', true);
-- insert into storage.buckets (id, name, public) values ('projects', 'projects', true);
-- insert into storage.buckets (id, name, public) values ('blog', 'blog', true);

-- ============================================================
-- 6. SITE SETTINGS TABLE (Single Row)
-- ============================================================
create table if not exists public.site_settings (
  id text primary key default 'default',
  -- Site config
  site_name text not null default 'Olatunbosun Olalekan',
  site_title text not null default 'Olatunbosun Olalekan — Business Analyst | Data Analyst | Product Builder',
  site_description text not null default 'I transform business problems into scalable digital solutions using data, technology, and product thinking.',
  site_url text not null default 'https://olatunbosun.dev',
  email text not null default 'Nanicomlekan111@gmail.com',
  linkedin_url text not null default 'https://linkedin.com/in/olatunbosun-olalekan',
  github_url text not null default 'https://github.com/olatunbosun',
  resume_url text not null default '/resume.pdf',
  is_open_to_opportunities boolean not null default true,
  location_display text not null default 'Lagos, Nigeria',
  
  -- Hero config
  hero_greeting text not null default 'Hi, I''m',
  hero_name text not null default 'OLATUNBOSUN OLALEKAN',
  hero_roles text[] not null default '{"Business Analyst", "Data Analyst", "Business Intelligence Analyst", "Product Builder"}',
  hero_summary text not null default 'I transform business problems into scalable digital solutions using data, technology, and product thinking.',
  hero_cta_primary text not null default 'View My Work',
  hero_cta_secondary text not null default 'Download Resume',
  
  -- About story config
  about_story text not null default 'I started my career in banking operations, where I learned the art of precision, attention to detail, and high-stakes problem solving. Every day, I monitored thousands of transactions in real-time, investigated incidents, and communicated with stakeholders across multiple departments.

But I wanted to do more than observe — I wanted to build. That drive led me to learn SQL and Power BI, which transformed my approach to operations. Instead of reacting to problems, I started predicting them. Instead of manual reports, I built automated dashboards that leadership relied on daily.

Then I discovered programming. Python for automation. Go for performance. Next.js for the web. Each tool expanded what I could build and the impact I could have.

Today, I''m building **FlowMart** — an inventory and sales management platform for small businesses in Nigeria. It combines everything I''ve learned: understanding real business problems, analyzing data to validate solutions, and engineering products that people actually use.

I believe the best technologists are those who understand the business deeply enough to know what to build, and have the technical skill to build it well. That intersection — where business meets technology — is where I live.',
  
  -- Flowmart config
  flowmart_tagline text not null default 'Simplifying Commerce for African Businesses',
  flowmart_headline text not null default 'FlowMart',
  flowmart_subheadline text not null default 'An inventory and sales management platform built for small and medium businesses in Nigeria.',
  flowmart_vision text not null default 'To empower every small business owner in Africa with the digital tools they need to manage, grow, and scale their operations — without needing technical expertise.',
  flowmart_mission text not null default 'Build simple, affordable, and reliable business management software that works for the market trader in Oshodi just as well as it does for the boutique owner in Lekki.',
  flowmart_problem_title text not null default 'The Problem',
  flowmart_problem_description text not null default 'Over 40 million MSMEs in Nigeria manage their inventory with paper notebooks, WhatsApp messages, and memory. This leads to stockouts, revenue leakage, inaccurate financial records, and the inability to make data-driven decisions.',
  flowmart_problem_painpoints text[] not null default '{"No visibility into stock levels — stockouts happen without warning", "Manual sales tracking leads to revenue leakage and discrepancies", "Impossible to generate financial records for loan applications or growth planning", "Existing solutions are too complex, too expensive, or designed for enterprise markets"}',
  flowmart_tech_stack text[] not null default '{"Next.js", "Go", "PostgreSQL", "Supabase", "Paystack", "Flutterwave", "Docker", "GitHub Actions"}',
  flowmart_role_title text not null default 'Product Builder & Lead Developer',
  flowmart_role_description text not null default 'As the sole builder, I wear multiple hats: product manager, designer, frontend engineer, backend engineer, and business strategist. I define the roadmap, design the UX, architect the system, write the code, and talk to users — every single day.',
  flowmart_user_journey jsonb not null default '[{"step": "Sign Up", "description": "Business owner creates an account in under 60 seconds"}, {"step": "Add Inventory", "description": "Upload products with names, prices, quantities, and categories"}, {"step": "Record Sales", "description": "Log sales with a single tap — inventory updates automatically"}, {"step": "Track Performance", "description": "View daily, weekly, and monthly reports on a clean dashboard"}, {"step": "Grow", "description": "Use insights to restock smartly, identify top sellers, and plan for growth"}]'::jsonb,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint only_one_row check (id = 'default')
);

-- RLS for site_settings
alter table public.site_settings enable row level security;

create policy "Site settings are viewable by everyone"
  on public.site_settings for select using (true);

create policy "Admins can update site settings"
  on public.site_settings for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

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
  suffix text not null default '',
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
