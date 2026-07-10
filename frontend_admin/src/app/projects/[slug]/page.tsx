import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/sections/animated-section";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Project } from "@/lib/types";

// Fallback case study data
const FALLBACK_PROJECTS: Record<string, Project> = {
  "banking-transaction-monitor": {
    id: "1", title: "Banking Transaction Monitor", slug: "banking-transaction-monitor",
    description: "Automated real-time monitoring system that tracks transaction flows, detects anomalies, and triggers instant alerts for the banking operations team.",
    case_study: `## The Problem\n\nIn high-volume banking environments, thousands of transactions flow through the system every minute. Manual monitoring was error-prone, slow, and led to delayed incident detection — costing the organization both revenue and customer trust.\n\n## Research & Discovery\n\nI conducted stakeholder interviews with the operations team, analyzed 6 months of incident reports, and mapped the existing manual monitoring workflow.\n\n## Solution Architecture\n\nBuilt an automated monitoring pipeline that ingests transaction data in real-time, analyzes patterns using configurable threshold rules, alerts the operations team instantly, and logs all incidents.\n\n## Results\n\n- Reduced detection time from **45 minutes to under 2 minutes**\n- Decreased false escalation rate to **8%**\n- Saved the team approximately **15 hours/week**\n- Improved SLA compliance by **23%**`,
    image_url: null, tech_stack: ["Python", "SQL", "PostgreSQL", "Pandas", "Automation"],
    github_url: "https://github.com/olatunbosun", live_url: null,
    featured: true, published: true, sort_order: 1,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  "executive-power-bi-dashboard": {
    id: "2", title: "Executive Power BI Dashboard Suite", slug: "executive-power-bi-dashboard",
    description: "Interactive business intelligence dashboards providing real-time KPI tracking, trend analysis, and executive-level reporting.",
    case_study: `## The Problem\n\nSenior management relied on static Excel reports that were outdated by the time they reached decision-makers.\n\n## Solution\n\nDesigned and built a suite of interconnected Power BI dashboards: Operations Overview, Incident Management, Service Availability, and Executive Summary.\n\n## Impact\n\n- Reduced report generation time from **2 days to real-time**\n- Enabled data-driven decision making at the executive level\n- Adopted by **4 departments** across the organization`,
    image_url: null, tech_stack: ["Power BI", "DAX", "SQL", "PostgreSQL", "Data Modeling"],
    github_url: null, live_url: null,
    featured: true, published: true, sort_order: 2,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  "sql-analytics-reporting-engine": {
    id: "3", title: "SQL Analytics & Reporting Engine", slug: "sql-analytics-reporting-engine",
    description: "Advanced SQL-based analytics system for extracting actionable business insights from large-scale banking transaction datasets.",
    case_study: `## The Problem\n\nThe data team was spending 60% of their time writing repetitive SQL queries for ad-hoc report requests.\n\n## Solution\n\nBuilt a comprehensive SQL analytics framework with standardized query templates, materialized views, stored procedures, and documentation.\n\n## Results\n\n- Reduced ad-hoc query turnaround from **4 hours to 15 minutes**\n- Standardized **40+ business metrics** across the organization\n- Trained **6 team members** on the query framework`,
    image_url: null, tech_stack: ["SQL", "PostgreSQL", "Python", "Data Analysis", "ETL"],
    github_url: "https://github.com/olatunbosun", live_url: null,
    featured: false, published: true, sort_order: 3,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  "devops-cli-toolkit": {
    id: "4", title: "DevOps CLI Toolkit", slug: "devops-cli-toolkit",
    description: "A collection of Go-based command-line tools for automating repetitive DevOps and data operations tasks.",
    case_study: `## The Problem\n\nRepeatedly performing the same operations: spinning up development environments, running database migrations, managing deployment configurations.\n\n## Solution\n\nBuilt a modular CLI toolkit in Go: db-migrate, health-check, env-setup, and log-parser.\n\n## Results\n\n- Reduced environment setup time from **30 minutes to 2 minutes**\n- Eliminated manual errors in database migration workflows\n- Now used by **5 engineers** daily`,
    image_url: null, tech_stack: ["Go", "CLI", "Cobra", "PostgreSQL", "DevOps"],
    github_url: "https://github.com/olatunbosun", live_url: null,
    featured: false, published: true, sort_order: 4,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
};

async function getProject(slug: string): Promise<Project | null> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return FALLBACK_PROJECTS[slug] || null;
    return data;
  } catch {
    return FALLBACK_PROJECTS[slug] || null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found" };
  
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      ...(project.image_url && {
        images: [
          {
            url: project.image_url,
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      ...(project.image_url && { images: [project.image_url] }),
    },
  };
}

export default async function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <div className="pt-28">
      <section className="section-padding !pt-8">
        <div className="container-custom">
          {/* Back button */}
          <FadeIn>
            <Button variant="ghost" className="mb-8 -ml-4 gap-2" render={<Link href="/projects" />}>
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
            </Button>
          </FadeIn>

          {/* Header */}
          <FadeIn delay={0.1}>
            <div className="max-w-3xl mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          </FadeIn>

          {/* Meta */}
          <FadeIn delay={0.2}>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {/* Tech stack */}
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 ml-auto">
                {project.github_url && (
                  <Button variant="outline" size="sm" className="gap-2" render={<a href={project.github_url} target="_blank" rel="noopener noreferrer" />}>
                      <GithubIcon className="h-4 w-4" /> Source Code
                  </Button>
                )}
                {project.live_url && (
                  <Button size="sm" className="gap-2" render={<a href={project.live_url} target="_blank" rel="noopener noreferrer" />}>
                      <ExternalLink className="h-4 w-4" /> Live Demo
                  </Button>
                )}
              </div>
            </div>
          </FadeIn>

          <Separator className="mb-12" />

          {/* Case Study Content */}
          {project.case_study && (
            <FadeIn delay={0.3}>
              <div className="max-w-3xl prose-custom">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.case_study}
                </ReactMarkdown>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
