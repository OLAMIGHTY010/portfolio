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
