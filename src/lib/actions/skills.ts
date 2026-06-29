"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { isPlaceholderConfig } from "@/lib/utils";

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
  if (isPlaceholderConfig()) {
    return DEFAULT_SKILL_CATEGORIES;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("skill_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_SKILL_CATEGORIES;
    }
    return data;
  } catch {
    return DEFAULT_SKILL_CATEGORIES;
  }
}

export async function createSkillCategory(cat: Omit<DBSkillCategory, "id">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skill_categories")
    .insert([cat])
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/skills");
  revalidatePath("/admin/experience-skills");
  return data;
}

export async function updateSkillCategory(id: string, cat: Partial<DBSkillCategory>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skill_categories")
    .update(cat)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/skills");
  revalidatePath("/admin/experience-skills");
  return data;
}

export async function deleteSkillCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skill_categories").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/skills");
  revalidatePath("/admin/experience-skills");
}

export async function reorderSkillCategories(items: Array<{ id: string; sort_order: number }>) {
  const supabase = await createClient();
  const promises = items.map((item) =>
    supabase.from("skill_categories").update({ sort_order: item.sort_order }).eq("id", item.id)
  );
  await Promise.all(promises);
  revalidatePath("/skills");
  revalidatePath("/admin/experience-skills");
}
