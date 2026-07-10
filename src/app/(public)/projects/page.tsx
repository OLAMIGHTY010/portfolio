import type { Metadata } from "next";
import type { Project } from "@/lib/types";
import { isPlaceholderConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "Portfolio of projects in banking automation, business intelligence, data analytics, and software development.",
};

// Fallback data when Supabase is not connected
const FALLBACK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "FlowMart",
    slug: "flowmart",
    description: "Engineered an end-to-end inventory and sales management SaaS platform built for small and medium businesses in Nigeria to prevent stockouts and revenue leakage.",
    case_study: "FlowMart is an inventory and sales management platform built for small and medium businesses in Nigeria.\n\n### The Problem\nOver 40 million MSMEs in Nigeria manage their inventory with paper notebooks, WhatsApp messages, and memory. This leads to stockouts, revenue leakage, inaccurate financial records, and the inability to make data-driven decisions.\n\n### The Solution\nFlowMart provides simple, affordable, and reliable business management software that works for the market trader in Oshodi just as well as it does for the boutique owner in Lekki.\n\n### Impact\nEmpowers business owners with real-time stock visibility and integrated payments.",
    image_url: null,
    tech_stack: ["Next.js", "Go", "PostgreSQL", "Supabase", "Paystack", "Flutterwave", "Docker", "Vercel"],
    github_url: "https://github.com/OLAMIGHTY010/FlowMart",
    live_url: "https://flowmart.vercel.app",
    featured: true,
    published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Community Safety Shield",
    slug: "community-safety-shield",
    description: "Led a cohort of interns in the design and execution of a community safety solution aimed at resolving local security and reporting challenges.",
    case_study: null,
    image_url: null,
    tech_stack: ["Project Management", "Agile", "Business Analysis", "Requirements Gathering"],
    github_url: null,
    live_url: null,
    featured: true,
    published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "one-Scheduler",
    slug: "one-scheduler",
    description: "Developed a web-based shift management system to automate team scheduling, leave requests, and shift swaps.",
    case_study: null,
    image_url: null,
    tech_stack: ["TypeScript", "Next.js", "React", "Node.js", "Supabase"],
    github_url: "https://github.com/OLAMIGHTY010",
    live_url: "https://one-schedular.vercel.app",
    featured: true,
    published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Operational Analytics Dashboard",
    slug: "operational-analytics-dashboard",
    description: "Developed an end-to-end data pipeline extracting transaction logs via SQL, piped into an engineered Power BI dashboard to track recurring technical failures.",
    case_study: null,
    image_url: null,
    tech_stack: ["Power BI", "SQL", "PostgreSQL", "Data Modeling", "ETL"],
    github_url: null,
    live_url: null,
    featured: true,
    published: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

async function getProjects(): Promise<Project[]> {
  if (isPlaceholderConfig()) return FALLBACK_PROJECTS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return FALLBACK_PROJECTS;
    return data;
  } catch {
    return FALLBACK_PROJECTS;
  }
}

import { ProjectsClient } from "@/components/sections/projects-client";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient projects={projects} />;
}
