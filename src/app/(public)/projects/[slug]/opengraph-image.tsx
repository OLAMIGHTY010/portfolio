import { ImageResponse } from "next/og";
import type { Project } from "@/lib/types";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Fallback project details if offline/demo
const FALLBACK_PROJECTS: Record<string, Partial<Project>> = {
  "banking-transaction-monitor": {
    title: "Banking Transaction Monitor",
    description: "Automated real-time monitoring system tracking high-volume transaction flows, detecting anomalies, and triggering instant alerts.",
    tech_stack: ["Python", "SQL", "PostgreSQL", "Pandas", "Automation"],
  },
  "executive-power-bi-dashboard": {
    title: "Executive Power BI Dashboard Suite",
    description: "Interactive business intelligence dashboards providing real-time KPI tracking, trend analysis, and executive-level reporting.",
    tech_stack: ["Power BI", "DAX", "SQL", "PostgreSQL", "Data Modeling"],
  },
  "sql-analytics-reporting-engine": {
    title: "SQL Analytics & Reporting Engine",
    description: "Advanced SQL-based analytics framework for extracting actionable business insights from large-scale banking datasets.",
    tech_stack: ["SQL", "PostgreSQL", "Python", "Data Analysis", "ETL"],
  },
  "devops-cli-toolkit": {
    title: "DevOps CLI Toolkit",
    description: "A collection of Go-based command-line tools for automating repetitive DevOps and data operations tasks.",
    tech_stack: ["Go", "CLI", "Cobra", "PostgreSQL", "DevOps"],
  },
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let project: Partial<Project> | null = FALLBACK_PROJECTS[slug] || null;

  try {
    // Attempt Supabase fetch if env vars available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/projects?slug=eq.${slug}&select=*`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        }
      );
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows[0]) {
          project = rows[0];
        }
      }
    }
  } catch {
    // Use fallback
  }

  const title = project?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const description =
    project?.description ||
    "In-depth technical case study, architecture, results, and proof of work by Olatunbosun Olalekan.";
  const techStack = project?.tech_stack || ["Full Stack", "System Design", "Engineering"];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#090d16",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.22) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.2) 0%, transparent 45%)",
          padding: "54px 64px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#f8fafc",
          boxSizing: "border-box",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              O
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", fontSize: "20px", fontWeight: "700", color: "#f8fafc" }}>
                Olatunbosun Olalekan
                <span style={{ color: "#10b981", marginLeft: "2px" }}>.</span>
              </div>
              <div style={{ fontSize: "14px", color: "#94a3b8" }}>
                Engineering Case Study
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              fontSize: "13px",
              fontWeight: "700",
              color: "#38bdf8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>Verified Project</span>
          </div>
        </div>

        {/* Project Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              color: "#34d399",
              textTransform: "uppercase",
            }}
          >
            <span>CASE STUDY &amp; PROOF OF WORK</span>
          </div>

          <div
            style={{
              fontSize: title.length > 35 ? "48px" : "58px",
              fontWeight: "900",
              lineHeight: "1.12",
              letterSpacing: "-0.03em",
              color: "#ffffff",
              maxWidth: "1060px",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "22px",
              lineHeight: "1.5",
              color: "#94a3b8",
              maxWidth: "1000px",
              display: "-webkit-box",
              overflow: "hidden",
            }}
          >
            {description}
          </div>

          {/* Tech Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "6px",
            }}
          >
            {techStack.slice(0, 5).map((tech) => (
              <div
                key={tech}
                style={{
                  display: "flex",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#e2e8f0",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "15px", color: "#64748b" }}>
            <span style={{ color: "#94a3b8", fontWeight: "600" }}>portfolio-userview.vercel.app</span>
            <span>•</span>
            <span>github.com/OLAMIGHTY010</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#10b981",
            }}
          >
            <span>Read Architecture &amp; Solution</span>
            <span>→</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
