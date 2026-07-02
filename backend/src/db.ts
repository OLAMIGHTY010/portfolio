import { supabase, isPlaceholderConfig } from "./supabase";
import {
  SITE_CONFIG,
  HERO,
  STATS,
  ABOUT_STORY,
  TIMELINE,
  EXPERIENCES,
  SKILL_CATEGORIES,
  FLOWMART,
} from "./constants";
import type {
  Project,
  Certificate,
  BlogPost,
  Message,
  ProjectInput,
  CertificateInput,
  BlogPostInput,
  MessageInput,
} from "./types";
import crypto from "crypto";

// ============================================================
// Types
// ============================================================
export interface SiteSettings {
  site_name: string;
  site_title: string;
  site_description: string;
  site_url: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
  is_open_to_opportunities: boolean;
  location_display: string;
  avatar_url: string;

  hero_greeting: string;
  hero_name: string;
  hero_roles: string[];
  hero_summary: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;

  about_story: string;

  flowmart_tagline: string;
  flowmart_headline: string;
  flowmart_subheadline: string;
  flowmart_vision: string;
  flowmart_mission: string;
  flowmart_problem_title: string;
  flowmart_problem_description: string;
  flowmart_problem_painpoints: string[];
  flowmart_tech_stack: string[];
  flowmart_role_title: string;
  flowmart_role_description: string;
  flowmart_user_journey: Array<{ step: string; description: string }>;
}

export interface DBStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
}

export interface DBTimelineItem {
  id: string;
  year: string;
  title: string;
  institution: string;
  description: string;
  sort_order: number;
}

export interface DBExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  sort_order: number;
}

export interface DBSkillCategory {
  id: string;
  title: string;
  description: string;
  skill_names: string[];
  sort_order: number;
}

// ============================================================
// Default / Fallback In-Memory Storage
// ============================================================
const DEFAULT_SETTINGS: SiteSettings = {
  site_name: SITE_CONFIG.name,
  site_title: SITE_CONFIG.title,
  site_description: SITE_CONFIG.description,
  site_url: SITE_CONFIG.url,
  email: SITE_CONFIG.links.email,
  linkedin_url: SITE_CONFIG.links.linkedin,
  github_url: SITE_CONFIG.links.github,
  resume_url: "/resume.pdf",
  is_open_to_opportunities: true,
  location_display: "Lagos, Nigeria",
  avatar_url: "",

  hero_greeting: HERO.greeting,
  hero_name: HERO.name,
  hero_roles: HERO.roles,
  hero_summary: HERO.summary,
  hero_cta_primary: HERO.ctaPrimary,
  hero_cta_secondary: HERO.ctaSecondary,

  about_story: ABOUT_STORY,

  flowmart_tagline: FLOWMART.tagline,
  flowmart_headline: FLOWMART.headline,
  flowmart_subheadline: FLOWMART.subheadline,
  flowmart_vision: FLOWMART.vision,
  flowmart_mission: FLOWMART.mission,
  flowmart_problem_title: FLOWMART.problem.title,
  flowmart_problem_description: FLOWMART.problem.description,
  flowmart_problem_painpoints: FLOWMART.problem.painPoints,
  flowmart_tech_stack: FLOWMART.techStack,
  flowmart_role_title: FLOWMART.role.title,
  flowmart_role_description: FLOWMART.role.description,
  flowmart_user_journey: FLOWMART.userJourney,
};

const DEFAULT_STATS: DBStat[] = STATS.map((stat, index) => ({
  id: `default-${index}`,
  label: stat.label,
  value: stat.value,
  suffix: stat.suffix,
  sort_order: index + 1,
}));

const DEFAULT_TIMELINE: DBTimelineItem[] = TIMELINE.map((item, index) => ({
  id: `default-${index}`,
  year: item.year,
  title: item.title,
  institution: item.institution,
  description: item.description,
  sort_order: index + 1,
}));

const DEFAULT_EXPERIENCES: DBExperience[] = EXPERIENCES.map((exp, index) => ({
  id: `default-${index}`,
  role: exp.role,
  company: exp.company,
  period: exp.period,
  location: exp.location,
  description: exp.description,
  responsibilities: exp.responsibilities,
  technologies: exp.technologies,
  sort_order: index + 1,
}));

const DEFAULT_SKILL_CATEGORIES: DBSkillCategory[] = SKILL_CATEGORIES.map((cat, index) => ({
  id: `default-${index}`,
  title: cat.title,
  description: cat.description,
  skill_names: cat.skills.map((s) => s.name),
  sort_order: index + 1,
}));

