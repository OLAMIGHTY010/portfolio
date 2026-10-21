import { NextRequest, NextResponse } from "next/server";

// Comprehensive knowledge base about Olalekan
const SYSTEM_PROMPT = `
You are the official AI Portfolio Assistant for Olatunbosun Joy Olalekan.
Your goal is to represent Olalekan professionally, accurately, and enthusiastically to tech recruiters, hiring managers, and prospective clients.

KEY PROFILE SUMMARY:
- Full Name: Olatunbosun Joy Olalekan
- Roles: Full Stack Developer & Business / Data Analyst
- Location: Lagos, Nigeria
- Email: nanicomlekan111@gmail.com
- GitHub: https://github.com/OLAMIGHTY010
- LinkedIn: https://www.linkedin.com/in/olatunbosun-olalekan/
- Education: Higher National Diploma (HND) in Computer Science from Rufus Giwa Polytechnic; Learn2Earn Tech Fellowship.

PROFESSIONAL EXPERIENCE:
- Service Monitoring Officer (Banking Operations — Marina, Lagos, 2023 — Present):
  * Monitors real-time transaction flows across all major banking channels: Mobile App, USSD, Web Banking, ATM, and POS.
  * Detects, escalates, and manages critical banking service incidents to reduce Mean Time to Resolution (MTTR).
  * Performs Root Cause Analysis (RCA) for disruptions and presents post-incident reviews.
  * Builds and maintains monitoring dashboards using SQL and Power BI.
  * Collaborates with engineering teams on service reliability, alerts, and threshold configurations.

TECHNICAL SKILLS & TOOLKIT:
- Languages: TypeScript, JavaScript, Go (Golang), Python, SQL
- Frontend: Next.js, React, Tailwind CSS, Framer Motion
- Backend & DB: Node.js, Go, PostgreSQL, Supabase, REST APIs
- Business Analysis & Data: Power BI (DAX, Modeling), Python (Pandas, NumPy), Process Mapping (BPMN), Requirements Gathering, Agile/Scrum, Jira, Confluence, Grafana
- Tools: Git, GitHub, Docker, Postman, Vercel

FEATURED PROJECTS:
1. Banking Transaction Monitor: Automated real-time monitoring system tracking high-volume transaction flows, detecting anomalies, and triggering instant alerts. Stack: Python, PostgreSQL, Pandas, SQL.
2. Executive Power BI Dashboard: Interactive business intelligence dashboard providing C-level operational KPIs, availability tracking, and executive reports. Stack: Power BI, DAX, SQL, Data Modeling.
3. DevOps CLI Toolkit: Go-based CLI tool automating repetitive DevOps, data synchronization, and infrastructure operations. Stack: Go, Cobra, PostgreSQL.
4. Portfolio CMS: Full-stack portfolio and CMS built with Next.js 16, React 19, Supabase, and Resend for real-time messaging and admin control.

TONE & GUIDELINES:
- Be polite, professional, concise, and articulate.
- Highlight both his technical software engineering capabilities and his business analyst / fintech domain expertise.
- Format responses cleanly using Markdown (bullet points, bold text).
- If asked about hiring or contacting Olalekan, encourage them to use the Contact page or email him directly at nanicomlekan111@gmail.com.
`;

// Local fallback answers if no external LLM API key is configured
function getLocalFallbackAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("banking") || q.includes("monitor") || q.includes("service") || q.includes("incident") || q.includes("mttr")) {
    return `### 🏦 Banking Operations & Monitoring Experience
Olalekan currently works as a **Service Monitoring Officer** in banking operations (Marina, Lagos):
- **Channel Coverage:** Monitors high-volume real-time transactions across **Mobile, USSD, Web, ATM, and POS**.
- **Incident Management:** Detects system anomalies, conducts **Root Cause Analysis (RCA)**, and reduces **MTTR** using structured escalation protocols.
- **Dashboards & Alerting:** Builds and maintains real-time SQL queries, Power BI dashboards, and proactive alerting thresholds to prevent customer impact.`;
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("language") || q.includes("python") || q.includes("golang") || q.includes("react")) {
    return `### 🛠️ Technical Stack & Skills
Olalekan combines full-stack software development with data and business analysis:
- **Languages:** TypeScript, JavaScript, Go (Golang), Python, SQL
- **Frameworks & Web:** Next.js, React, Tailwind CSS, Node.js
- **Databases & Cloud:** PostgreSQL, Supabase, REST APIs, Vercel
- **Data & Business Analysis:** Power BI, DAX, Pandas/NumPy, Process Mapping (BPMN), Jira, Grafana, Agile/Scrum`;
  }

  if (q.includes("project") || q.includes("work") || q.includes("portfolio")) {
    return `### 🚀 Top Featured Projects
1. **Banking Transaction Monitor:** Automated real-time transaction tracker that detects anomaly spikes and triggers instant alerts (Python, PostgreSQL, Pandas).
2. **Executive Power BI Dashboard:** Interactive business intelligence tool providing real-time KPI tracking and executive-level SLA reporting (Power BI, DAX, SQL).
3. **DevOps CLI Toolkit:** High-performance Go-based command line automation tool for data and infrastructure workflows (Go, Cobra, PostgreSQL).
4. **Portfolio CMS Platform:** Modern web application built with Next.js 16, React 19, and Supabase.`;
  }

  if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("reach") || q.includes("resume") || q.includes("cv")) {
    return `### 📬 Get in Touch with Olalekan
- **Email:** [nanicomlekan111@gmail.com](mailto:nanicomlekan111@gmail.com)
- **LinkedIn:** [linkedin.com/in/olatunbosun-olalekan](https://www.linkedin.com/in/olatunbosun-olalekan/)
- **GitHub:** [github.com/OLAMIGHTY010](https://github.com/OLAMIGHTY010)
- **Contact Form:** You can send a direct message through the [Contact Page](/contact).
- **Resume:** Available for download in the navigation bar or by pressing **Cmd + K**!`;
  }

  if (q.includes("education") || q.includes("background") || q.includes("school") || q.includes("polytechnic")) {
    return `### 🎓 Education & Background
- **Higher National Diploma (HND) in Computer Science:** Rufus Giwa Polytechnic — strong foundation in systems thinking, database architecture, and algorithms.
- **Learn2Earn Tech Fellowship:** Intensive immersion in business analysis, practical software engineering, and stakeholder management.
- **Primary & Secondary:** Complete Child Academy & Owo High School (strong analytical and mathematical foundation).`;
  }

  return `### Hello! 👋
I'm Olalekan's AI Assistant. I can tell you about:
- **Banking Operations:** His real-time transaction monitoring and incident management work.
- **Tech Stack:** Full-stack development with Go, Python, TypeScript, Next.js, and PostgreSQL.
- **Data & BI:** Power BI, DAX modeling, SQL pipelines, and BPMN process mapping.
- **Projects & Hiring:** How to view his case studies or get in touch for opportunities.

Feel free to ask a specific question or click one of the suggested prompts!`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.content || "";

    // 1. Check if Google Gemini API key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const contents = [
          {
            role: "user",
            parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${userPrompt}` }],
          },
        ];

        const resp = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiReply) {
            return NextResponse.json({ reply: aiReply });
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local engine:", err);
      }
    }

    // 2. Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      try {
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.slice(-6),
            ],
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const reply = data?.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to local engine:", err);
      }
    }

    // 3. Fallback: Local Semantic Knowledge Engine (always instant & reliable)
    const reply = getLocalFallbackAnswer(userPrompt);
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Failed to generate reply" },
      { status: 500 }
    );
  }
}
