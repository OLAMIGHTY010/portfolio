"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2, Save, Trash2 } from "lucide-react";
import { getSiteSettings, updateSiteSettings, type SiteSettings } from "@/lib/actions/settings";

export default function SettingsHub() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "socials" | "hero" | "flowmart">("general");

  // Temporary inputs
  const [newRole, setNewRole] = useState("");
  const [newPainpoint, setNewPainpoint] = useState("");
  const [newTech, setNewTech] = useState("");
  
  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("An error occurred while saving settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading settings hub...</p>
      </div>
    );
  }

  // General state handlers
  const updateField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((prev) => prev ? ({ ...prev, [key]: value }) : null);
  };

  // Hero roles helper
  const addRole = () => {
    if (!newRole.trim()) return;
    updateField("hero_roles", [...settings.hero_roles, newRole.trim()]);
    setNewRole("");
  };

  const removeRole = (index: number) => {
    updateField("hero_roles", settings.hero_roles.filter((_, i) => i !== index));
  };

  // FlowMart painpoints helper
  const addPainpoint = () => {
    if (!newPainpoint.trim()) return;
    updateField("flowmart_problem_painpoints", [...settings.flowmart_problem_painpoints, newPainpoint.trim()]);
    setNewPainpoint("");
  };

  const removePainpoint = (index: number) => {
    updateField("flowmart_problem_painpoints", settings.flowmart_problem_painpoints.filter((_, i) => i !== index));
  };

  // FlowMart tech stack helper
  const addTech = () => {
    if (!newTech.trim()) return;
    updateField("flowmart_tech_stack", [...settings.flowmart_tech_stack, newTech.trim()]);
    setNewTech("");
  };

  const removeTech = (index: number) => {
    updateField("flowmart_tech_stack", settings.flowmart_tech_stack.filter((_, i) => i !== index));
  };

  // FlowMart Journey helper
  const updateJourneyStep = (index: number, key: "step" | "description", value: string) => {
    const updated = settings.flowmart_user_journey.map((step, i) => {
      if (i === index) {
        return { ...step, [key]: value };
      }
      return step;
    });
    updateField("flowmart_user_journey", updated);
  };

  const addJourneyStep = () => {
    updateField("flowmart_user_journey", [
      ...settings.flowmart_user_journey,
      { step: "New Step", description: "Step description goes here" },
    ]);
  };

  const removeJourneyStep = (index: number) => {
    updateField("flowmart_user_journey", settings.flowmart_user_journey.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings Hub</h1>
          <p className="text-muted-foreground mt-1">Configure global portfolio copy and page variables.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-xl">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-px">
        {(
          [
            { id: "general", label: "General Config" },
            { id: "socials", label: "Socials & Links" },
            { id: "hero", label: "Hero Section" },
            { id: "flowmart", label: "FlowMart Page" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {/* ==================== GENERAL TAB ==================== */}
        {activeTab === "general" && (
          <Card>
            <CardHeader>
              <CardTitle>General configuration</CardTitle>
              <CardDescription>Main site identities and SEO metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner Full Name</Label>
                  <Input
                    value={settings.site_name}
                    onChange={(e) => updateField("site_name", e.target.value)}
                    placeholder="e.g. Olatunbosun Olalekan"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Site Absolute URL</Label>
                  <Input
                    value={settings.site_url}
                    onChange={(e) => updateField("site_url", e.target.value)}
                    placeholder="https://yourname.dev"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>SEO Title Template</Label>
                <Input
                  value={settings.site_title}
                  onChange={(e) => updateField("site_title", e.target.value)}
                  placeholder="Appears on browser tabs"
                />
              </div>
              <div className="space-y-2">
                <Label>SEO Site Description</Label>
                <Textarea
                  value={settings.site_description}
                  onChange={(e) => updateField("site_description", e.target.value)}
                  placeholder="Meta description shown on search engines"
                  className="min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Location</Label>
                  <Input
                    value={settings.location_display}
                    onChange={(e) => updateField("location_display", e.target.value)}
                    placeholder="e.g. Lagos, Nigeria"
                  />
                </div>
                <div className="space-y-2">
                  <Label>About Story (Markdown allowed)</Label>
                  <Textarea
                    value={settings.about_story}
                    onChange={(e) => updateField("about_story", e.target.value)}
                    placeholder="Describe your career story here..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ==================== SOCIALS TAB ==================== */}
        {activeTab === "socials" && (
          <Card>
            <CardHeader>
              <CardTitle>Social links & status</CardTitle>
              <CardDescription>Configure external handles and availability state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Contact Email</Label>
                  <Input
                    value={settings.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="name@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Resume PDF URL</Label>
                  <Input
                    value={settings.resume_url}
                    onChange={(e) => updateField("resume_url", e.target.value)}
                    placeholder="/resume.pdf"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={settings.linkedin_url}
                    onChange={(e) => updateField("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={settings.github_url}
                    onChange={(e) => updateField("github_url", e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Switch
                  checked={settings.is_open_to_opportunities}
                  onCheckedChange={(val) => updateField("is_open_to_opportunities", val)}
                />
                <div>
                  <Label className="font-semibold block">Open to Opportunities</Label>
                  <span className="text-xs text-muted-foreground">Toggle availability badge on the About & Contact page</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ==================== HERO TAB ==================== */}
        {activeTab === "hero" && (
          <Card>
            <CardHeader>
              <CardTitle>Hero banner setup</CardTitle>
              <CardDescription>Hero texts and dynamic role titles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Greeting Message</Label>
                  <Input
                    value={settings.hero_greeting}
                    onChange={(e) => updateField("hero_greeting", e.target.value)}
                    placeholder="e.g. Hi, I'm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Name</Label>
                  <Input
                    value={settings.hero_name}
                    onChange={(e) => updateField("hero_name", e.target.value)}
                    placeholder="OLATUNBOSUN OLALEKAN"
                  />
                </div>
              </div>
              
              {/* Dynamic Roles Tag Editor */}
              <div className="space-y-2">
                <Label>Roles Titles</Label>
                <div className="flex gap-2">
                  <Input
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Type role name and click Add"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRole();
                      }
                    }}
                  />
                  <Button type="button" onClick={addRole} size="sm">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {settings.hero_roles.map((role, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-sm py-1">
                      {role}
                      <button
                        type="button"
                        onClick={() => removeRole(idx)}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hero Summary Description</Label>
                <Textarea
                  value={settings.hero_summary}
                  onChange={(e) => updateField("hero_summary", e.target.value)}
                  placeholder="Summary text under roles"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary CTA button text</Label>
                  <Input
                    value={settings.hero_cta_primary}
                    onChange={(e) => updateField("hero_cta_primary", e.target.value)}
                    placeholder="View My Work"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary CTA button text</Label>
                  <Input
                    value={settings.hero_cta_secondary}
                    onChange={(e) => updateField("hero_cta_secondary", e.target.value)}
                    placeholder="Download Resume"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ==================== FLOWMART TAB ==================== */}
        {activeTab === "flowmart" && (
          <Card>
            <CardHeader>
              <CardTitle>FlowMart product showcase</CardTitle>
              <CardDescription>Manage descriptions, visions, missions, and pain points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input
                    value={settings.flowmart_headline}
                    onChange={(e) => updateField("flowmart_headline", e.target.value)}
                    placeholder="FlowMart"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Tagline</Label>
                  <Input
                    value={settings.flowmart_tagline}
                    onChange={(e) => updateField("flowmart_tagline", e.target.value)}
                    placeholder="Simplifying Commerce for African Businesses"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subheadline / Short Description</Label>
                <Textarea
                  value={settings.flowmart_subheadline}
                  onChange={(e) => updateField("flowmart_subheadline", e.target.value)}
                  placeholder="Full tagline context"
                  className="min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vision Statement</Label>
                  <Textarea
                    value={settings.flowmart_vision}
                    onChange={(e) => updateField("flowmart_vision", e.target.value)}
                    placeholder="To empower..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mission Statement</Label>
                  <Textarea
                    value={settings.flowmart_mission}
                    onChange={(e) => updateField("flowmart_mission", e.target.value)}
                    placeholder="Build simple..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* The Problem Section */}
              <div className="border-t border-border pt-4 space-y-4">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">The Problem Segment</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Problem Title</Label>
                    <Input
                      value={settings.flowmart_problem_title}
                      onChange={(e) => updateField("flowmart_problem_title", e.target.value)}
                      placeholder="The Problem"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Problem Summary</Label>
                    <Textarea
                      value={settings.flowmart_problem_description}
                      onChange={(e) => updateField("flowmart_problem_description", e.target.value)}
                      placeholder="MSMEs manage operations with memory..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Painpoints List */}
                <div className="space-y-2">
                  <Label>Core Pain Points</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newPainpoint}
                      onChange={(e) => setNewPainpoint(e.target.value)}
                      placeholder="Add stockout warning etc."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addPainpoint();
                        }
                      }}
                    />
                    <Button type="button" onClick={addPainpoint} size="sm">
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                  <ul className="space-y-2 pt-2">
                    {settings.flowmart_problem_painpoints.map((point, index) => (
                      <li key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 text-sm">
                        <span>{point}</span>
                        <Button variant="ghost" size="sm" type="button" onClick={() => removePainpoint(index)} className="text-destructive shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tech Stack List */}
              <div className="border-t border-border pt-4 space-y-4">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Technology Stack</h3>
                <div className="space-y-2">
                  <Label>Stack Techs</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      placeholder="e.g. Next.js, Go"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTech();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTech} size="sm">
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {settings.flowmart_tech_stack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 text-sm py-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(index)}
                          className="text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Roles Section */}
              <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Developer Role Title</Label>
                  <Input
                    value={settings.flowmart_role_title}
                    onChange={(e) => updateField("flowmart_role_title", e.target.value)}
                    placeholder="Product PM & Lead dev"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Developer Role Description</Label>
                  <Textarea
                    value={settings.flowmart_role_description}
                    onChange={(e) => updateField("flowmart_role_description", e.target.value)}
                    placeholder="I wear multiple hats..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Journey Steps Section */}
              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">User Journey steps</h3>
                  <Button type="button" onClick={addJourneyStep} size="sm" variant="outline" className="gap-1">
                    <Plus className="h-4 w-4" /> Add Journey Step
                  </Button>
                </div>
                <div className="space-y-4">
                  {settings.flowmart_user_journey.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border bg-muted/20 relative space-y-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeJourneyStep(idx)}
                        className="absolute right-2 top-2 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Step Name</Label>
                          <Input
                            value={step.step}
                            onChange={(e) => updateJourneyStep(idx, "step", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Step Description</Label>
                          <Input
                            value={step.description}
                            onChange={(e) => updateJourneyStep(idx, "description", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