// In-memory collections for fallback mode
const inMemoryStore = {
  settings: { ...DEFAULT_SETTINGS },
  stats: [...DEFAULT_STATS],
  timeline: [...DEFAULT_TIMELINE],
  experiences: [...DEFAULT_EXPERIENCES],
  skills: [...DEFAULT_SKILL_CATEGORIES],
  projects: [] as Project[],
  certificates: [] as Certificate[],
  blog: [] as BlogPost[],
  messages: [] as Message[],
};

// ============================================================
// Database API Methods
// ============================================================

// --- SITE SETTINGS ---
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isPlaceholderConfig()) {
    return inMemoryStore.settings;
  }
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }
    return data;
  } catch (err) {
    console.error("Error fetching settings from Supabase:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  if (isPlaceholderConfig()) {
    inMemoryStore.settings = { ...inMemoryStore.settings, ...settings };
    return inMemoryStore.settings;
  }
  const { data, error } = await supabase
    .from("site_settings")
    .update(settings)
    .eq("id", "default")
    .select()
    .single();

  if (error) throw error;
  return data;
}

// --- STATS ---
export async function getStats(): Promise<DBStat[]> {
  if (isPlaceholderConfig()) {
    return inMemoryStore.stats.sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createStat(stat: Omit<DBStat, "id">): Promise<DBStat> {
  if (isPlaceholderConfig()) {
    const newStat: DBStat = { ...stat, id: crypto.randomUUID() };
    inMemoryStore.stats.push(newStat);
    return newStat;
  }
  const { data, error } = await supabase
    .from("stats")
    .insert([stat])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStat(id: string, stat: Partial<DBStat>): Promise<DBStat> {
  if (isPlaceholderConfig()) {
    const index = inMemoryStore.stats.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Stat not found");
    inMemoryStore.stats[index] = { ...inMemoryStore.stats[index], ...stat };
    return inMemoryStore.stats[index];
  }
  const { data, error } = await supabase
    .from("stats")
    .update(stat)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStat(id: string): Promise<void> {
  if (isPlaceholderConfig()) {
    inMemoryStore.stats = inMemoryStore.stats.filter((s) => s.id !== id);
    return;
  }
  const { error } = await supabase.from("stats").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderStats(items: Array<{ id: string; sort_order: number }>): Promise<void> {
  if (isPlaceholderConfig()) {
    items.forEach((item) => {
      const match = inMemoryStore.stats.find((s) => s.id === item.id);
      if (match) match.sort_order = item.sort_order;
    });
    return;
  }
  const promises = items.map((item) =>
    supabase.from("stats").update({ sort_order: item.sort_order }).eq("id", item.id)
  );
  await Promise.all(promises);
}

// --- TIMELINE ---
export async function getTimeline(): Promise<DBTimelineItem[]> {
  if (isPlaceholderConfig()) {
    return inMemoryStore.timeline.sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data, error } = await supabase
    .from("timeline")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createTimelineItem(item: Omit<DBTimelineItem, "id">): Promise<DBTimelineItem> {
  if (isPlaceholderConfig()) {
    const newItem: DBTimelineItem = { ...item, id: crypto.randomUUID() };
    inMemoryStore.timeline.push(newItem);
    return newItem;
  }
  const { data, error } = await supabase
    .from("timeline")
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTimelineItem(id: string, item: Partial<DBTimelineItem>): Promise<DBTimelineItem> {
  if (isPlaceholderConfig()) {
    const index = inMemoryStore.timeline.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Timeline item not found");
    inMemoryStore.timeline[index] = { ...inMemoryStore.timeline[index], ...item };
    return inMemoryStore.timeline[index];
  }
  const { data, error } = await supabase
    .from("timeline")
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTimelineItem(id: string): Promise<void> {
  if (isPlaceholderConfig()) {
    inMemoryStore.timeline = inMemoryStore.timeline.filter((t) => t.id !== id);
    return;
  }
  const { error } = await supabase.from("timeline").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderTimeline(items: Array<{ id: string; sort_order: number }>): Promise<void> {
  if (isPlaceholderConfig()) {
    items.forEach((item) => {
      const match = inMemoryStore.timeline.find((t) => t.id === item.id);
      if (match) match.sort_order = item.sort_order;
    });
    return;
  }
  const promises = items.map((item) =>
    supabase.from("timeline").update({ sort_order: item.sort_order }).eq("id", item.id)
  );
  await Promise.all(promises);
}

// --- EXPERIENCE ---
export async function getExperiences(): Promise<DBExperience[]> {
  if (isPlaceholderConfig()) {
    return inMemoryStore.experiences.sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createExperience(exp: Omit<DBExperience, "id">): Promise<DBExperience> {
  if (isPlaceholderConfig()) {
    const newExp: DBExperience = { ...exp, id: crypto.randomUUID() };
    inMemoryStore.experiences.push(newExp);
    return newExp;
  }
  const { data, error } = await supabase
    .from("experiences")
    .insert([exp])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateExperience(id: string, exp: Partial<DBExperience>): Promise<DBExperience> {
  if (isPlaceholderConfig()) {
    const index = inMemoryStore.experiences.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Experience not found");
    inMemoryStore.experiences[index] = { ...inMemoryStore.experiences[index], ...exp };
    return inMemoryStore.experiences[index];
  }
  const { data, error } = await supabase
    .from("experiences")
    .update(exp)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExperience(id: string): Promise<void> {
  if (isPlaceholderConfig()) {
    inMemoryStore.experiences = inMemoryStore.experiences.filter((e) => e.id !== id);
    return;
  }
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderExperiences(items: Array<{ id: string; sort_order: number }>): Promise<void> {
  if (isPlaceholderConfig()) {
    items.forEach((item) => {
      const match = inMemoryStore.experiences.find((e) => e.id === item.id);
      if (match) match.sort_order = item.sort_order;
    });
    return;
  }
  const promises = items.map((item) =>
    supabase.from("experiences").update({ sort_order: item.sort_order }).eq("id", item.id)
  );
  await Promise.all(promises);
}

// --- SKILLS ---
export async function getSkillCategories(): Promise<DBSkillCategory[]> {
  if (isPlaceholderConfig()) {
    return inMemoryStore.skills.sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data, error } = await supabase
    .from("skill_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createSkillCategory(cat: Omit<DBSkillCategory, "id">): Promise<DBSkillCategory> {
  if (isPlaceholderConfig()) {
    const newCat: DBSkillCategory = { ...cat, id: crypto.randomUUID() };
    inMemoryStore.skills.push(newCat);
    return newCat;
  }
  const { data, error } = await supabase
    .from("skill_categories")
    .insert([cat])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSkillCategory(id: string, cat: Partial<DBSkillCategory>): Promise<DBSkillCategory> {
  if (isPlaceholderConfig()) {
    const index = inMemoryStore.skills.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Skill Category not found");
    inMemoryStore.skills[index] = { ...inMemoryStore.skills[index], ...cat };
    return inMemoryStore.skills[index];
  }
  const { data, error } = await supabase
    .from("skill_categories")
    .update(cat)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSkillCategory(id: string): Promise<void> {
  if (isPlaceholderConfig()) {
    inMemoryStore.skills = inMemoryStore.skills.filter((s) => s.id !== id);
    return;
  }
  const { error } = await supabase.from("skill_categories").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderSkillCategories(items: Array<{ id: string; sort_order: number }>): Promise<void> {
  if (isPlaceholderConfig()) {
    items.forEach((item) => {
      const match = inMemoryStore.skills.find((s) => s.id === item.id);
      if (match) match.sort_order = item.sort_order;
    });
    return;
  }
  const promises = items.map((item) =>
    supabase.from("skill_categories").update({ sort_order: item.sort_order }).eq("id", item.id)
  );
  await Promise.all(promises);
}

// --- PROJECTS ---
export async function getProjects(publishedOnly = true): Promise<Project[]> {
  if (isPlaceholderConfig()) {
    const list = inMemoryStore.projects.sort((a, b) => a.sort_order - b.sort_order);
    return publishedOnly ? list.filter((p) => p.published) : list;
  }
  let query = supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (isPlaceholderConfig()) {
    return inMemoryStore.projects
      .filter((p) => p.published && p.featured)
      .sort((a, b) => a.sort_order - b.sort_order)
      .slice(0, 3);
  }
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  if (error) throw error;
  return data;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isPlaceholderConfig()) {
    const match = inMemoryStore.projects.find((p) => p.slug === slug);
    return match || null;
  }
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(project: ProjectInput): Promise<Project> {
  const timestamp = new Date().toISOString();
  if (isPlaceholderConfig()) {
    const newProj: Project = {
      ...project,
      id: crypto.randomUUID(),
      created_at: timestamp,
      updated_at: timestamp,
    };
    inMemoryStore.projects.push(newProj);
    return newProj;
  }
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, project: Partial<ProjectInput>): Promise<Project> {
  const timestamp = new Date().toISOString();
  if (isPlaceholderConfig()) {
    const index = inMemoryStore.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Project not found");
    inMemoryStore.projects[index] = {
      ...inMemoryStore.projects[index],
      ...project,
      updated_at: timestamp,
    };
    return inMemoryStore.projects[index];
  }
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  if (isPlaceholderConfig()) {
    inMemoryStore.projects = inMemoryStore.projects.filter((p) => p.id !== id);
    return;
  }
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// --- CERTIFICATES ---
export async function getCertificates(): Promise<Certificate[]> {
  if (isPlaceholderConfig()) {
    return inMemoryStore.certificates.sort((a, b) => a.sort_order - b.sort_order);
  }
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createCertificate(certificate: CertificateInput): Promise<Certificate> {
  const timestamp = new Date().toISOString();
  if (isPlaceholderConfig()) {
    const newCert: Certificate = {
      ...certificate,
      id: crypto.randomUUID(),
      created_at: timestamp,
      updated_at: timestamp,
    };
    inMemoryStore.certificates.push(newCert);
    return newCert;
  }
  const { data, error } = await supabase
    .from("certificates")
    .insert(certificate)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCertificate(
  id: string,
  certificate: Partial<CertificateInput>
): Promise<Certificate> {
  const timestamp = new Date().toISOString();
  if (isPlaceholderConfig()) {
    const index = inMemoryStore.certificates.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Certificate not found");
    inMemoryStore.certificates[index] = {
      ...inMemoryStore.certificates[index],
      ...certificate,
      updated_at: timestamp,
    };
    return inMemoryStore.certificates[index];
  }
  const { data, error } = await supabase
    .from("certificates")
    .update(certificate)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCertificate(id: string): Promise<void> {
  if (isPlaceholderConfig()) {
    inMemoryStore.certificates = inMemoryStore.certificates.filter((c) => c.id !== id);
    return;
  }
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) throw error;
}

// --- BLOG POSTS ---
export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  if (isPlaceholderConfig()) {
    const list = inMemoryStore.blog.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return publishedOnly ? list.filter((p) => p.published) : list;
  }
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isPlaceholderConfig()) {
    const match = inMemoryStore.blog.find((b) => b.slug === slug);
    return match || null;
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createBlogPost(post: BlogPostInput): Promise<BlogPost> {
  const timestamp = new Date().toISOString();
  if (isPlaceholderConfig()) {
    const newPost: BlogPost = {
      ...post,
      id: crypto.randomUUID(),
      created_at: timestamp,
      updated_at: timestamp,
    };
    inMemoryStore.blog.push(newPost);
    return newPost;
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(
  id: string,
  post: Partial<BlogPostInput>
): Promise<BlogPost> {
  const timestamp = new Date().toISOString();
  if (isPlaceholderConfig()) {
    const index = inMemoryStore.blog.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Blog post not found");
    inMemoryStore.blog[index] = {
      ...inMemoryStore.blog[index],
      ...post,
      updated_at: timestamp,
    };
    return inMemoryStore.blog[index];
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .update(post)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (isPlaceholderConfig()) {
    inMemoryStore.blog = inMemoryStore.blog.filter((b) => b.id !== id);
    return;
  }
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

// --- MESSAGES ---
export async function getMessages(): Promise<Message[]> {
  if (isPlaceholderConfig()) {
    return inMemoryStore.messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUnreadMessageCount(): Promise<number> {
  if (isPlaceholderConfig()) {
    return inMemoryStore.messages.filter((m) => !m.read).length;
  }
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  if (error) throw error;
  return count || 0;
}

export async function sendMessage(message: MessageInput): Promise<Message> {
  const timestamp = new Date().toISOString();
  if (isPlaceholderConfig()) {
    const newMsg: Message = {
      ...message,
      id: crypto.randomUUID(),
      read: false,
      created_at: timestamp,
    };
    inMemoryStore.messages.push(newMsg);
    return newMsg;
  }
  const { data, error } = await supabase
    .from("messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markMessageAsRead(id: string): Promise<void> {
  if (isPlaceholderConfig()) {
    const match = inMemoryStore.messages.find((m) => m.id === id);
    if (match) match.read = true;
    return;
  }
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  if (isPlaceholderConfig()) {
    inMemoryStore.messages = inMemoryStore.messages.filter((m) => m.id !== id);
    return;
  }
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw error;
}
