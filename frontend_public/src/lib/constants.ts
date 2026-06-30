import type {
  NavItem,
  TimelineItem,
  ExperienceItem,
  SkillCategory,
  StatItem,
} from "./types";

// ============================================================
// SITE METADATA
// ============================================================
export const SITE_CONFIG = {
  name: "Olatunbosun Olalekan",
  title: "Olatunbosun Olalekan — Business Analyst | Data Analyst | Product Builder",
  description:
    "I transform business problems into scalable digital solutions using data, technology, and product thinking.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://olatunbosun.dev",
  ogImage: "/images/og-default.png",
  links: {
    linkedin: "https://www.linkedin.com/in/olatunbosun-olalekan",
    github: "https://github.com/OLAMIGHTY010",
    email: "Nanicomlekan111@gmail.com",
  },
};

// ============================================================
// NAVIGATION
// ============================================================
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "FlowMart", href: "/flowmart" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "Certifications", href: "/certifications" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Inbox", href: "/admin/inbox" },
];

// ============================================================
// HERO & STATS
// ============================================================
export const HERO = {
  greeting: "Hi, I'm",
  name: "OLATUNBOSUN OLALEKAN",
  roles: [
    "Business Analyst",
    "Data Analyst",
    "Business Intelligence Analyst",
    "Product Builder",
  ],
  summary:
    "I transform business problems into scalable digital solutions using data, technology, and product thinking.",
  ctaPrimary: "View My Work",
  ctaSecondary: "Download Resume",
};

export const STATS: StatItem[] = [
  { label: "Years of Experience", value: 5, suffix: "+" },
  { label: "Projects Completed", value: 12, suffix: "+" },
  { label: "Technologies", value: 15, suffix: "+" },
  { label: "Certifications", value: 8, suffix: "+" },
];

// ============================================================
// ABOUT / TIMELINE
// ============================================================
export const ABOUT_STORY = `I started my career in banking operations, where I learned the art of precision, attention to detail, and high-stakes problem solving. Every day, I monitored thousands of transactions in real-time, investigated incidents, and communicated with stakeholders across multiple departments.

But I wanted to do more than observe — I wanted to build. That drive led me to learn SQL and Power BI, which transformed my approach to operations. Instead of reacting to problems, I started predicting them. Instead of manual reports, I built automated dashboards that leadership relied on daily.

Then I discovered programming. Python for automation. Go for performance. Next.js for the web. Each tool expanded what I could build and the impact I could have.

Today, I'm building **FlowMart** — an inventory and sales management platform for small businesses in Nigeria. It combines everything I've learned: understanding real business problems, analyzing data to validate solutions, and engineering products that people actually use.

I believe the best technologists are those who understand the business deeply enough to know what to build, and have the technical skill to build it well. That intersection — where business meets technology — is where I live.`;

export const TIMELINE: TimelineItem[] = [
  {
    year: "2012",
    title: "Primary Education",
    institution: "Complete Child Academy",
    description:
      "Foundation years where curiosity and problem-solving skills were first nurtured.",
  },
  {
    year: "2015",
    title: "Secondary Education",
    institution: "Owo High School",
    description:
      "Developed strong analytical thinking and a passion for mathematics and science.",
  },
  {
    year: "2019",
    title: "Higher National Diploma",
    institution: "Rufus Giwa Polytechnic",
    description:
      "Studied Computer Science, building a solid foundation in programming, databases, and systems thinking.",
  },
  {
    year: "2022",
    title: "Tech Fellowship",
    institution: "Learn2Earn Fellowship",
    description:
      "Intensive program focused on practical tech skills, business analysis, and professional development.",
  },
  {
    year: "2023",
    title: "Professional Deployment",
    institution: "NJFP — Marina, Lagos",
    description:
      "Deployed as a Service Monitoring Officer in the banking sector, handling real-time transaction monitoring and incident management.",
  },
];

// ============================================================
// EXPERIENCE
// ============================================================
export const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Service Monitoring Officer",
    company: "Banking Operations — Marina, Lagos",
    period: "2023 — Present",
    location: "Lagos, Nigeria",
    description:
      "Responsible for real-time monitoring of banking transactions, incident management, root cause analysis, and ensuring service availability across all channels.",
    responsibilities: [
      "Monitor real-time transaction flows across all banking channels (Mobile, USSD, Web, ATM, POS) to ensure service availability and performance",
      "Detect, escalate, and manage incidents using structured escalation protocols, reducing mean time to resolution (MTTR)",
      "Conduct root cause analysis (RCA) for service disruptions and document findings for post-incident reviews",
      "Communicate with cross-functional stakeholders including engineering, operations, and management during critical incidents",
      "Generate daily, weekly, and monthly service availability and performance reports for senior management",
      "Maintain and improve monitoring dashboards using SQL queries and Power BI visualizations",
      "Implement proactive monitoring alerts and threshold configurations to prevent incidents before they impact customers",
      "Collaborate with the engineering team on system reliability improvements based on incident trends and pattern analysis",
    ],
    technologies: [
      "SQL",
      "Power BI",
      "Python",
      "Excel",
      "Jira",
      "Grafana",
      "Transaction Monitoring Systems",
    ],
  },
];

