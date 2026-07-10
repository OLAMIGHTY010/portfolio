"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import type { Project } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { MarkdownEditor } from "@/components/ui/md-editor";
import { syncGithubRepos } from "@/lib/actions/projects";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    case_study: "",
    image_url: "",
    tech_stack: "",
    github_url: "",
    live_url: "",
    featured: false,
    published: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });
      setProjects(data || []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncGithub() {
    const username = prompt("Enter your GitHub username to sync repositories:", "OLAMIGHTY010");
    if (!username) return;
    
    setSyncing(true);
    try {
      const result = await syncGithubRepos(username);
      if (result.success) {
        alert(`Successfully synced ${result.added} new repositories from GitHub!`);
        fetchProjects();
      } else {
        alert("Failed to sync: " + result.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSyncing(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploadingImage(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`projects/${fileName}`, file);

      if (error) {
        alert("Upload error: " + error.message);
        throw error;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(`projects/${fileName}`);
        
      setForm({ ...form, image_url: publicUrlData.publicUrl });
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setUploadingImage(false);
    }
  }

  function openCreate() {
    setEditingProject(null);
    setForm({
      title: "",
      slug: "",
      description: "",
      case_study: "",
      image_url: "",
      tech_stack: "",
      github_url: "",
      live_url: "",
      featured: false,
      published: true,
    });
    setDialogOpen(true);
  }

  function openEdit(project: Project) {
    setEditingProject(project);
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      case_study: project.case_study || "",
      image_url: project.image_url || "",
      tech_stack: project.tech_stack.join(", "),
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      featured: project.featured,
      published: project.published,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        case_study: form.case_study || null,
        image_url: form.image_url || null,
        tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
        github_url: form.github_url || null,
        live_url: form.live_url || null,
        featured: form.featured,
        published: form.published,
      };

      if (editingProject) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }

      setDialogOpen(false);
      fetchProjects();
    } catch (err) {
      console.error("Error saving project:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("projects").delete().eq("id", id);
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={handleSyncGithub} disabled={syncing}>
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Sync with GitHub
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button className="gap-2" />} onClick={openCreate}>
                <Plus className="h-4 w-4" /> Add Project
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Add New Project"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                    placeholder="Project Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated-slug"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief project description"
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Case Study (Markdown)</Label>
                <MarkdownEditor
                  value={form.case_study}
                  onChange={(val) => setForm({ ...form, case_study: val || "" })}
                  height={400}
                />
              </div>
              <div className="space-y-2">
                <Label>Project Image</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://... or upload image"
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button type="button" variant="secondary" disabled={uploadingImage}>
                      {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tech Stack (comma-separated)</Label>
                <Input
                  value={form.tech_stack}
                  onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                  placeholder="Python, SQL, PostgreSQL"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={form.github_url}
                    onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Live Demo URL</Label>
                  <Input
                    value={form.live_url}
                    onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.featured}
                    onCheckedChange={(v) => setForm({ ...form, featured: v })}
                  />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.published}
                    onCheckedChange={(v) => setForm({ ...form, published: v })}
                  />
                  <Label>Published</Label>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full gap-2" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editingProject ? "Update Project" : "Create Project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No projects yet. Click &quot;Add Project&quot; to create one.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.title}
                    {project.featured && (
                      <Badge variant="outline" className="ml-2 text-xs">Featured</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.published ? "default" : "secondary"}>
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
