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
    title: "FlowMart",
    slug: "flowmart",
    description: "FlowMart is a smart last-mile commerce and distribution platform for RCCG Redemption Camp. It connects vendors, customers, and dispatch riders through a unified marketplace, secure payment system, and automated delivery infrastructure, enabling fast ordering, real-time tracking, and efficient urban commerce operations.",
    case_study: null,
    image_url: null,
    tech_stack: ["TypeScript", "Next.js", "E-commerce", "Marketplace"],
    github_url: "https://github.com/OLAMIGHTY010/flowmart",
    live_url: null,
    featured: true,
    published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "One-Scheduler",
    slug: "one-scheduler",
    description: "one-Scheduler is a web-based shift management system that automates team scheduling, leave requests, and shift swaps. It supports role-based access, holiday integration, and analytics, helping teams maintain fair rotation, reduce conflicts, and improve operational efficiency.",
    case_study: null,
    image_url: null,
    tech_stack: ["TypeScript", "Next.js", "Management System", "Scheduling"],
    github_url: "https://github.com/OLAMIGHTY010/one_schedular",
    live_url: null,
    featured: true,
    published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "ATM Dashboard Analysis",
    slug: "atm-dashboard-analysis",
    description: "Data analysis project focusing on ATM transaction data to generate insights, optimize cash replenishment, and monitor ATM health status using advanced analytical techniques.",
    case_study: null,
    image_url: null,
    tech_stack: ["Python", "Data Analysis", "Dashboard", "Analytics"],
    github_url: "https://github.com/OLAMIGHTY010/ATM_DASHBOARD_ANALYSIS",
    live_url: null,
    featured: true,
    published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Forex AI Trader",
    slug: "forex-ai-trader",
    description: "An automated foreign exchange trading bot that leverages artificial intelligence to analyze market trends, predict price movements, and execute trades autonomously.",
    case_study: null,
    image_url: null,
    tech_stack: ["Python", "AI", "Trading", "Finance"],
    github_url: "https://github.com/OLAMIGHTY010/forex-ai-trader",
    live_url: null,
    featured: false,
    published: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "SQL for Data Analysis",
    slug: "sql-for-data-analysis",
    description: "A comprehensive collection of advanced SQL scripts, queries, and techniques designed for data wrangling, analytics, and business intelligence reporting.",
    case_study: null,
    image_url: null,
    tech_stack: ["SQL", "Data Analysis", "Analytics", "Database"],
    github_url: "https://github.com/OLAMIGHTY010/SQL-FOR-DATA-ANALYSIS",
    live_url: null,
    featured: false,
    published: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "BI Analyst Case Study",
    slug: "bi-analyst-case-study",
    description: "A comprehensive business intelligence case study demonstrating data modeling, complex queries, visualization, and actionable insights generation.",
    case_study: null,
    image_url: null,
    tech_stack: ["Python", "Business Intelligence", "Data Visualization", "SQL"],
    github_url: "https://github.com/OLAMIGHTY010/bi-analyst-case-study",
    live_url: null,
    featured: false,
    published: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    title: "AutomateX Website",
    slug: "automatex-website",
    description: "A modern HTML-based landing page and website for AutomateX, showcasing automation services, clear calls to action, and responsive design.",
    case_study: null,
    image_url: null,
    tech_stack: ["HTML", "CSS", "Web Design", "Frontend"],
    github_url: "https://github.com/OLAMIGHTY010/automatex-website",
    live_url: null,
    featured: false,
    published: true,
    sort_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    title: "AI Ethics & Ethical AI",
    slug: "ai-ethics",
    description: "Research and practical implementation guidelines focusing on ethical considerations, bias mitigation, and responsible AI practices in machine learning models.",
    case_study: null,
    image_url: null,
    tech_stack: ["Python", "AI Ethics", "Machine Learning", "Research"],
    github_url: "https://github.com/OLAMIGHTY010/ai-ethnics",
    live_url: null,
    featured: false,
    published: true,
    sort_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
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