// ============================================================
// SKILLS
// ============================================================
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Business Analysis",
    description:
      "Bridging the gap between business needs and technical solutions",
    skills: [
      { name: "Requirements Gathering" },
      { name: "Stakeholder Management" },
      { name: "Process Mapping (BPMN)" },
      { name: "User Stories & Acceptance Criteria" },
      { name: "Business Case Development" },
      { name: "Gap Analysis" },
      { name: "Agile/Scrum Methodology" },
      { name: "Data-Driven Decision Making" },
    ],
  },
  {
    title: "Data Analytics",
    description: "Turning raw data into actionable business intelligence",
    skills: [
      { name: "SQL (PostgreSQL, MySQL)" },
      { name: "Power BI" },
      { name: "Python (Pandas, NumPy)" },
      { name: "Data Modeling" },
      { name: "ETL Pipelines" },
      { name: "Statistical Analysis" },
      { name: "Data Visualization" },
      { name: "Excel Advanced Analytics" },
    ],
  },
  {
    title: "Development",
    description: "Building products from concept to deployment",
    skills: [
      { name: "TypeScript / JavaScript" },
      { name: "Go (Golang)" },
      { name: "Python" },
      { name: "Next.js / React" },
      { name: "Node.js" },
      { name: "PostgreSQL" },
      { name: "REST APIs" },
      { name: "Git & GitHub" },
    ],
  },
  {
    title: "Tools & Platforms",
    description: "Professional tools that power my daily workflow",
    skills: [
      { name: "Jira" },
      { name: "Figma" },
      { name: "VS Code" },
      { name: "Postman" },
      { name: "Supabase" },
      { name: "Vercel" },
      { name: "Power BI Desktop" },
      { name: "Confluence" },
    ],
  },
];

// ============================================================
// FLOWMART
// ============================================================
export const FLOWMART = {
  tagline: "Simplifying Commerce for African Businesses",
  headline: "FlowMart",
  subheadline:
    "An inventory and sales management platform built for small and medium businesses in Nigeria.",
  vision:
    "To empower every small business owner in Africa with the digital tools they need to manage, grow, and scale their operations — without needing technical expertise.",
  mission:
    "Build simple, affordable, and reliable business management software that works for the market trader in Oshodi just as well as it does for the boutique owner in Lekki.",
  problem: {
    title: "The Problem",
    description:
      "Over 40 million MSMEs in Nigeria manage their inventory with paper notebooks, WhatsApp messages, and memory. This leads to stockouts, revenue leakage, inaccurate financial records, and the inability to make data-driven decisions.",
    painPoints: [
      "No visibility into stock levels — stockouts happen without warning",
      "Manual sales tracking leads to revenue leakage and discrepancies",
      "Impossible to generate financial reports for loan applications or growth planning",
      "Existing solutions are too complex, too expensive, or designed for enterprise markets",
    ],
  },
  techStack: [
    "Next.js",
    "Go",
    "PostgreSQL",
    "Supabase",
    "Paystack",
    "Flutterwave",
    "Docker",
    "GitHub Actions",
  ],
  role: {
    title: "Product Builder & Lead Developer",
    description:
      "As the sole builder, I wear multiple hats: product manager, designer, frontend engineer, backend engineer, and business strategist. I define the roadmap, design the UX, architect the system, write the code, and talk to users — every single day.",
  },
  userJourney: [
    {
      step: "Sign Up",
      description: "Business owner creates an account in under 60 seconds",
    },
    {
      step: "Add Inventory",
      description:
        "Upload products with names, prices, quantities, and categories",
    },
    {
      step: "Record Sales",
      description: "Log sales with a single tap — inventory updates automatically",
    },
    {
      step: "Track Performance",
      description: "View daily, weekly, and monthly reports on a clean dashboard",
    },
    {
      step: "Grow",
      description:
        "Use insights to restock smartly, identify top sellers, and plan for growth",
    },
  ],
};
