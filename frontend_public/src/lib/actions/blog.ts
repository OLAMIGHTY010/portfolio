import { apiFetch } from "../api-client";
import type { BlogPostInput, BlogPost } from "@/lib/types";

export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  try {
    return await apiFetch<BlogPost[]>(`/blog?publishedOnly=${publishedOnly}`);
  } catch (err) {
    console.warn("Failed to fetch blog posts from API:", err);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await apiFetch<BlogPost>(`/blog/slug/${slug}`);
  } catch (err) {
    console.warn(`Failed to fetch blog post by slug (${slug}) from API:`, err);
    return null;
  }
}

export async function createBlogPost(post: BlogPostInput): Promise<BlogPost> {
  return await apiFetch<BlogPost>("/blog", {
    method: "POST",
    body: JSON.stringify(post),
  });
}

export async function updateBlogPost(
  id: string,
  post: Partial<BlogPostInput>
): Promise<BlogPost> {
  return await apiFetch<BlogPost>(`/blog/${id}`, {
    method: "PUT",
    body: JSON.stringify(post),
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  await apiFetch<void>(`/blog/${id}`, {
    method: "DELETE",
  });
}
