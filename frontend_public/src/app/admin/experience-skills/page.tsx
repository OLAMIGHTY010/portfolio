"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
  type DBExperience,
} from "@/lib/actions/experience";
import {
  getSkillCategories,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  reorderSkillCategories,
  type DBSkillCategory,
} from "@/lib/actions/skills";

export default function ExperienceSkillsManager() {
  const [experiences, setExperiences] = useState<DBExperience[]>([]);
  const [skills, setSkills] = useState<DBSkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"experience" | "skills">("experience");

  // Experience Dialog
  const [expDialogOpen, setExpDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<DBExperience | null>(null);
  const [expForm, setExpForm] = useState({
    role: "",
    company: "",
    period: "",
    location: "",
    description: "",
    responsibilities: [] as string[],
    technologies: [] as string[],
  });
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newTech, setNewTech] = useState("");

  // Skills Dialog
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<DBSkillCategory | null>(null);
  const [skillForm, setSkillForm] = useState({
    title: "",
    description: "",
    skill_names: [] as string[],
  });
  const [newSkillName, setNewSkillName] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [expData, skillsData] = await Promise.all([
        getExperiences(),
        getSkillCategories(),
      ]);
      setExperiences(expData);
      setSkills(skillsData);
    } catch (err) {
      console.error("Failed to load experience/skills data:", err);
    } finally {
      setLoading(false);
    }
  }

  // ================= EXPERIENCE CRUD =================
  function openCreateExp() {
    setEditingExp(null);
    setExpForm({
      role: "",
      company: "",
      period: "",
      location: "",
      description: "",
      responsibilities: [],
      technologies: [],
    });
    setExpDialogOpen(true);
  }

  function openEditExp(exp: DBExperience) {
    setEditingExp(exp);
    setExpForm({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      responsibilities: exp.responsibilities || [],
      technologies: exp.technologies || [],
    });
    setExpDialogOpen(true);
  }

  async function saveExp() {
    try {
      const payload = {
        role: expForm.role,
        company: expForm.company,
        period: expForm.period,
        location: expForm.location,
        description: expForm.description,
        responsibilities: expForm.responsibilities,
        technologies: expForm.technologies,
        sort_order: editingExp ? editingExp.sort_order : experiences.length + 1,
      };

      if (editingExp) {
        await updateExperience(editingExp.id, payload);
      } else {
        await createExperience(payload);
      }
      setExpDialogOpen(false);
      loadAllData();
    } catch (err) {
      console.error("Save experience failed:", err);
    }
  }

  async function removeExp(id: string) {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteExperience(id);
      loadAllData();
    } catch (err) {
      console.error("Delete experience failed:", err);
    }
  }

  async function moveExp(index: number, direction: "up" | "down") {
    const items = [...experiences];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    // Swap sort orders
    const temp = items[index].sort_order;
    items[index].sort_order = items[targetIdx].sort_order;
    items[targetIdx].sort_order = temp;

    setExperiences(items);
    await reorderExperiences(
      items.map((item) => ({ id: item.id, sort_order: item.sort_order }))
    );
    loadAllData();
  }

  const addResponsibility = () => {
    if (!newResponsibility.trim()) return;
    setExpForm({ ...expForm, responsibilities: [...expForm.responsibilities, newResponsibility.trim()] });
    setNewResponsibility("");
  };

  const removeResponsibility = (idx: number) => {
    setExpForm({ ...expForm, responsibilities: expForm.responsibilities.filter((_, i) => i !== idx) });
  };

  const addTechTag = () => {
    if (!newTech.trim()) return;
    setExpForm({ ...expForm, technologies: [...expForm.technologies, newTech.trim()] });
    setNewTech("");
  };

  const removeTechTag = (idx: number) => {
    setExpForm({ ...expForm, technologies: expForm.technologies.filter((_, i) => i !== idx) });
  };

  // ================= SKILLS CRUD =================
  function openCreateSkill() {
    setEditingSkill(null);
    setSkillForm({
      title: "",
      description: "",
      skill_names: [],
    });
    setSkillsDialogOpen(true);
  }

  function openEditSkill(cat: DBSkillCategory) {
    setEditingSkill(cat);
    setSkillForm({
      title: cat.title,
      description: cat.description,
      skill_names: cat.skill_names || [],
    });
    setSkillsDialogOpen(true);
  }

  async function saveSkill() {
    try {
      const payload = {
        title: skillForm.title,
        description: skillForm.description,
        skill_names: skillForm.skill_names,
        sort_order: editingSkill ? editingSkill.sort_order : skills.length + 1,
      };

      if (editingSkill) {
        await updateSkillCategory(editingSkill.id, payload);
      } else {
        await createSkillCategory(payload);
      }
      setSkillsDialogOpen(false);
      loadAllData();
    } catch (err) {
      console.error("Save skill category failed:", err);
    }
  }

  async function removeSkill(id: string) {
    if (!confirm("Are you sure you want to delete this skills category?")) return;
    try {
      await deleteSkillCategory(id);
      loadAllData();
    } catch (err) {
      console.error("Delete skill failed:", err);
    }
  }

  async function moveSkill(index: number, direction: "up" | "down") {
    const items = [...skills];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index].sort_order;
    items[index].sort_order = items[targetIdx].sort_order;
    items[targetIdx].sort_order = temp;

    setSkills(items);
    await reorderSkillCategories(
      items.map((item) => ({ id: item.id, sort_order: item.sort_order }))
    );
    loadAllData();
  }

  const addSkillName = () => {
    if (!newSkillName.trim()) return;
    setSkillForm({ ...skillForm, skill_names: [...skillForm.skill_names, newSkillName.trim()] });
    setNewSkillName("");
  };

  const removeSkillName = (idx: number) => {
    setSkillForm({ ...skillForm, skill_names: skillForm.skill_names.filter((_, i) => i !== idx) });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading experience & skills...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Experience & Skills</h1>
          <p className="text-muted-foreground mt-1">Manage resume work roles and categories of expertise.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "experience" ? (
            <Button onClick={openCreateExp} className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add Experience
            </Button>
          ) : (
            <Button onClick={openCreateSkill} className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add Skill Category
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab("experience")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "experience"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Work Experience ({experiences.length})
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "skills"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Skills & Expertise ({skills.length})
        </button>
      </div>

      {/* Panels */}
      <div>
        {activeTab === "experience" ? (
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={exp.id} className="hover:border-primary/20 transition-all">
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">{exp.role}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground font-medium mt-1">
                      {exp.company} &bull; {exp.period} &bull; {exp.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => moveExp(index, "up")} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveExp(index, "down")} disabled={index === experiences.length - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditExp(exp)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeExp(exp.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-bold text-foreground">Responsibilities:</span>
                      <ul className="space-y-1.5 pl-4 list-disc text-sm text-muted-foreground">
                        {exp.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {exp.technologies.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((cat, index) => (
              <Card key={cat.id} className="hover:border-primary/20 transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground">{cat.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">{cat.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => moveSkill(index, "up")} disabled={index === 0}>
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => moveSkill(index, "down")} disabled={index === skills.length - 1}>
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditSkill(cat)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeSkill(cat.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skill_names.map((name) => (
                      <Badge key={name} variant="outline" className="text-sm font-semibold py-1">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ================= EXPERIENCE DIALOG ================= */}
      <Dialog open={expDialogOpen} onOpenChange={setExpDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExp ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role Title</Label>
                <Input value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} placeholder="Service Monitoring Officer" />
              </div>
              <div className="space-y-2">
                <Label>Company/Org</Label>
                <Input value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} placeholder="e.g. Banking Operations" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Period</Label>
                <Input value={expForm.period} onChange={(e) => setExpForm({ ...expForm, period: e.target.value })} placeholder="2023 — Present" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={expForm.location} onChange={(e) => setExpForm({ ...expForm, location: e.target.value })} placeholder="Lagos, Nigeria" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} placeholder="Overview of the role..." />
            </div>

            {/* Responsibilities list manager */}
            <div className="space-y-2 pt-2 border-t border-border">
              <Label>Responsibilities Checklist</Label>
              <div className="flex gap-2">
                <Input
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  placeholder="Add a key responsibility..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addResponsibility();
                    }
                  }}
                />
                <Button type="button" onClick={addResponsibility} size="sm">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <ul className="space-y-2 pt-2 max-h-[160px] overflow-y-auto">
                {expForm.responsibilities.map((r, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded border bg-muted/20 text-xs">
                    <span className="flex-1 mr-2">{r}</span>
                    <button type="button" onClick={() => removeResponsibility(idx)} className="text-destructive shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Tags list manager */}
            <div className="space-y-2 pt-2 border-t border-border">
              <Label>Technologies Used</Label>
              <div className="flex gap-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="e.g. Python, SQL"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTechTag();
                    }
                  }}
                />
                <Button type="button" onClick={addTechTag} size="sm">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                {expForm.technologies.map((t, idx) => (
                  <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                    {t}
                    <button type="button" onClick={() => removeTechTag(idx)} className="text-muted-foreground hover:text-destructive shrink-0">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={saveExp} className="w-full gap-2 rounded-xl mt-4">
              <CheckCircle2 className="h-4 w-4" />
              {editingExp ? "Update Experience" : "Add Experience"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= SKILLS DIALOG ================= */}
      <Dialog open={skillsDialogOpen} onOpenChange={setSkillsDialogOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Edit Skill Category" : "Add Skill Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Category Title</Label>
              <Input value={skillForm.title} onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })} placeholder="e.g. Data Analytics" />
            </div>
            <div className="space-y-2">
              <Label>Brief Description</Label>
              <Input value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} placeholder="Turning data into intelligence..." />
            </div>

            {/* Skill names list manager */}
            <div className="space-y-2 pt-2 border-t border-border">
              <Label>Skill Items</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. SQL, Tableau"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillName();
                    }
                  }}
                />
                <Button type="button" onClick={addSkillName} size="sm">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                {skillForm.skill_names.map((name, idx) => (
                  <Badge key={idx} variant="outline" className="flex items-center gap-1">
                    {name}
                    <button type="button" onClick={() => removeSkillName(idx)} className="text-muted-foreground hover:text-destructive shrink-0">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={saveSkill} className="w-full gap-2 rounded-xl mt-4">
              <CheckCircle2 className="h-4 w-4" />
              {editingSkill ? "Update Category" : "Add Category"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
