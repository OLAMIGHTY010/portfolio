"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { STATS } from "@/lib/constants";
import type { StatItem } from "@/lib/types";
import { isPlaceholderConfig } from "@/lib/utils";

export interface DBStat extends StatItem {
  id: string;
  sort_order: number;
}

const DEFAULT_STATS: DBStat[] = STATS.map((stat, index) => ({
  id: `default-${index}`,
  label: stat.label,
  value: stat.value,
  suffix: stat.suffix,
  sort_order: index + 1,
}));

export async function getStats(): Promise<DBStat[]> {
  if (isPlaceholderConfig()) {
    return DEFAULT_STATS;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_STATS;
    }
    return data;
  } catch {
    return DEFAULT_STATS;
  }
}

export async function createStat(stat: Omit<DBStat, "id">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stats")
    .insert([stat])
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/stats-timeline");
  return data;
}

export async function updateStat(id: string, stat: Partial<DBStat>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stats")
    .update(stat)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/stats-timeline");
  return data;
}

export async function deleteStat(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("stats").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/admin/stats-timeline");
}

export async function reorderStats(items: Array<{ id: string; sort_order: number }>) {
  const supabase = await createClient();
  
  // Perform updates in parallel
  const promises = items.map((item) =>
    supabase.from("stats").update({ sort_order: item.sort_order }).eq("id", item.id)
  );
  
  await Promise.all(promises);
  revalidatePath("/");
  revalidatePath("/admin/stats-timeline");
}
