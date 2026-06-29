import { apiFetch } from "../api-client";
import { SITE_CONFIG, HERO, ABOUT_STORY, FLOWMART } from "@/lib/constants";

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

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await apiFetch<SiteSettings>("/settings");
  } catch (err) {
    console.warn("Failed to fetch settings from API, using defaults:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  return await apiFetch<SiteSettings>("/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}
