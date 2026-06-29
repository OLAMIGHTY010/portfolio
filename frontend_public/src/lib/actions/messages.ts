import { apiFetch } from "../api-client";
import type { MessageInput, Message } from "@/lib/types";

export async function getMessages(): Promise<Message[]> {
  try {
    return await apiFetch<Message[]>("/messages");
  } catch (err) {
    console.warn("Failed to fetch messages from API:", err);
    return [];
  }
}

export async function getUnreadMessageCount(): Promise<number> {
  try {
    const res = await apiFetch<{ count: number }>("/messages/unread-count");
    return res.count;
  } catch (err) {
    console.warn("Failed to fetch unread message count from API:", err);
    return 0;
  }
}

export async function sendMessage(message: MessageInput): Promise<Message> {
  return await apiFetch<Message>("/messages", {
    method: "POST",
    body: JSON.stringify(message),
  });
}

export async function markMessageAsRead(id: string): Promise<void> {
  await apiFetch<void>(`/messages/${id}/read`, {
    method: "PUT",
  });
}

export async function deleteMessage(id: string): Promise<void> {
  await apiFetch<void>(`/messages/${id}`, {
    method: "DELETE",
  });
}
