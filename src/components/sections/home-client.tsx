"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Database,
  BarChart3,
  Code2,
  Terminal,
  Braces,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsBar } from "@/components/sections/stats-bar";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/sections/animated-section";
import type { SiteSettings } from "@/lib/actions/settings";
import type { DBStat } from "@/lib/actions/stats";
import type { Project } from "@/lib/types";

const floatingIcons = [
  { Icon: Database, x: "10%", y: "20%", delay: 0 },
  { Icon: BarChart3, x: "85%", y: "15%", delay: 0.5 },
  { Icon: Code2, x: "75%", y: "70%", delay: 1 },
  { Icon: Terminal, x: "15%", y: "75%", delay: 1.5 },
  { Icon: Braces, x: "90%", y: "45%", delay: 0.8 },
  { Icon: LineChart, x: "5%", y: "50%", delay: 1.2 },
];

interface HomeClientProps {
  settings: SiteSettings;
  stats: DBStat[];
  featuredProjects: Project[];
}

export function HomeClient({ settings, stats, featuredProjects }: HomeClientProps) {
  // Fallback for projects if empty
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : [
    {
      title: "Banking Transaction Monitor",
      description: "Automated real-time monitoring system that tracks transaction flows, detects anomalies, and triggers instant alerts.",
      tech_stack: ["Python", "SQL", "PostgreSQL", "Pandas"],
      slug: "banking-transaction-monitor",
    },
    {
      title: "Executive Power BI Dashboard",
      description: "Interactive business intelligence dashboards providing real-time KPI tracking and executive-level reporting.",
      tech_stack: ["Power BI", "DAX", "SQL", "Data Modeling"],
      slug: "executive-power-bi-dashboard",
    },
    {
      title: "DevOps CLI Toolkit",
      description: "Go-based command-line tools for automating repetitive DevOps and data operations tasks.",
      tech_stack: ["Go", "CLI", "Cobra", "PostgreSQL"],
      slug: "devops-cli-toolkit",
    },
  ];

  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 mesh-gradient" />

        {/* Floating icons */}
        {floatingIcons.map(({ Icon, x, y, delay }, index) => (
          <motion.div
            key={index}
            className="absolute hidden md:block"
            style={{ left: x, top: y }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          >
            <div className="p-3 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm shadow-sm">
              <Icon className="h-5 w-5 text-primary/60" />
            </div>
          </motion.div>
        ))}

        <div className="container-custom relative z-10 pt-28 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Avatar */}
            {settings.avatar_url && (
              <FadeIn>
                <div className="flex justify-center mb-6">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-background shadow-xl ring-2 ring-primary/20">
                    <img 
                      src={settings.avatar_url} 
                      alt={settings.hero_name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Greeting */}
            <FadeIn delay={0.1}>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm md:text-base text-muted-foreground mb-4 tracking-wide"
              >
                {settings.hero_greeting}
              </motion.p>
            </FadeIn>

            {/* Name */}
            <FadeIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="gradient-text">{settings.hero_name?.trim() ? settings.hero_name.trim() : "OLATUNBOSUN OLALEKAN"}</span>
              </h1>
            </FadeIn>

            {/* Roles */}
            <FadeIn delay={0.3}>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {settings.hero_roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* Summary */}
            <FadeIn delay={0.4}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                {settings.hero_summary}
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.5}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 gap-2 text-base" render={<Link href="/projects" />}>
                  {settings.hero_cta_primary}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 gap-2 text-base"
                  render={<a href={settings.resume_url} download />}
                >
                  <Download className="h-4 w-4" />
                  {settings.hero_cta_secondary}
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </div>
        </motion.div>
      </section>

      {/* ============================== STATS ============================== */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <StatsBar stats={stats} />
        </div>
      </section>

      {/* ============================== FEATURED PROJECTS ============================== */}
      <section className="section-padding">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Portfolio
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Featured Work
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A selection of projects that showcase my ability to analyze, design, and build end-to-end solutions.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
              <StaggerItem key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="block group">
                  <div className="rounded-2xl border border-border bg-card overflow-hidden card-hover">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <div className="text-5xl font-bold text-primary/15">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 text-xs font-medium rounded-md bg-muted text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <div className="text-center mt-12">
              <Button variant="outline" className="rounded-full px-8 gap-2" render={<Link href="/projects" />}>
                View All Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Let&apos;s Work Together
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Whether you need a business analyst, data analyst, or someone to build your next product — I&apos;d love to hear from you.
              </p>
              <Button size="lg" className="rounded-full px-8 gap-2" render={<Link href="/contact" />}>
                Get In Touch
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
