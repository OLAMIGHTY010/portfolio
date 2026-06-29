import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/sections/animated-section";
import { getExperiences } from "@/lib/actions/experience";
import { Briefcase, MapPin, Calendar, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience in banking operations, service monitoring, business analysis, and data analytics.",
};

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="pt-28">
      <section className="section-padding !pt-8">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Career
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Professional{" "}
                <span className="gradient-text">Experience</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                My career journey through banking operations, real-time monitoring, and building data-driven solutions.
              </p>
            </div>
          </FadeIn>

          {/* Experience Timeline */}
          <div className="relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <FadeIn key={exp.id} delay={index * 0.15}>
                  <div className="relative pl-12 md:pl-20">
                    {/* Dot */}
                    <div className="absolute left-4 md:left-8 w-3 h-3 rounded-full bg-primary border-4 border-background -translate-x-1.5 mt-2 z-10" />

                    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                      {/* Header */}
                      <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                          {exp.role}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5" />
                            {exp.company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {exp.period}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {exp.location}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {exp.description}
                      </p>

                      {/* Responsibilities */}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Key Responsibilities
                          </h3>
                          <StaggerContainer className="space-y-3">
                            {exp.responsibilities.map((resp, i) => (
                              <StaggerItem key={i}>
                                <div className="flex gap-3">
                                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {resp}
                                  </p>
                                </div>
                              </StaggerItem>
                            ))}
                          </StaggerContainer>
                        </div>
                      )}

                      {/* Technologies */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                            Technologies & Tools
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
