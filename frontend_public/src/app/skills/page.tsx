import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/sections/animated-section";
import { getSkillCategories } from "@/lib/actions/skills";
import { Brain, BarChart3, Code2, Wrench } from "lucide-react";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical and professional skills in business analysis, data analytics, software development, and tools.",
};

const categoryIcons = [Brain, BarChart3, Code2, Wrench];

export default async function SkillsPage() {
  const categories = await getSkillCategories();

  return (
    <div className="pt-28">
      <section className="section-padding !pt-8">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Capabilities
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Skills &{" "}
                <span className="gradient-text">Expertise</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                A diverse skill set spanning business analysis, data analytics, software development, and modern productivity tools.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, catIndex) => {
              const Icon = categoryIcons[catIndex % categoryIcons.length] || Code2;
              return (
                <FadeIn key={category.id} delay={catIndex * 0.1}>
                  <div className="rounded-2xl border border-border bg-card p-6 md:p-8 h-full">
                    {/* Category header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-bold text-foreground">
                        {category.title}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      {category.description}
                    </p>

                    {/* Skills grid */}
                    <StaggerContainer className="grid grid-cols-2 gap-2">
                      {category.skill_names.map((name) => (
                        <StaggerItem key={name}>
                          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            <span className="text-sm text-foreground font-medium">
                              {name}
                            </span>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
