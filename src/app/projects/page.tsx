import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/sections/animated-section";
import { ProjectCard } from "@/components/cards/project-card";
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
    title: "Banking Transaction Monitor",
    slug: "banking-transaction-monitor",
    description: "Automated real-time monitoring system that tracks transaction flows, detects anomalies, and triggers instant alerts for the banking operations team.",
    case_study: null,
    image_url: null,
    tech_stack: ["Python", "SQL", "PostgreSQL", "Pandas", "Automation"],
    github_url: "https://github.com/olatunbosun",
    live_url: null,
    featured: true,
    published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Executive Power BI Dashboard Suite",
    slug: "executive-power-bi-dashboard",
    description: "Interactive business intelligence dashboards providing real-time KPI tracking, trend analysis, and executive-level reporting for banking operations.",
    case_study: null,
    image_url: null,
    tech_stack: ["Power BI", "DAX", "SQL", "PostgreSQL", "Data Modeling"],
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
    title: "SQL Analytics & Reporting Engine",
    slug: "sql-analytics-reporting-engine",
    description: "Advanced SQL-based analytics system for extracting actionable business insights from large-scale banking transaction datasets.",
    case_study: null,
    image_url: null,
    tech_stack: ["SQL", "PostgreSQL", "Python", "Data Analysis", "ETL"],
    github_url: "https://github.com/olatunbosun",
    live_url: null,
    featured: false,
    published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "DevOps CLI Toolkit",
    slug: "devops-cli-toolkit",
    description: "A collection of Go-based command-line tools for automating repetitive DevOps and data operations tasks.",
    case_study: null,
    image_url: null,
    tech_stack: ["Go", "CLI", "Cobra", "PostgreSQL", "DevOps"],
    github_url: "https://github.com/olatunbosun",
    live_url: null,
    featured: false,
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

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="pt-28">
      <section className="section-padding !pt-8">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Portfolio
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                My{" "}
                <span className="gradient-text">Projects</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Each project represents a real business problem I analyzed, designed a solution for, and built from the ground up.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
