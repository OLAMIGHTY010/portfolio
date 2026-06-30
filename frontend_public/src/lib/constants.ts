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
    "Service Monitoring Officer",
    "Data Analyst",
    "Product Builder",
  ],
  summary:
    "Technology-Driven Service Monitoring Officer | Data Analytics | AI & Innovation",
  ctaPrimary: "View My Work",
  ctaSecondary: "Download Resume",
};

export const STATS: StatItem[] = [
  { label: "Years of Experience", value: 9, suffix: "+" },
  { label: "Projects Completed", value: 12, suffix: "+" },
  { label: "Technologies", value: 15, suffix: "+" },
  { label: "Certifications", value: 8, suffix: "+" },
];

// ============================================================
// ABOUT / TIMELINE
// ============================================================
export const ABOUT_STORY = `I am a Service Monitoring Officer with experience in real-time system monitoring, incident reporting, and IT service management for banking operations. I ensure system reliability by rapidly detecting and resolving issues, documenting resolutions for continuous improvement, and improving operational workflows through automation. 

I build integrations and automations using Make (make.com), Zapier, and n8n, leveraging webhooks and API connectors to reduce manual tasks and speed up incident handling. 

I am actively expanding my expertise in Data Analysis (SQL, Power BI, Advanced Excel), and AI (Python) so I can contribute to secure, data-driven, and efficient IT environments.

Beyond my day-to-day operations, I am passionate about data-driven decision-making, and I continuously seek innovative solutions to improve banking processes and service delivery.`;

export const TIMELINE: TimelineItem[] = [
  {
    year: "2019",
    title: "BTech & HND in Computer Engineering Technology",
    institution: "Rufus Giwa Polytechnic",
    description:
      "Graduated with a strong foundation in IT operations, programming, databases, and systems thinking.",
  },
  {
    year: "2019",
    title: "Safety Officer",
    institution: "Mydas Hotel and Suite",
    description:
      "Ensured smooth day-to-day operations by overseeing facility maintenance, security, and emergency response protocols.",
  },
  {
    year: "2022",
    title: "Administrative Assistant",
    institution: "Sampou Community Grammar School",
    description:
      "Managed logistics, coordinated educational activities, and maintained facilities to support student learning.",
  },
  {
    year: "2023",
    title: "Customer Service Officer & Admin Assistant",
    institution: "Polaris Bank & The Leadership Academy",
    description:
      "Delivered exceptional customer experiences, resolved complaints, and implemented activity-based learning programs.",
  },
  {
    year: "2024",
    title: "Service Monitoring Officer",
    institution: "Sterling Bank",
    description:
      "Responsible for real-time transaction monitoring, incident resolution, and process automation.",
  },
];

