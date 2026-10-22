import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Olatunbosun Olalekan Joy";
    const description =
      searchParams.get("description") ||
      "Full Stack Developer & Business Analyst | Banking Operations, Python, Go, Next.js & Power BI";
    const category = searchParams.get("category") || "PORTFOLIO & CASE STUDIES";
    const rawTags = searchParams.get("tags") || "Python,Go,Next.js,PostgreSQL,Power BI,SQL";
    const tags = rawTags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5);

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
              "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.18) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.18) 0%, transparent 45%)",
            padding: "54px 64px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#f8fafc",
            boxSizing: "border-box",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Top Bar / Branding */}
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
              <span>Open to Opportunities</span>
            </div>
          </div>

          {/* Main Body Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            {category && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.15em",
                  color: "#38bdf8",
                  textTransform: "uppercase",
                }}
              >
                {category}
              </div>
            )}

            <div
              style={{
                fontSize: title.length > 40 ? "46px" : "56px",
                fontWeight: "800",
                lineHeight: "1.15",
                letterSpacing: "-0.02em",
                color: "#ffffff",
                maxWidth: "1050px",
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
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </div>

            {/* Tech Badges */}
            {tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                {tags.map((tag) => (
                  <div
                    key={tag}
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
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Bar */}
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
              <span>Explore Portfolio</span>
              <span>→</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 });
  }
}
