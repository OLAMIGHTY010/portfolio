"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SITE_CONFIG, HERO, ABOUT_STORY, FLOWMART } from "@/lib/constants";
import { isPlaceholderConfig } from "@/lib/utils";

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

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isPlaceholderConfig()) {
    return DEFAULT_SETTINGS;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) {
      return DEFAULT_SETTINGS;
    }

    return {
      site_name: data.site_name,
      site_title: data.site_title,
      site_description: data.site_description,
      site_url: data.site_url,
      email: data.email,
      linkedin_url: data.linkedin_url,
      github_url: data.github_url,
      avatar_url: data.avatar_url,
      resume_url: data.resume_url,
      is_open_to_opportunities: data.is_open_to_opportunities,
      location_display: data.location_display,
      
      hero_greeting: data.hero_greeting,
      hero_name: data.hero_name,
      hero_roles: data.hero_roles,
      hero_summary: data.hero_summary,
      hero_cta_primary: data.hero_cta_primary,
      hero_cta_secondary: data.hero_cta_secondary,
      
      about_story: data.about_story,
      
      flowmart_tagline: data.flowmart_tagline,
      flowmart_headline: data.flowmart_headline,
      flowmart_subheadline: data.flowmart_subheadline,
      flowmart_vision: data.flowmart_vision,
      flowmart_mission: data.flowmart_mission,
      flowmart_problem_title: data.flowmart_problem_title,
      flowmart_problem_description: data.flowmart_problem_description,
      flowmart_problem_painpoints: data.flowmart_problem_painpoints,
      flowmart_tech_stack: data.flowmart_tech_stack || DEFAULT_SETTINGS.flowmart_tech_stack,
      flowmart_role_title: data.flowmart_role_title,
      flowmart_role_description: data.flowmart_role_description,
      flowmart_user_journey: data.flowmart_user_journey,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .update(settings)
    .eq("id", "default")
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/flowmart");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  return data;
}
