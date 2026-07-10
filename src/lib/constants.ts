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
    linkedin: "https://linkedin.com/in/olatunbosun-olalekan",
    github: "https://github.com/olatunbosun",
    email: "olatunbosun.olalekan@gmail.com",
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
    year: "2016",
    title: "National Diploma (ND)",
    institution: "Rufus Giwa Polytechnic, Owo",
    description:
      "Studied Computer Engineering Technology, building a strong foundation in hardware, software, and systems engineering.",
  },
  {
    year: "2019",
    title: "Higher National Diploma (HND)",
    institution: "Rufus Giwa Polytechnic, Owo",
    description:
      "Advanced studies in Computer Engineering Technology, focusing on complex systems, programming, and IT infrastructure.",
  },
  {
    year: "2022",
    title: "Customer Service Officer",
    institution: "Polaris Bank Plc",
    description:
      "Managed high-volume customer inquiries and provided specialized technical support for digital banking platforms.",
  },
  {
    year: "2024",
    title: "Service Monitoring Officer",
    institution: "Sterling Bank Plc",
    description:
      "Monitored critical core banking applications and digital payment services, preventing downtime through data analysis.",
  },
  {
    year: "2025",
    title: "Software Development Program",
    institution: "Learn2Earn Fellowship",
    description:
      "Undertaking intensive software development training focused on modern full-stack technologies and industry best practices.",
  },
];

// ============================================================
// EXPERIENCE
// ============================================================
export const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Service Monitoring Officer",
    company: "Sterling Bank Plc",
    period: "June 2024 — Present",
    location: "Lagos, Nigeria",
    description:
      "Monitor critical core banking applications and digital payment services to ensure 99.9% system availability and optimal performance.",
    responsibilities: [
      "Monitor critical core banking applications and digital payment services using DataDog and enterprise APM tools.",
      "Analyze high-volume transaction data and incident logs utilizing SQL and Excel to detect anomalies, isolate failure trends, and mitigate risks.",
      "Design and deploy interactive Power BI dashboards tracking Key Performance Indicators (KPIs) and operational metrics.",
      "Conduct deep-dive Root Cause Analysis (RCA) on critical application failures.",
      "Collaborate with DevOps and infrastructure teams to implement permanent fixes."
    ],
    technologies: [
      "DataDog",
      "APM Tools",
      "SQL",
      "Excel",
      "Power BI",
      "PostgreSQL"
    ],
  },
  {
    role: "Low-Code / No-Code Automation Mentor",
    company: "Lobby AI",
    period: "2024",
    location: "Lagos, Nigeria",
    description:
      "Mentored students in building complex, automated workflows without traditional programming.",
    responsibilities: [
      "Mentored students utilizing platforms such as Zapier, Airtable, and Make.",
      "Developed curriculum and guided hands-on projects.",
      "Empowered students to streamline business operations and reduce manual data entry tasks."
    ],
    technologies: [
      "Zapier",
      "Make",
      "Airtable",
      "n8n",
      "Automation"
    ],
  },
  {
    role: "Customer Service Officer",
    company: "Polaris Bank Plc",
    period: "2022 — 2024",
    location: "Lagos, Nigeria",
    description:
      "Managed high-volume customer inquiries and provided specialized technical support for digital banking platforms.",
    responsibilities: [
      "Provided specialized technical support for digital banking platforms, significantly boosting first-contact resolution rates.",
      "Collaborated closely with backend operations, risk, and compliance teams.",
      "Resolved complex transactional disputes.",
      "Ensured strict policy and regulatory adherence."
    ],
    technologies: [
      "CRM Tools",
      "Core Banking Applications",
      "Jira",
      "Confluence"
    ],
  },
  {
    role: "Assistant Team Lead & Intern",
    company: "3MTT",
    period: "2024",
    location: "Lagos, Nigeria",
    description:
      "Served as Assistant Team Lead for a cross-functional group of interns during the 3MTT program.",
    responsibilities: [
      "Directed the planning and development of the Community Safety Shield project.",
      "Coordinated tasks and tracked milestones across the team.",
      "Ensured successful delivery of the community initiative."
    ],
    technologies: [
      "Project Management",
      "Agile/Scrum",
      "Team Leadership"
    ],
  }
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
