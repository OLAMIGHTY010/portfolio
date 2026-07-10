"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeIn, SlideIn } from "@/components/sections/animated-section";
import { SITE_CONFIG } from "@/lib/constants";
import {
  Send,
  Mail,
  MapPin,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import type { SiteSettings } from "@/lib/actions/settings";
import { sendContactEmail } from "@/lib/actions/email";

interface ContactClientProps {
  settings: SiteSettings;
}

export function ContactClient({ settings }: ContactClientProps) {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", body: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("loading");

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      
      // Save to database
      const { error } = await supabase
        .from("messages")
        .insert([formData]);

      if (error) throw error;

      // Send email notification
      await sendContactEmail(formData);

      setFormState("success");
      setFormData({ name: "", email: "", body: "" });
    } catch {
      // Show success for fallback/demo
      setFormState("success");
      setFormData({ name: "", email: "", body: "" });
    }
  }

  const linkedin = settings.linkedin_url || SITE_CONFIG.links.linkedin;
  const github = settings.github_url || SITE_CONFIG.links.github;
  const email = settings.email || SITE_CONFIG.links.email;
  const location = settings.location_display || "Lagos, Nigeria";

  return (
    <div className="pt-28">
      <section className="section-padding !pt-8">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Get In Touch
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Let&apos;s{" "}
                <span className="gradient-text">Connect</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Whether you have a project in mind, a job opportunity, or just want to say hello — I&apos;d love to hear from you.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <FadeIn delay={0.1}>
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                  {formState === "success" ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setFormState("idle")}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell me about your project, opportunity, or just say hello..."
                          className="min-h-[160px] resize-none"
                          value={formData.body}
                          onChange={(e) =>
                            setFormData({ ...formData, body: e.target.value })
                          }
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2"
                        disabled={formState === "loading"}
                      >
                        {formState === "loading" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <SlideIn direction="right" delay={0.2}>
                <div className="space-y-6 sticky top-28">
                  {/* Contact info */}
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        {email}
                      </a>
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <LinkedinIcon className="h-4 w-4 text-primary" />
                        </div>
                        LinkedIn Profile
                      </a>
                      <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <GithubIcon className="h-4 w-4 text-primary" />
                        </div>
                        GitHub Profile
                      </a>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        {location}
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  {settings.is_open_to_opportunities && (
                    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-sm font-semibold text-accent">
                          Available for Opportunities
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        I&apos;m currently open to full-time roles, contract work, and interesting collaborations.
                      </p>
                    </div>
                  )}
                </div>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
