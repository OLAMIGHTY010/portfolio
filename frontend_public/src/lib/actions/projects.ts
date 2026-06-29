import { apiFetch } from "../api-client";
import type { ProjectInput, Project } from "@/lib/types";

export async function getProjects(publishedOnly = true): Promise<Project[]> {
  try {
    return await apiFetch<Project[]>(`/projects?publishedOnly=${publishedOnly}`);
  } catch (err) {
    console.warn("Failed to fetch projects from API:", err);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    return await apiFetch<Project[]>("/projects?featured=true");
  } catch (err) {
    console.warn("Failed to fetch featured projects from API:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await apiFetch<Project>(`/projects/slug/${slug}`);
  } catch (err) {
    console.warn(`Failed to fetch project by slug (${slug}) from API:`, err);
    return null;
  }
}

export async function createProject(project: ProjectInput): Promise<Project> {
  return await apiFetch<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export async function updateProject(id: string, project: Partial<ProjectInput>): Promise<Project> {
  return await apiFetch<Project>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await apiFetch<void>(`/projects/${id}`, {
    method: "DELETE",
  });
}
