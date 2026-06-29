"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { BlogPostInput } from "@/lib/types";
import { isPlaceholderConfig } from "@/lib/utils";

export async function getBlogPosts(publishedOnly = true) {
  if (isPlaceholderConfig()) return [];
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getBlogPostBySlug(slug: string) {
  if (isPlaceholderConfig()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createBlogPost(post: BlogPostInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return data;
}

export async function updateBlogPost(
  id: string,
  post: Partial<BlogPostInput>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update(post)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return data;
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
