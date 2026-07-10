"use client";

import { useState, useMemo } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/sections/animated-section";
import { ProjectCard } from "@/components/cards/project-card";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");

  // Extract unique tech stack tags from all projects
  const filters = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((p) => {
      p.tech_stack.forEach((tag) => tags.add(tag));
    });
    // For now, let's take all unique tags and sort alphabetically, plus "All"
    const uniqueTags = Array.from(tags).sort();
    return ["All", ...uniqueTags];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => p.tech_stack.includes(activeFilter));
  }, [projects, activeFilter]);

  return (
    <div className="pt-28">
      <section className="section-padding !pt-8">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl mb-12">
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

          {/* Filters */}
          {filters.length > 2 && (
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap items-center gap-2 mb-12">
                {filters.map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </FadeIn>
          )}

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8" key={activeFilter}>
            {filteredProjects.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No projects found for this filter.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
