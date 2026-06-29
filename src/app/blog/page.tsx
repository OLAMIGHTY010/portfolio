import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/sections/animated-section";
import { BlogCard } from "@/components/cards/blog-card";
import type { BlogPost } from "@/lib/types";
import { isPlaceholderConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical articles on business analysis, SQL, data analytics, product building, and AI.",
};

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "1", title: "How I Built FlowMart: From Idea to MVP", slug: "how-i-built-flowmart",
    content: "", excerpt: "The journey from identifying a market gap to shipping a working product taught me more about software engineering, product thinking, and resilience than any course ever could.",
    cover_image_url: null, published: true, reading_time: 8,
    created_at: "2024-09-15T10:00:00Z", updated_at: "2024-09-15T10:00:00Z",
  },
  {
    id: "2", title: "10 SQL Techniques Every Business Analyst Should Master", slug: "sql-techniques-business-analysts",
    content: "", excerpt: "After years of writing SQL in banking and analytics roles, here are the 10 techniques that made the biggest difference.",
    cover_image_url: null, published: true, reading_time: 10,
    created_at: "2024-08-20T10:00:00Z", updated_at: "2024-08-20T10:00:00Z",
  },
  {
    id: "3", title: "How AI is Reshaping the Business Analyst Role", slug: "ai-reshaping-business-analyst-role",
    content: "", excerpt: "AI will not replace business analysts. But business analysts who use AI will replace those who do not.",
    cover_image_url: null, published: true, reading_time: 7,
    created_at: "2024-07-10T10:00:00Z", updated_at: "2024-07-10T10:00:00Z",
  },
];

async function getBlogPosts(): Promise<BlogPost[]> {
  if (isPlaceholderConfig()) return FALLBACK_POSTS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_POSTS;
    return data;
  } catch {
    return FALLBACK_POSTS;
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="pt-28">
      <section className="section-padding !pt-8">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Insights
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Technical{" "}
                <span className="gradient-text">Blog</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Sharing what I learn about business analysis, data, product building, and the intersection of technology and business.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <BlogCard post={post} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
