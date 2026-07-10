"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { MessageInput } from "@/lib/types";

export async function getMessages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUnreadMessageCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  if (error) throw error;
  return count || 0;
}

export async function sendMessage(message: MessageInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markMessageAsRead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/inbox");
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/inbox");
}
