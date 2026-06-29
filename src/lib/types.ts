// ============================================================
// TypeScript interfaces for all database models
// ============================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  case_study: string | null;
  image_url: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  name: string;
  organization: string;
  date_achieved: string;
  image_url: string | null;
  verification_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  body: string;
  read: boolean;
  created_at: string;
}

// Form input types (for mutations)
export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type CertificateInput = Omit<Certificate, 'id' | 'created_at' | 'updated_at'>;
export type BlogPostInput = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
export type MessageInput = Pick<Message, 'name' | 'email' | 'body'>;

// Navigation
export interface NavItem {
  label: string;
  href: string;
}

// Timeline
export interface TimelineItem {
  year: string;
  title: string;
  institution: string;
  description: string;
  icon?: string;
}

// Experience
export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

// Skill
export interface Skill {
  name: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: Skill[];
}

// Stats
export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}
