import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/sections/animated-section";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate, isPlaceholderConfig } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

// Fallback blog post content
const FALLBACK_POSTS: Record<string, BlogPost> = {
  "how-i-built-flowmart": {
    id: "1", title: "How I Built FlowMart: From Idea to MVP", slug: "how-i-built-flowmart",
    content: `# How I Built FlowMart: From Idea to MVP\n\nThe journey from identifying a market gap to shipping a working product taught me more about software engineering, product thinking, and resilience than any course ever could.\n\n## The Spark\n\nWorking in banking operations, I noticed a recurring pattern: small and medium businesses in Nigeria struggled with inventory management. They relied on paper notebooks, WhatsApp messages, and memory.\n\nI thought: *What if I could build something simple enough for a shop owner in Oshodi Market, yet powerful enough to handle real business operations?*\n\nThat question became **FlowMart**.\n\n## Defining the MVP\n\nI started with user research — visiting markets, talking to shop owners, observing their workflows. Three core needs emerged:\n\n1. **Inventory tracking** — Know what you have, what is running low\n2. **Sales recording** — Track daily sales without manual calculations\n3. **Basic reporting** — See weekly/monthly performance at a glance\n\n## The Tech Stack\n\n- **Next.js** — For the web application\n- **Go** — For performance-critical backend microservices\n- **PostgreSQL** — Reliable, scalable database\n- **Paystack/Flutterwave** — Payment gateway integrations\n\n## Lessons Learned\n\n1. **Start with the user, not the technology**\n2. **Shipping beats perfection**\n3. **Product thinking > code**\n\n*Building something from zero is the best education in tech.*`,
    excerpt: "The journey from identifying a market gap to shipping a working product.", cover_image_url: null,
    published: true, reading_time: 8, created_at: "2024-09-15T10:00:00Z", updated_at: "2024-09-15T10:00:00Z",
  },
  "sql-techniques-business-analysts": {
    id: "2", title: "10 SQL Techniques Every Business Analyst Should Master", slug: "sql-techniques-business-analysts",
    content: `# 10 SQL Techniques Every Business Analyst Should Master\n\nSQL is the business analyst's most powerful tool for turning raw data into actionable insights.\n\n## 1. Window Functions\n\n\`\`\`sql\nSELECT transaction_date, amount,\n  SUM(amount) OVER (ORDER BY transaction_date) as running_total\nFROM transactions;\n\`\`\`\n\n## 2. Common Table Expressions (CTEs)\n\nCTEs make complex queries self-documenting. Your future self will thank you.\n\n## 3. CASE Statements\n\nTransform raw data into business categories directly in your queries.\n\n## 4. Date Functions\n\nMaster DATE_TRUNC, EXTRACT, and interval arithmetic for time intelligence.\n\n## 5. LEFT JOINs for Missing Data\n\nFind what's missing: customers who haven't transacted, products never ordered.\n\n*SQL mastery is about knowing which tool to reach for when facing a business question.*`,
    excerpt: "10 SQL techniques that made the biggest difference.", cover_image_url: null,
    published: true, reading_time: 10, created_at: "2024-08-20T10:00:00Z", updated_at: "2024-08-20T10:00:00Z",
  },
  "ai-reshaping-business-analyst-role": {
    id: "3", title: "How AI is Reshaping the Business Analyst Role", slug: "ai-reshaping-business-analyst-role",
    content: `# How AI is Reshaping the Business Analyst Role\n\n**AI will not replace business analysts. But business analysts who use AI will replace those who do not.**\n\n## What AI Does Well\n\n- Pattern recognition at scale\n- Report generation\n- Automation of repetitive tasks\n\n## What AI Cannot Do (Yet)\n\n- Understand business context\n- Stakeholder management\n- Ethical judgment\n- Creative problem framing\n\n## The New BA Skill Stack\n\n1. **Prompt engineering**\n2. **AI output validation**\n3. **Tool integration**\n4. **Process redesign**\n\n*Invest in understanding AI. But invest even more in the uniquely human skills that make you irreplaceable.*`,
    excerpt: "AI will not replace business analysts. But business analysts who use AI will replace those who do not.", cover_image_url: null,
    published: true, reading_time: 7, created_at: "2024-07-10T10:00:00Z", updated_at: "2024-07-10T10:00:00Z",
  },
};

async function getPost(slug: string): Promise<BlogPost | null> {
  if (isPlaceholderConfig()) return FALLBACK_POSTS[slug] || null;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return FALLBACK_POSTS[slug] || null;
    return data;
  } catch {
    return FALLBACK_POSTS[slug] || null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      ...(post.cover_image_url && {
        images: [
          {
            url: post.cover_image_url,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      ...(post.cover_image_url && { images: [post.cover_image_url] }),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="pt-28">
      <section className="section-padding !pt-8">
        <div className="container-custom">
          {/* Back button */}
          <FadeIn>
            <Button variant="ghost" className="mb-8 -ml-4 gap-2" render={<Link href="/blog" />}>
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </FadeIn>

          {/* Header */}
          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.created_at}>
                    {formatDate(post.created_at)}
                  </time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time || 5} min read</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Cover Image */}
          {post.cover_image_url && (
            <FadeIn delay={0.2}>
              <div className="max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden border border-border">
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            </FadeIn>
          )}

          <Separator className="max-w-3xl mx-auto mb-12" />

          {/* Content */}
          <FadeIn delay={0.3}>
            <article className="max-w-3xl mx-auto markdown-body prose prose-zinc dark:prose-invert prose-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </article>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
