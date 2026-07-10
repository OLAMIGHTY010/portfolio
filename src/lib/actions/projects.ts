"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProjectInput } from "@/lib/types";
import { isPlaceholderConfig } from "@/lib/utils";

export async function getProjects(publishedOnly = true) {
  if (isPlaceholderConfig()) return [];
  const supabase = await createClient();
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

export async function getFeaturedProjects() {
  if (isPlaceholderConfig()) return [];
  const supabase = await createClient();
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

export async function getProjectBySlug(slug: string) {
  if (isPlaceholderConfig()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(project: ProjectInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return data;
}

export async function updateProject(id: string, project: Partial<ProjectInput>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/");
  return data;
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function syncGithubRepos(username: string) {
  if (isPlaceholderConfig()) return { success: false, error: 'Cannot sync in placeholder mode' };
  
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: { 'User-Agent': 'Portfolio-App' },
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      return { success: false, error: `GitHub API error: ${res.statusText}` };
    }
    
    const repos = await res.json();
    const supabase = await createClient();
    
    // Get existing projects to avoid duplicates
    const { data: existingProjects } = await supabase.from('projects').select('slug, github_url');
    
    let addedCount = 0;
    
    for (const repo of repos) {
      if (repo.fork) continue; // Skip forks
      
      const repoUrl = repo.html_url;
      const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      // Check if project exists by github_url or slug
      const exists = existingProjects?.some(p => p.github_url === repoUrl || p.slug === slug);
      if (exists) continue;
      
      const techStack = [];
      if (repo.language) techStack.push(repo.language);
      
      const newProject: ProjectInput = {
        title: repo.name.replace(/[-_]/g, ' '),
        slug,
        description: repo.description || 'Synced from GitHub',
        case_study: null,
        image_url: null,
        tech_stack: techStack,
        github_url: repoUrl,
        live_url: repo.homepage || null,
        featured: false,
        published: false, // Save as draft so they can review it
        sort_order: 99,
      };
      
      const { error } = await supabase.from('projects').insert(newProject);
      if (error) {
        console.error("Failed to insert project:", error);
        continue;
      }
      addedCount++;
    }
    
    revalidatePath('/admin/projects');
    return { success: true, added: addedCount };
  } catch (error: any) {
    return { success: false, error: error.message || 'Unknown error' };
  }
}
