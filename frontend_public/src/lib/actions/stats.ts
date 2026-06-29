import { apiFetch } from "../api-client";
import { STATS } from "@/lib/constants";
import type { StatItem } from "@/lib/types";

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
  try {
    return await apiFetch<DBStat[]>("/stats");
  } catch (err) {
    console.warn("Failed to fetch stats from API, using defaults:", err);
    return DEFAULT_STATS;
  }
}

export async function createStat(stat: Omit<DBStat, "id">): Promise<DBStat> {
  return await apiFetch<DBStat>("/stats", {
    method: "POST",
    body: JSON.stringify(stat),
  });
}

export async function updateStat(id: string, stat: Partial<DBStat>): Promise<DBStat> {
  return await apiFetch<DBStat>(`/stats/${id}`, {
    method: "PUT",
    body: JSON.stringify(stat),
  });
}

export async function deleteStat(id: string): Promise<void> {
  await apiFetch<void>(`/stats/${id}`, {
    method: "DELETE",
  });
}

export async function reorderStats(items: Array<{ id: string; sort_order: number }>): Promise<void> {
  await apiFetch<void>("/stats/reorder", {
    method: "POST",
    body: JSON.stringify(items),
  });
}
