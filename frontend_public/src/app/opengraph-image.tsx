import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Olatunbosun Olalekan Joy — Full Stack Developer & Business Analyst";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ffffff",
                boxShadow: "0 8px 16px rgba(16, 185, 129, 0.25)",
              }}
            >
              O
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", fontSize: "22px", fontWeight: "700", color: "#f8fafc" }}>
                Olatunbosun Olalekan
                <span style={{ color: "#10b981", marginLeft: "2px" }}>.</span>
              </div>
              <div style={{ fontSize: "14px", color: "#94a3b8" }}>
                Full Stack Developer & Business Analyst
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
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              fontSize: "14px",
              fontWeight: "600",
              color: "#34d399",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
              }}
            />
            <span>Open for Opportunities</span>
          </div>
        </div>

        {/* Hero Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              color: "#38bdf8",
              textTransform: "uppercase",
            }}
          >
            <span>ENGINEERING &amp; FINTECH PORTFOLIO</span>
          </div>

          <div
            style={{
              fontSize: "58px",
              fontWeight: "900",
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
              color: "#ffffff",
              maxWidth: "1060px",
            }}
          >
            Full Stack Developer &amp; Banking Operations Analyst
          </div>

          <div
            style={{
              fontSize: "23px",
              lineHeight: "1.5",
              color: "#94a3b8",
              maxWidth: "1000px",
            }}
          >
            Bridging technical execution with operational reliability. Specializing in real-time banking telemetry, automated anomaly detection, and data-driven systems.
          </div>

          {/* Core Tech Stack Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "4px",
            }}
          >
            {[
              "Python",
              "Go (Golang)",
              "Next.js / React 19",
              "PostgreSQL & SQL",
              "Power BI (DAX)",
              "Service Monitoring",
            ].map((skill) => (
              <div
                key={skill}
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
                {skill}
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
            paddingTop: "22px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "15px", color: "#64748b" }}>
            <span style={{ color: "#94a3b8", fontWeight: "600" }}>portfolio-userview.vercel.app</span>
            <span>•</span>
            <span>github.com/OLAMIGHTY010</span>
            <span>•</span>
            <span>Lagos, Nigeria</span>
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
            <span>Ask My AI Assistant &amp; View Case Studies</span>
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
