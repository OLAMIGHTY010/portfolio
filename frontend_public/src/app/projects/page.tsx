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
  { id: "1", title: "piscine-go", slug: "piscine-go", description: "OLAMIGHTY010/piscine-go repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/OLAMIGHTY010/piscine-go", live_url: null, featured: false, published: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "2", title: "flowmart", slug: "flowmart", description: "FlowMart is a smart last-mile commerce and distribution platform for RCCG Redemption Camp. It connects vendors, customers, and dispatch riders through a unified marketplace, secure payment system, and automated delivery infrastructure, enabling fast ordering, real-time tracking, and efficient urban commerce operations.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/OLAMIGHTY010/flowmart", live_url: null, featured: false, published: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "3", title: "python-for-visuals", slug: "python-for-visuals", description: "python-for-visuals repository.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/python-for-visuals", live_url: null, featured: false, published: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "4", title: "portfolio", slug: "portfolio", description: "portfolio repository.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/OLAMIGHTY010/portfolio", live_url: null, featured: false, published: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "5", title: "one_schedular", slug: "one_schedular", description: "one-Scheduler is a web-based shift management system that automates team scheduling, leave requests, and shift swaps. It supports role-based access, holiday integration, and analytics, helping teams maintain fair rotation, reduce conflicts, and improve operational efficiency.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/OLAMIGHTY010/one_schedular", live_url: null, featured: false, published: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "6", title: "bi-analyst-case-study", slug: "bi-analyst-case-study", description: "bi-analyst-case-study repository.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/bi-analyst-case-study", live_url: null, featured: false, published: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "7", title: "SQL-FOR-DATA-ANALYSIS", slug: "sql-for-data-analysis", description: "SQL-FOR-DATA-ANALYSIS repository.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/SQL-FOR-DATA-ANALYSIS", live_url: null, featured: false, published: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "8", title: "automatex-website", slug: "automatex-website", description: "automatex-website repository.", case_study: null, image_url: null, tech_stack: ["HTML"], github_url: "https://github.com/OLAMIGHTY010/automatex-website", live_url: null, featured: false, published: true, sort_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "9", title: "onetimetableschedular_team", slug: "onetimetableschedular_team", description: "onetimetableschedular_team repository.", case_study: null, image_url: null, tech_stack: ["HTML"], github_url: "https://github.com/OLAMIGHTY010/onetimetableschedular_team", live_url: null, featured: false, published: true, sort_order: 9, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "10", title: "Schedule-generator", slug: "schedule-generator", description: "Schedule-generator repository.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/Wunderkind23/Schedule-generator", live_url: null, featured: false, published: true, sort_order: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "11", title: "TIME_TABLE_GENERATOR", slug: "time_table_generator", description: "OLAMIGHTY010/TIME_TABLE_GENERATOR repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/OLAMIGHTY010/TIME_TABLE_GENERATOR", live_url: null, featured: false, published: true, sort_order: 11, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "12", title: "Olatunbosun_Olalekan", slug: "olatunbosun_olalekan", description: "Data-driven developer building automation, monitoring, and analytics tools with Python and SQL.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/OLAMIGHTY010/Olatunbosun_Olalekan", live_url: null, featured: false, published: true, sort_order: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "13", title: "demo-repository", slug: "demo-repository", description: "Flow-Mart/demo-repository repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/Flow-Mart/demo-repository", live_url: null, featured: false, published: true, sort_order: 13, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "14", title: "forex-ai-trader", slug: "forex-ai-trader", description: "forex-ai-trader repository.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/forex-ai-trader", live_url: null, featured: false, published: true, sort_order: 14, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "15", title: "ATM_DASHBOARD_ANALYSIS", slug: "atm_dashboard_analysis", description: "ATM_DASHBOARD_ANALYSIS repository.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/ATM_DASHBOARD_ANALYSIS", live_url: null, featured: false, published: true, sort_order: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "16", title: "Timetable_improved", slug: "timetable_improved", description: "Timetable_improved repository.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/Timetable_improved", live_url: null, featured: false, published: true, sort_order: 16, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "17", title: "onetimetableschedular", slug: "onetimetableschedular", description: "OLAMIGHTY010/onetimetableschedular repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/OLAMIGHTY010/onetimetableschedular", live_url: null, featured: false, published: true, sort_order: 17, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "18", title: "marketplace", slug: "marketplace", description: "The on-chain marketplace for authenticated African art.", case_study: null, image_url: null, tech_stack: ["TypeScript"], github_url: "https://github.com/Afristore/marketplace", live_url: null, featured: false, published: true, sort_order: 18, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "19", title: "SwiftChain_Frontend", slug: "swiftchain_frontend", description: "SwiftChain-Frontend is the user interface for the SwiftChain logistics platform, built with Next.js, TypeScript, and TailwindCSS. It enables users and administrators to manage deliveries, shipments, and drivers while interacting with backend APIs and Stellar blockchain escrow services for secure logistics transactions.", case_study: null, image_url: null, tech_stack: ["JavaScript"], github_url: "https://github.com/SwiftChainn/SwiftChain_Frontend", live_url: null, featured: false, published: true, sort_order: 19, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "20", title: "openai-python", slug: "openai-python", description: "The official Python library for the OpenAI API", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/OLAMIGHTY010/openai-python", live_url: null, featured: false, published: true, sort_order: 20, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "21", title: "prompts.chat", slug: "prompts.chat", description: "a.k.a. Awesome ChatGPT Prompts. Share, discover, and collect prompts from the community. Free and open source — self-host for your organization with complete privacy.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/OLAMIGHTY010/prompts.chat", live_url: null, featured: false, published: true, sort_order: 21, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "22", title: "prompt-basics", slug: "prompt-basics", description: "prompt-basics repository.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/prompt-basics", live_url: null, featured: false, published: true, sort_order: 22, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "23", title: "ai-ethnics", slug: "ai-ethnics", description: "ai-ethnics repository.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/ai-ethnics", live_url: null, featured: false, published: true, sort_order: 23, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "24", title: "ethical-ai", slug: "ethical-ai", description: "ethical-ai repository.", case_study: null, image_url: null, tech_stack: ["Python"], github_url: "https://github.com/OLAMIGHTY010/ethical-ai", live_url: null, featured: false, published: true, sort_order: 24, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "25", title: "Community_Safety_Alert_App_Frontend_2", slug: "community_safety_alert_app_frontend_2", description: "Wunderkind23/Community_Safety_Alert_App_Frontend_2 repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/Wunderkind23/Community_Safety_Alert_App_Frontend_2", live_url: null, featured: false, published: true, sort_order: 25, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "26", title: "Community_Safety_Alert_App_Frontend", slug: "community_safety_alert_app_frontend", description: "3mttlagos/Community_Safety_Alert_App_Frontend repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/3mttlagos/Community_Safety_Alert_App_Frontend", live_url: null, featured: false, published: true, sort_order: 26, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "27", title: "Community_Safety_Alert_App_Backend", slug: "community_safety_alert_app_backend", description: "OLAMIGHTY010/Community_Safety_Alert_App_Backend repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/OLAMIGHTY010/Community_Safety_Alert_App_Backend", live_url: null, featured: false, published: true, sort_order: 27, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "28", title: "Community_Safety_Alert_App_Backend", slug: "community_safety_alert_app_backend", description: "3mttlagos/Community_Safety_Alert_App_Backend repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/3mttlagos/Community_Safety_Alert_App_Backend", live_url: null, featured: false, published: true, sort_order: 28, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "29", title: "Community_Safety_Alert_App_Backend", slug: "community_safety_alert_app_backend", description: "Isaac-Arinze/Community_Safety_Alert_App_Backend repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/Isaac-Arinze/Community_Safety_Alert_App_Backend", live_url: null, featured: false, published: true, sort_order: 29, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "30", title: "Community_Safety_Alert_App_Backend", slug: "community_safety_alert_app_backend", description: "Elvinique/Community_Safety_Alert_App_Backend repository.", case_study: null, image_url: null, tech_stack: [], github_url: "https://github.com/Elvinique/Community_Safety_Alert_App_Backend", live_url: null, featured: false, published: true, sort_order: 30, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
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
