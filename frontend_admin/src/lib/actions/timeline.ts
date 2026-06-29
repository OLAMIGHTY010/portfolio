import { apiFetch } from "../api-client";
import { TIMELINE } from "@/lib/constants";
import type { TimelineItem } from "@/lib/types";

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
  try {
    return await apiFetch<DBTimelineItem[]>("/timeline");
  } catch (err) {
    console.warn("Failed to fetch timeline from API, using defaults:", err);
    return DEFAULT_TIMELINE;
  }
}

export async function createTimelineItem(item: Omit<DBTimelineItem, "id">): Promise<DBTimelineItem> {
  return await apiFetch<DBTimelineItem>("/timeline", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function updateTimelineItem(id: string, item: Partial<DBTimelineItem>): Promise<DBTimelineItem> {
  return await apiFetch<DBTimelineItem>(`/timeline/${id}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}

export async function deleteTimelineItem(id: string): Promise<void> {
  await apiFetch<void>(`/timeline/${id}`, {
    method: "DELETE",
  });
}

export async function reorderTimeline(items: Array<{ id: string; sort_order: number }>): Promise<void> {
  await apiFetch<void>("/timeline/reorder", {
    method: "POST",
    body: JSON.stringify(items),
  });
}
