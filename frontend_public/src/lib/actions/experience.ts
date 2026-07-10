"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { EXPERIENCES } from "@/lib/constants";
import type { ExperienceItem } from "@/lib/types";
import { isPlaceholderConfig } from "@/lib/utils";

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
  if (isPlaceholderConfig()) {
    return DEFAULT_EXPERIENCES;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_EXPERIENCES;
    }
    return data;
  } catch {
    return DEFAULT_EXPERIENCES;
  }
}

export async function createExperience(exp: Omit<DBExperience, "id">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .insert([exp])
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/experience");
  revalidatePath("/admin/experience-skills");
  return data;
}

export async function updateExperience(id: string, exp: Partial<DBExperience>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .update(exp)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/experience");
  revalidatePath("/admin/experience-skills");
  return data;
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/experience");
  revalidatePath("/admin/experience-skills");
}

export async function reorderExperiences(items: Array<{ id: string; sort_order: number }>) {
  const supabase = await createClient();
  const promises = items.map((item) =>
    supabase.from("experiences").update({ sort_order: item.sort_order }).eq("id", item.id)
  );
  await Promise.all(promises);
  revalidatePath("/experience");
  revalidatePath("/admin/experience-skills");
}
