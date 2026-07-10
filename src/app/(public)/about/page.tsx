import type { Metadata } from "next";
import { Download, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideIn } from "@/components/sections/animated-section";
import { Timeline } from "@/components/sections/timeline";
import { getSiteSettings } from "@/lib/actions/settings";
import { getTimeline } from "@/lib/actions/timeline";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "About",
    description: `Learn about ${settings.site_name}'s journey from banking operations to business analysis, data analytics, and product building.`,
  };
}

export default async function AboutPage() {
  const [settings, timeline] = await Promise.all([
    getSiteSettings(),
    getTimeline(),
  ]);

  return (
    <div className="pt-28">
      {/* Header */}
      <section className="section-padding !pt-8">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                About Me
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
                The Story Behind{" "}
                <span className="gradient-text">The Work</span>
              </h1>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            {/* Story */}
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <div className="prose-custom">
                  {settings.about_story.split("\n\n").map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-muted-foreground leading-relaxed mb-5"
                      dangerouslySetInnerHTML={{
                        __html: paragraph.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-foreground font-semibold">$1</strong>'
                        ),
                      }}
                    />
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Sidebar card */}
            <div>
              <SlideIn direction="right" delay={0.2}>
                <div className="sticky top-28 space-y-6">
                  {/* Profile card */}
                  <div className="rounded-2xl border border-border bg-card p-6 text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 overflow-hidden">
                      {settings.avatar_url ? (
                        <img 
                          src={settings.avatar_url} 
                          alt={settings.site_name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-4xl font-bold text-primary/50">
                          {settings.site_name.split(" ").map((n: string) => n[0]).join("")}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {settings.site_name}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {settings.location_display}
                    </div>
                    {settings.is_open_to_opportunities && (
                      <div className="flex items-center justify-center gap-1.5 text-sm text-primary mt-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        Open to opportunities
                      </div>
                    )}
                    <Button
                      className="w-full mt-4 rounded-full gap-2"
                      render={<a href={settings.resume_url} download />}
                    >
                      <Download className="h-4 w-4" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                My Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
                Education & Milestones
              </h2>
            </div>
          </FadeIn>

          <Timeline items={timeline} />
        </div>
      </section>
    </div>
  );
}
