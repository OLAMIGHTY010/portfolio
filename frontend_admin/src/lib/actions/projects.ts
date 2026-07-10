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
  if (isPlaceholderConfig()) return { success: false, error: 'Cannot sync: Supabase is in placeholder mode. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.' };
  
  try {
    // Step 1: Fetch repos from GitHub
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: { 'User-Agent': 'Portfolio-App' },
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      const body = await res.text();
      return { success: false, error: `GitHub API error (${res.status}): ${res.statusText}. Body: ${body.slice(0, 200)}` };
    }
    
    const repos = await res.json();
    
    // Step 2: Validate GitHub response
    if (!Array.isArray(repos)) {
      return { success: false, error: `GitHub returned unexpected response (not an array): ${JSON.stringify(repos).slice(0, 200)}` };
    }
    
    if (repos.length === 0) {
      return { success: false, error: `GitHub returned 0 repos for user "${username}". Check the username is correct.` };
    }

    const supabase = await createClient();
    
    // Step 3: Check if projects table exists
    const { data: existingProjects, error: selectError } = await supabase.from('projects').select('slug, github_url');
    
    if (selectError) {
      return { success: false, error: `Database error reading projects table: ${selectError.message} (code: ${selectError.code})` };
    }
    
    // Step 4: Try inserting repos
    let addedCount = 0;
    const skippedRepos: string[] = [];
    const nonForkRepos = repos.filter((r: any) => !r.fork);
    
    for (const repo of nonForkRepos) {
      const repoUrl = repo.html_url;
      const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      // Check if project exists by github_url or slug
      const exists = existingProjects?.some((p: any) => p.github_url === repoUrl || p.slug === slug);
      if (exists) {
        skippedRepos.push(slug);
        continue;
      }
      
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
        published: false,
        sort_order: 99,
      };
      
      const { error } = await supabase.from('projects').insert(newProject);
      if (error) {
        return { success: false, error: `Failed to insert "${slug}": ${error.message} (code: ${error.code}). Details: ${error.details || 'none'}` };
      }
      addedCount++;
    }
    
    revalidatePath('/admin/projects');
    
    if (addedCount === 0 && nonForkRepos.length > 0) {
      return { success: false, error: `0 added out of ${nonForkRepos.length} non-fork repos. ${skippedRepos.length} skipped as duplicates: [${skippedRepos.join(', ')}]. Existing projects in DB: ${existingProjects?.length ?? 0}` };
    }
    
    return { success: true, added: addedCount };
  } catch (error: any) {
    return { success: false, error: `Unexpected error: ${error.message || 'Unknown'}. Stack: ${error.stack?.slice(0, 200) || 'none'}` };
  }
}
