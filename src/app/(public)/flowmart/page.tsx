import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/sections/animated-section";
import { getSiteSettings } from "@/lib/actions/settings";
import {
  Rocket,
  Target,
  AlertTriangle,
  Layers,
  ArrowRight,
  Users,
  Code2,
  CreditCard,
} from "lucide-react";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.flowmart_headline,
    description: settings.flowmart_subheadline,
  };
}

const journeyIcons = [Users, Layers, CreditCard, Target, Rocket];

export default async function FlowMartPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pt-28">
      {/* Hero */}
      <section className="section-padding !pt-8 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="container-custom relative z-10">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20 mb-6">
                <Rocket className="h-4 w-4" />
                Featured Product
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
                {settings.flowmart_headline}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                {settings.flowmart_tagline}
              </p>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {settings.flowmart_subheadline}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SlideIn>
              <div className="rounded-2xl border border-border bg-card p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {settings.flowmart_vision}
                </p>
              </div>
            </SlideIn>
            <SlideIn direction="right" delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {settings.flowmart_mission}
                </p>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section-padding">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {settings.flowmart_problem_title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {settings.flowmart_problem_description}
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {settings.flowmart_problem_painpoints.map((point, i) => (
              <StaggerItem key={i}>
                <div className="flex gap-3 p-5 rounded-xl border border-border bg-card">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-destructive">{i + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {point}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* User Journey */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                User Journey
              </h2>
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            <StaggerContainer className="relative">
              {/* Connector line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border hidden md:block md:-translate-x-px" />

              <div className="space-y-8">
                {settings.flowmart_user_journey.map((step, i) => {
                  const JourneyIcon = journeyIcons[i % journeyIcons.length] || Layers;
                  return (
                    <StaggerItem key={i}>
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <JourneyIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 p-5 rounded-xl border border-border bg-card">
                          <h3 className="font-semibold text-foreground mb-1">
                            {step.step}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                        {i < settings.flowmart_user_journey.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                        )}
                      </div>
                    </StaggerItem>
                  );
                })}
              </div>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      {settings.flowmart_tech_stack && settings.flowmart_tech_stack.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Built With
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                  Technology Stack
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {settings.flowmart_tech_stack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium rounded-full"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* My Role */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {settings.flowmart_role_title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {settings.flowmart_role_description}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
