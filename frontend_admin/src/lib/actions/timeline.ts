"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TIMELINE } from "@/lib/constants";
import type { TimelineItem } from "@/lib/types";
import { isPlaceholderConfig } from "@/lib/utils";

export interface DBTimelineItem extends TimelineItem {
  id: string;
  sort_order: number;
}

const DEFAULT_TIMELINE: DBTimelineItem[] = TIMELINE.map((item, index) => ({
  id: `default-${index}`,
  year: item.year,
  title: item.title,
  institution: item.institution,
  description: item.description,
  sort_order: index + 1,
}));

export async function getTimeline(): Promise<DBTimelineItem[]> {
  if (isPlaceholderConfig()) {
    return DEFAULT_TIMELINE;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("timeline")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_TIMELINE;
    }
    return data;
  } catch {
    return DEFAULT_TIMELINE;
  }
}

export async function createTimelineItem(item: Omit<DBTimelineItem, "id">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("timeline")
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/about");
  revalidatePath("/admin/stats-timeline");
  return data;
}

export async function updateTimelineItem(id: string, item: Partial<DBTimelineItem>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("timeline")
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/about");
  revalidatePath("/admin/stats-timeline");
  return data;
}

export async function deleteTimelineItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("timeline").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/about");
  revalidatePath("/admin/stats-timeline");
}

export async function reorderTimeline(items: Array<{ id: string; sort_order: number }>) {
  const supabase = await createClient();
  const promises = items.map((item) =>
    supabase.from("timeline").update({ sort_order: item.sort_order }).eq("id", item.id)
  );
  await Promise.all(promises);
  revalidatePath("/about");
  revalidatePath("/admin/stats-timeline");
}
