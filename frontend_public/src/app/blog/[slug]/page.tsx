"use client";

import { useEffect, useState } from "react";
import { isPlaceholderConfig } from "@/lib/utils";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/sections/animated-section";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

// Fallback blog post content
const FALLBACK_POSTS: Record<string, BlogPost> = {
  "how-i-built-flowmart": {
    id: "1", title: "How I Built FlowMart: From Idea to MVP", slug: "how-i-built-flowmart",
    content: `# How I Built FlowMart: From Idea to MVP

The journey from identifying a market gap to shipping a working product taught me more about software engineering, product thinking, and resilience than any course ever could.

## The Spark

Working in banking operations, I noticed a recurring pattern: small and medium businesses in Nigeria struggled with inventory management. They relied on paper notebooks, WhatsApp messages, and memory.

I thought: *What if I could build something simple enough for a shop owner in Oshodi Market, yet powerful enough to handle real business operations?*

That question became **FlowMart**.

## Defining the MVP

I started with user research — visiting markets, talking to shop owners, observing their workflows. Three core needs emerged:

1. **Inventory tracking** — Know what you have, what is running low
2. **Sales recording** — Track daily sales without manual calculations
3. **Basic reporting** — See weekly/monthly performance at a glance

## The Tech Stack

- **Next.js** — For the web application
- **Go** — For performance-critical backend microservices
- **PostgreSQL** — Reliable, scalable database
- **Paystack/Flutterwave** — Payment gateway integrations

## Lessons Learned

1. **Start with the user, not the technology**
2. **Shipping beats perfection**
3. **Product thinking > code**

*Building something from zero is the best education in tech.*`,
    excerpt: "The journey from identifying a market gap to shipping a working product.", cover_image_url: null,
    published: true, reading_time: 8, created_at: "2024-09-15T10:00:00Z", updated_at: "2024-09-15T10:00:00Z",
  },
  "sql-techniques-business-analysts": {
    id: "2", title: "10 SQL Techniques Every Business Analyst Should Master", slug: "sql-techniques-business-analysts",
    content: `# 10 SQL Techniques Every Business Analyst Should Master

SQL is the business analyst's most powerful tool for turning raw data into actionable insights.

## 1. Window Functions

\`\`\`sql
SELECT transaction_date, amount,
  SUM(amount) OVER (ORDER BY transaction_date) as running_total
FROM transactions;
\`\`\`

## 2. Common Table Expressions (CTEs)

CTEs make complex queries self-documenting. Your future self will thank you.

## 3. CASE Statements

Transform raw data into business categories directly in your queries.

## 4. Date Functions

Master DATE_TRUNC, EXTRACT, and interval arithmetic for time intelligence.

## 5. LEFT JOINs for Missing Data

Find what's missing: customers who haven't transacted, products never ordered.

*SQL mastery is about knowing which tool to reach for when facing a business question.*`,
    excerpt: "10 SQL techniques that made the biggest difference.", cover_image_url: null,
    published: true, reading_time: 10, created_at: "2024-08-20T10:00:00Z", updated_at: "2024-08-20T10:00:00Z",
  },
  "ai-reshaping-business-analyst-role": {
    id: "3", title: "How AI is Reshaping the Business Analyst Role", slug: "ai-reshaping-business-analyst-role",
    content: `# How AI is Reshaping the Business Analyst Role

**AI will not replace business analysts. But business analysts who use AI will replace those who do not.**

## What AI Does Well

- Pattern recognition at scale
- Report generation
- Automation of repetitive tasks

## What AI Cannot Do (Yet)

- Understand business context
- Stakeholder management
- Ethical judgment
- Creative problem framing

## The New BA Skill Stack

1. **Prompt engineering**
2. **AI output validation**
3. **Tool integration**
4. **Process redesign**

*Invest in understanding AI. But invest even more in the uniquely human skills that make you irreplaceable.*`,
    excerpt: "AI will not replace business analysts. But business analysts who use AI will replace those who do not.", cover_image_url: null,
    published: true, reading_time: 7, created_at: "2024-07-10T10:00:00Z", updated_at: "2024-07-10T10:00:00Z",
  },
};

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const readingProgress = (scrollTop / docHeight) * 100;
      setProgress(Math.min(readingProgress, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
    />
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        if (isPlaceholderConfig()) {
          setPost(FALLBACK_POSTS[slug] || null);
          setLoading(false);
          return;
        }
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          setPost(FALLBACK_POSTS[slug] || null);
        } else {
          setPost(data);
        }
      } catch {
        setPost(FALLBACK_POSTS[slug] || null);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-28">
        <div className="container-custom section-padding !pt-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-12 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            <div className="h-px bg-border my-8" />
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded" style={{ width: `${90 - i * 5}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-28">
        <div className="container-custom section-padding !pt-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Button render={<Link href="/blog" />}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReadingProgress />
      <div className="pt-28">
        <article className="section-padding !pt-8">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              {/* Back */}
              <FadeIn>
                <Button variant="ghost" className="mb-8 -ml-4 gap-2" render={<Link href="/blog" />}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                </Button>
              </FadeIn>

              {/* Header */}
              <FadeIn delay={0.1}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.reading_time} min read
                  </span>
                </div>
              </FadeIn>

              <Separator className="mb-10" />

              {/* Content */}
              <FadeIn delay={0.2}>
                <div className="prose-custom">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                  </ReactMarkdown>
                </div>
              </FadeIn>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
