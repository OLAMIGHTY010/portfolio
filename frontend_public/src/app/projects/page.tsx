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
  { id: "1", title: "piscine-go", slug: "piscine-go", description: "A Go programming repository for learning and building fundamental tools.", case_study: null, image_url: null, tech_stack: ["Go"], github_url: "https://github.com/OLAMIGHTY010/piscine-go", live_url: null, featured: false, published: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "2", title: "FlowMart", slug: "flowmart", description: "FlowMart is a smart last-mile commerce and distribution platform for RCCG Redemption Camp.", case_study: null, image_url: null, tech_stack: ["TypeScript", "Next.js", "E-commerce"], github_url: "https://github.com/OLAMIGHTY010/flowmart", live_url: null, featured: true, published: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "3", title: "Python for Visuals", slug: "python-for-visuals", description: "Python scripts and notebooks for data visualization.", case_study: null, image_url: null, tech_stack: ["Python", "Data Visualization"], github_url: "https://github.com/OLAMIGHTY010/python-for-visuals", live_url: null, featured: false, published: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "4", title: "Portfolio", slug: "portfolio", description: "My personal portfolio website built with Next.js.", case_study: null, image_url: null, tech_stack: ["TypeScript", "Next.js"], github_url: "https://github.com/OLAMIGHTY010/portfolio", live_url: null, featured: false, published: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "5", title: "One-Scheduler", slug: "one-scheduler", description: "one-Scheduler is a web-based shift management system that automates team scheduling.", case_study: null, image_url: null, tech_stack: ["TypeScript", "Next.js", "Management System"], github_url: "https://github.com/OLAMIGHTY010/one_schedular", live_url: null, featured: true, published: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "6", title: "BI Analyst Case Study", slug: "bi-analyst-case-study", description: "Business Intelligence case study.", case_study: null, image_url: null, tech_stack: ["Python", "Business Intelligence"], github_url: "https://github.com/OLAMIGHTY010/bi-analyst-case-study", live_url: null, featured: false, published: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "7", title: "SQL for Data Analysis", slug: "sql-for-data-analysis", description: "SQL scripts for data analysis.", case_study: null, image_url: null, tech_stack: ["SQL", "Data Analysis"], github_url: "https://github.com/OLAMIGHTY010/SQL-FOR-DATA-ANALYSIS", live_url: null, featured: false, published: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "8", title: "AutomateX Website", slug: "automatex-website", description: "Landing page for AutomateX.", case_study: null, image_url: null, tech_stack: ["HTML", "CSS"], github_url: "https://github.com/OLAMIGHTY010/automatex-website", live_url: null, featured: false, published: true, sort_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "9", title: "One Timetable Scheduler Team", slug: "onetimetableschedular-team", description: "Team collaboration repository for the one-timetable scheduler.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/OLAMIGHTY010/onetimetableschedular_team", live_url: null, featured: false, published: true, sort_order: 9, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "10", title: "Schedule Generator", slug: "schedule-generator", description: "Automated schedule generation tool.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/Wunderkind23/Schedule-generator", live_url: null, featured: false, published: true, sort_order: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "11", title: "Time Table Generator", slug: "time-table-generator", description: "Timetable generation application.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/OLAMIGHTY010/TIME_TABLE_GENERATOR", live_url: null, featured: false, published: true, sort_order: 11, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "12", title: "Olatunbosun Olalekan Profile", slug: "olatunbosun-olalekan", description: "My GitHub profile repository.", case_study: null, image_url: null, tech_stack: ["Markdown"], github_url: "https://github.com/OLAMIGHTY010/Olatunbosun_Olalekan", live_url: null, featured: false, published: true, sort_order: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "13", title: "Demo Repository", slug: "demo-repository", description: "Demo repository for Flow-Mart.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/Flow-Mart/demo-repository", live_url: null, featured: false, published: true, sort_order: 13, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "14", title: "Forex AI Trader", slug: "forex-ai-trader", description: "Automated foreign exchange trading bot using AI.", case_study: null, image_url: null, tech_stack: ["Python", "AI", "Trading"], github_url: "https://github.com/OLAMIGHTY010/forex-ai-trader", live_url: null, featured: false, published: true, sort_order: 14, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "15", title: "ATM Dashboard Analysis", slug: "atm-dashboard-analysis", description: "Data analysis project for ATM transactions.", case_study: null, image_url: null, tech_stack: ["Python", "Data Analysis"], github_url: "https://github.com/OLAMIGHTY010/ATM_DASHBOARD_ANALYSIS", live_url: null, featured: true, published: true, sort_order: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "16", title: "Timetable Improved", slug: "timetable-improved", description: "Improved version of the timetable generation system.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/Timetable_improved", live_url: null, featured: false, published: true, sort_order: 16, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "17", title: "One Timetable Scheduler", slug: "onetimetableschedular", description: "Original one-timetable scheduler repository.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/OLAMIGHTY010/onetimetableschedular", live_url: null, featured: false, published: true, sort_order: 17, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "18", title: "Afristore Marketplace", slug: "marketplace", description: "Afristore marketplace platform.", case_study: null, image_url: null, tech_stack: ["TypeScript", "Next.js"], github_url: "https://github.com/Afristore/marketplace", live_url: null, featured: false, published: true, sort_order: 18, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "19", title: "SwiftChain Frontend", slug: "swiftchain-frontend", description: "Frontend for SwiftChain application.", case_study: null, image_url: null, tech_stack: ["TypeScript", "Next.js"], github_url: "https://github.com/SwiftChainn/SwiftChain_Frontend", live_url: null, featured: false, published: true, sort_order: 19, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "20", title: "OpenAI Python", slug: "openai-python", description: "Python library for the OpenAI API.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/openai-python", live_url: null, featured: false, published: true, sort_order: 20, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "21", title: "Prompts Chat", slug: "prompts-chat", description: "A collection of awesome ChatGPT prompts.", case_study: null, image_url: null, tech_stack: ["Markdown"], github_url: "https://github.com/OLAMIGHTY010/prompts.chat", live_url: null, featured: false, published: true, sort_order: 21, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "22", title: "Prompt Basics", slug: "prompt-basics", description: "Basic prompt engineering examples.", case_study: null, image_url: null, tech_stack: ["Markdown"], github_url: "https://github.com/OLAMIGHTY010/prompt-basics", live_url: null, featured: false, published: true, sort_order: 22, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "23", title: "AI Ethics", slug: "ai-ethics", description: "Research on AI ethics.", case_study: null, image_url: null, tech_stack: ["Python", "Research"], github_url: "https://github.com/OLAMIGHTY010/ai-ethnics", live_url: null, featured: false, published: true, sort_order: 23, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "24", title: "Ethical AI", slug: "ethical-ai", description: "Ethical AI implementation guidelines.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/ethical-ai", live_url: null, featured: false, published: true, sort_order: 24, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "25", title: "Community Safety Alert App Frontend 2", slug: "community-safety-alert-app-frontend-2", description: "Frontend for Community Safety Alert App (v2).", case_study: null, image_url: null, tech_stack: ["TypeScript", "Next.js"], github_url: "https://github.com/Wunderkind23/Community_Safety_Alert_App_Frontend_2", live_url: null, featured: false, published: true, sort_order: 25, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "26", title: "Community Safety Alert App Frontend", slug: "community-safety-alert-app-frontend", description: "Frontend for Community Safety Alert App.", case_study: null, image_url: null, tech_stack: ["TypeScript", "Next.js"], github_url: "https://github.com/3mttlagos/Community_Safety_Alert_App_Frontend", live_url: null, featured: false, published: true, sort_order: 26, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "27", title: "Community Safety Alert App Backend", slug: "community-safety-alert-app-backend", description: "Backend API for the Community Safety Alert App.", case_study: null, image_url: null, tech_stack: ["Python", "Backend"], github_url: "https://github.com/OLAMIGHTY010/Community_Safety_Alert_App_Backend", live_url: null, featured: false, published: true, sort_order: 27, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "28", title: "Community Safety Alert App Backend (3mttlagos)", slug: "community-safety-alert-app-backend-3mttlagos", description: "Backend API for the Community Safety Alert App (3mttlagos fork).", case_study: null, image_url: null, tech_stack: ["Python", "Backend"], github_url: "https://github.com/3mttlagos/Community_Safety_Alert_App_Backend", live_url: null, featured: false, published: true, sort_order: 28, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "29", title: "Community Safety Alert App Backend (Isaac-Arinze)", slug: "community-safety-alert-app-backend-isaac", description: "Backend API for the Community Safety Alert App (Isaac-Arinze fork).", case_study: null, image_url: null, tech_stack: ["Python", "Backend"], github_url: "https://github.com/Isaac-Arinze/Community_Safety_Alert_App_Backend", live_url: null, featured: false, published: true, sort_order: 29, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "30", title: "Community Safety Alert App Backend (Elvinique)", slug: "community-safety-alert-app-backend-elvinique", description: "Backend API for the Community Safety Alert App (Elvinique fork).", case_study: null, image_url: null, tech_stack: ["Python", "Backend"], github_url: "https://github.com/Elvinique/Community_Safety_Alert_App_Backend", live_url: null, featured: false, published: true, sort_order: 30, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
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
