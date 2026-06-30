"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="block group relative">
        <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-0" aria-label={`View details for ${project.title}`} />
        <div className="rounded-2xl border border-border bg-card overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5 relative pointer-events-none">
          <div className="pointer-events-auto">
            {/* Image area */}
          <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-4xl font-bold text-primary/20">
                  {project.title.charAt(0)}
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 4).map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-xs font-medium"
                >
                  {tech}
                </Badge>
              ))}
              {project.tech_stack.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tech_stack.length - 4}
                </Badge>
              )}
            </div>

            {/* Links */}
            {(project.github_url || project.live_url) && (
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border relative z-10">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
                    <GithubIcon className="h-3 w-3" /> Source
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
                    <ArrowUpRight className="h-3 w-3" /> Live
                  </a>
                )}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