// ============================================================
// EXPERIENCE
// ============================================================
export const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Monitoring Officer / Associate",
    company: "Sterling Financial Holdings Company",
    period: "May 2024 — Present",
    location: "Lagos, Nigeria",
    description:
      "Expertise in real-time system monitoring and incident management. Skilled in identifying, analyzing, and resolving service disruptions to ensure seamless operations and maintain high service availability.",
    responsibilities: [
      "Track and analyze transaction performance using NIBSS Dashboard and other banking systems, ensuring prompt resolution of errors.",
      "Utilize SQL, Power BI, and Excel to generate insights, identify trends, and drive data-backed decisions.",
      "Apply cybersecurity best practices to monitor system vulnerabilities and ensure compliance with industry regulations.",
      "Develop a Python-based card transaction monitoring system with automated reporting and advanced logging features.",
      "Maintain accurate shift schedules using a structured SQL database system, improving team efficiency.",
      "Contributed to the Sterling-to-Sterling intra-bank transaction recovery strategy, leading to improved processing speed.",
      "Developed email reporting automation, reducing manual effort and ensuring timely updates on system performance."
    ],
    technologies: ["SQL", "Power BI", "Excel", "Python", "NIBSS Dashboard", "Cybersecurity"],
  },
  {
    role: "Team Lead – Community Safety Alert App Project",
    company: "3MTT Nigeria",
    period: "March 2025 — September 2025",
    location: "Lagos, Nigeria",
    description:
      "Led the development of the Community Safety Alert App, aimed at enhancing public safety through real-time alerts and community engagement.",
    responsibilities: [
      "Coordinated a team of developers, analysts, and designers to ensure smooth execution, from ideation to implementation.",
      "Managed project timelines, task assignments, and stakeholder communication.",
      "Leveraged cybersecurity principles to secure user data and prevent threats."
    ],
    technologies: ["Project Management", "Cybersecurity", "Team Leadership"],
  },
  {
    role: "Customer Service Officer",
    company: "Polaris Bank Ltd.",
    period: "January 2022 — May 2023",
    location: "Nigeria",
    description:
      "Delivered exceptional customer experiences, resolved complaints promptly, and ensured customer satisfaction.",
    responsibilities: [
      "Managed customer inquiries and resolved complaints promptly, ensuring customer satisfaction.",
      "Handled various communication channels, including phone, email, and in-person interactions, to provide efficient support.",
      "Identified customer pain points, offered tailored solutions, and contributed to process improvements for enhanced service delivery."
    ],
    technologies: ["Customer Service", "Process Improvement", "Communication"],
  },
  {
    role: "Administrative Assistant",
    company: "The Leadership Academy",
    period: "October 2022 — February 2023",
    location: "Nigeria",
    description:
      "Designed and implemented activity-based learning programs that significantly increased student engagement.",
    responsibilities: [
      "Led the introduction of a behavior management program, reducing incidents of unacceptable behavior by 75%.",
      "Designed and implemented activity-based learning programs."
    ],
    technologies: ["Administration", "Program Management"],
  },
  {
    role: "Administrative Assistant",
    company: "Sampou Community Grammar School",
    period: "April 2021 — April 2022",
    location: "Nigeria",
    description:
      "Managed school logistics, coordinated educational activities, and maintained facilities to support student learning.",
    responsibilities: [
      "Managed school logistics and coordinated educational activities.",
      "Set educational standards, developed instructional methods, and ensured smooth program operations."
    ],
    technologies: ["Administration", "Logistics Management"],
  },
  {
    role: "Safety Officer",
    company: "Mydas Hotel and Suite",
    period: "December 2016 — November 2019",
    location: "Nigeria",
    description:
      "Ensured smooth day-to-day operations by overseeing facility maintenance, security, and emergency response protocols.",
    responsibilities: [
      "Overseen facility maintenance, security, and emergency response protocols.",
      "Developed and managed relationships with vendors and workmen, ensuring the hotel met high safety and usability standards."
    ],
    technologies: ["Safety Management", "Operations", "Vendor Management"],
  },
  {
    role: "Information Technology Support Officer",
    company: "Rufus Giwa Polytechnic ICT Centre",
    period: "January 2015 — April 2016",
    location: "Nigeria",
    description:
      "Provided first-level support for hardware, software, and network issues, ensuring minimal system downtime.",
    responsibilities: [
      "Provided first-level support for hardware, software, and network issues.",
      "Conducted routine database backup and restoration and assisted in network and system troubleshooting."
    ],
    technologies: ["IT Support", "Hardware", "Networking", "Database Management"],
  },
];

// ============================================================
// SKILLS
// ============================================================
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Monitoring & Operations",
    description:
      "Ensuring system reliability and rapid incident resolution",
    skills: [
      { name: "Real-Time Incident Monitoring" },
      { name: "NIBSS Dashboard" },
      { name: "Transaction Tracking" },
      { name: "IT Service Management" },
      { name: "Cybersecurity Best Practices" },
      { name: "Root Cause Analysis (RCA)" },
      { name: "Shift & Team Coordination" },
      { name: "Hardware & Network Support" },
    ],
  },
  {
    title: "Data Analytics",
    description: "Turning raw data into actionable business intelligence",
    skills: [
      { name: "SQL (PostgreSQL, MySQL)" },
      { name: "Power BI" },
      { name: "Advanced Excel" },
      { name: "Data Management" },
      { name: "Data Modeling" },
      { name: "Data Visualization" },
      { name: "Trend Identification" },
      { name: "Performance Tracking" },
    ],
  },
  {
    title: "Automation & Integration",
    description: "Reducing manual effort through process automation",
    skills: [
      { name: "Python Scripting" },
      { name: "Make (make.com)" },
      { name: "Zapier" },
      { name: "n8n" },
      { name: "API Connectors" },
      { name: "Webhooks" },
      { name: "Email Reporting Automation" },
      { name: "Process Optimization" },
    ],
  },
  {
    title: "Tools & Platforms",
    description: "Professional tools that power my daily workflow",
    skills: [
      { name: "Jira" },
      { name: "GitHub" },
      { name: "VS Code" },
      { name: "Postman" },
      { name: "Grafana" },
      { name: "Transaction Monitoring Systems" },
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
