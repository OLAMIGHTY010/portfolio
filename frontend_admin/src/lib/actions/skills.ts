import { apiFetch } from "../api-client";
import { SKILL_CATEGORIES } from "@/lib/constants";

export interface DBSkillCategory {
  id: string;
  title: string;
  description: string;
  skill_names: string[];
  sort_order: number;
}

const DEFAULT_SKILL_CATEGORIES: DBSkillCategory[] = SKILL_CATEGORIES.map((cat, index) => ({
  id: `default-${index}`,
  title: cat.title,
  description: cat.description,
  skill_names: cat.skills.map((s) => s.name),
  sort_order: index + 1,
}));

export async function getSkillCategories(): Promise<DBSkillCategory[]> {
  try {
    return await apiFetch<DBSkillCategory[]>("/skills");
  } catch (err) {
    console.warn("Failed to fetch skills from API, using defaults:", err);
    return DEFAULT_SKILL_CATEGORIES;
  }
}

export async function createSkillCategory(cat: Omit<DBSkillCategory, "id">): Promise<DBSkillCategory> {
  return await apiFetch<DBSkillCategory>("/skills", {
    method: "POST",
    body: JSON.stringify(cat),
  });
}

export async function updateSkillCategory(id: string, cat: Partial<DBSkillCategory>): Promise<DBSkillCategory> {
  return await apiFetch<DBSkillCategory>(`/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(cat),
  });
}

export async function deleteSkillCategory(id: string): Promise<void> {
  await apiFetch<void>(`/skills/${id}`, {
    method: "DELETE",
  });
}

export async function reorderSkillCategories(items: Array<{ id: string; sort_order: number }>): Promise<void> {
  await apiFetch<void>("/skills/reorder", {
    method: "POST",
    body: JSON.stringify(items),
  });
}
