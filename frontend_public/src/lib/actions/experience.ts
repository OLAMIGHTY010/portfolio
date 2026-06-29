import { apiFetch } from "../api-client";
import { EXPERIENCES } from "@/lib/constants";
import type { ExperienceItem } from "@/lib/types";

export interface DBExperience extends ExperienceItem {
  id: string;
  sort_order: number;
}

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

export async function getExperiences(): Promise<DBExperience[]> {
  try {
    return await apiFetch<DBExperience[]>("/experiences");
  } catch (err) {
    console.warn("Failed to fetch experiences from API, using defaults:", err);
    return DEFAULT_EXPERIENCES;
  }
}

export async function createExperience(exp: Omit<DBExperience, "id">): Promise<DBExperience> {
  return await apiFetch<DBExperience>("/experiences", {
    method: "POST",
    body: JSON.stringify(exp),
  });
}

export async function updateExperience(id: string, exp: Partial<DBExperience>): Promise<DBExperience> {
  return await apiFetch<DBExperience>(`/experiences/${id}`, {
    method: "PUT",
    body: JSON.stringify(exp),
  });
}

export async function deleteExperience(id: string): Promise<void> {
  await apiFetch<void>(`/experiences/${id}`, {
    method: "DELETE",
  });
}

export async function reorderExperiences(items: Array<{ id: string; sort_order: number }>): Promise<void> {
  await apiFetch<void>("/experiences/reorder", {
    method: "POST",
    body: JSON.stringify(items),
  });
}
