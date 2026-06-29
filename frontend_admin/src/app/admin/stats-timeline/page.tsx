"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";
import {
  getStats,
  createStat,
  updateStat,
  deleteStat,
  reorderStats,
  type DBStat,
} from "@/lib/actions/stats";
import {
  getTimeline,
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  reorderTimeline,
  type DBTimelineItem,
} from "@/lib/actions/timeline";

export default function StatsTimelineManager() {
  const [stats, setStats] = useState<DBStat[]>([]);
  const [timeline, setTimeline] = useState<DBTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"stats" | "timeline">("stats");

  // Stats Dialog
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<DBStat | null>(null);
  const [statForm, setStatForm] = useState({
    label: "",
    value: 0,
    suffix: "",
  });

  // Timeline Dialog
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<DBTimelineItem | null>(null);
  const [timelineForm, setTimelineForm] = useState({
    year: "",
    title: "",
    institution: "",
    description: "",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [statsData, timelineData] = await Promise.all([
        getStats(),
        getTimeline(),
      ]);
      setStats(statsData);
      setTimeline(timelineData);
    } catch (err) {
      console.error("Failed to load stats/timeline data:", err);
    } finally {
      setLoading(false);
    }
  }

  // ================= STATS CRUD =================
  function openCreateStat() {
    setEditingStat(null);
    setStatForm({
      label: "",
      value: 0,
      suffix: "",
    });
    setStatsDialogOpen(true);
  }

  function openEditStat(item: DBStat) {
    setEditingStat(item);
    setStatForm({
      label: item.label,
      value: item.value,
      suffix: item.suffix || "",
    });
    setStatsDialogOpen(true);
  }

  async function saveStat() {
    try {
      const payload = {
        label: statForm.label,
        value: Number(statForm.value),
        suffix: statForm.suffix,
        sort_order: editingStat ? editingStat.sort_order : stats.length + 1,
      };

      if (editingStat) {
        await updateStat(editingStat.id, payload);
      } else {
        await createStat(payload);
      }
      setStatsDialogOpen(false);
      loadAllData();
    } catch (err) {
      console.error("Save stat failed:", err);
    }
  }

  async function removeStat(id: string) {
    if (!confirm("Are you sure you want to delete this metric?")) return;
    try {
      await deleteStat(id);
      loadAllData();
    } catch (err) {
      console.error("Delete stat failed:", err);
    }
  }

  async function moveStat(index: number, direction: "up" | "down") {
    const items = [...stats];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index].sort_order;
    items[index].sort_order = items[targetIdx].sort_order;
    items[targetIdx].sort_order = temp;

    setStats(items);
    await reorderStats(
      items.map((item) => ({ id: item.id, sort_order: item.sort_order }))
    );
    loadAllData();
  }

  // ================= TIMELINE CRUD =================
  function openCreateTimeline() {
    setEditingTimeline(null);
    setTimelineForm({
      year: "",
      title: "",
      institution: "",
      description: "",
    });
    setTimelineDialogOpen(true);
  }

  function openEditTimeline(item: DBTimelineItem) {
    setEditingTimeline(item);
    setTimelineForm({
      year: item.year,
      title: item.title,
      institution: item.institution,
      description: item.description,
    });
    setTimelineDialogOpen(true);
  }

  async function saveTimeline() {
    try {
      const payload = {
        year: timelineForm.year,
        title: timelineForm.title,
        institution: timelineForm.institution,
        description: timelineForm.description,
        sort_order: editingTimeline ? editingTimeline.sort_order : timeline.length + 1,
      };

      if (editingTimeline) {
        await updateTimelineItem(editingTimeline.id, payload);
      } else {
        await createTimelineItem(payload);
      }
      setTimelineDialogOpen(false);
      loadAllData();
    } catch (err) {
      console.error("Save timeline item failed:", err);
    }
  }

  async function removeTimeline(id: string) {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      await deleteTimelineItem(id);
      loadAllData();
    } catch (err) {
      console.error("Delete timeline item failed:", err);
    }
  }

  async function moveTimeline(index: number, direction: "up" | "down") {
    const items = [...timeline];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index].sort_order;
    items[index].sort_order = items[targetIdx].sort_order;
    items[targetIdx].sort_order = temp;

    setTimeline(items);
    await reorderTimeline(
      items.map((item) => ({ id: item.id, sort_order: item.sort_order }))
    );
    loadAllData();
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading stats & timeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stats & Timeline</h1>
          <p className="text-muted-foreground mt-1">Configure site statistics and education milestones.</p>
        </div>
        <div>
          {activeTab === "stats" ? (
            <Button onClick={openCreateStat} className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add Stat Metric
            </Button>
          ) : (
            <Button onClick={openCreateTimeline} className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" /> Add Milestone
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "stats"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Homepage Stats ({stats.length})
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "timeline"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Journey Timeline ({timeline.length})
        </button>
      </div>

      {/* Panels */}
      <div>
        {activeTab === "stats" ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Homepage Metrics</CardTitle>
              <CardDescription>Counters rendered on the home page stats banner.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric Label</TableHead>
                      <TableHead>Display Preview</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          No stats metrics defined.
                        </TableCell>
                      </TableRow>
                    ) : (
                      stats.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.label}</TableCell>
                          <TableCell className="font-semibold font-mono text-primary text-lg">
                            {item.value}
                            {item.suffix}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => moveStat(index, "up")} disabled={index === 0}>
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => moveStat(index, "down")} disabled={index === stats.length - 1}>
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openEditStat(item)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => removeStat(item.id)} className="text-destructive hover:text-destructive">
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
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Milestones & Education</CardTitle>
              <CardDescription>Chronological events rendered on the About journey path.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Event & Institution</TableHead>
                      <TableHead className="hidden md:table-cell">Summary Details</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeline.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No milestones defined.
                        </TableCell>
                      </TableRow>
                    ) : (
                      timeline.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-bold text-foreground font-mono text-sm">{item.year}</TableCell>
                          <TableCell>
                            <div className="font-semibold">{item.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.institution}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-xs truncate">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => moveTimeline(index, "up")} disabled={index === 0}>
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => moveTimeline(index, "down")} disabled={index === timeline.length - 1}>
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openEditTimeline(item)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => removeTimeline(item.id)} className="text-destructive hover:text-destructive">
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* ================= STATS DIALOG ================= */}
      <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingStat ? "Edit Stat Metric" : "Add Stat Metric"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Metric Name / Label</Label>
              <Input value={statForm.label} onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} placeholder="e.g. Years of Experience" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Integer Value</Label>
                <Input type="number" value={statForm.value} onChange={(e) => setStatForm({ ...statForm, value: Number(e.target.value) })} placeholder="5" />
              </div>
              <div className="space-y-2">
                <Label>Suffix Symbol</Label>
                <Input value={statForm.suffix} onChange={(e) => setStatForm({ ...statForm, suffix: e.target.value })} placeholder="e.g. +, %" />
              </div>
            </div>
            <Button onClick={saveStat} className="w-full gap-2 rounded-xl mt-4">
              <CheckCircle2 className="h-4 w-4" />
              {editingStat ? "Update Stat" : "Create Stat"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= TIMELINE DIALOG ================= */}
      <Dialog open={timelineDialogOpen} onOpenChange={setTimelineDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTimeline ? "Edit Milestone" : "Add Milestone"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={timelineForm.year} onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })} placeholder="2023" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Event/Milestone Title</Label>
                <Input value={timelineForm.title} onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })} placeholder="Higher National Diploma" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Institution/Authority</Label>
              <Input value={timelineForm.institution} onChange={(e) => setTimelineForm({ ...timelineForm, institution: e.target.value })} placeholder="Complete Child Academy" />
            </div>
            <div className="space-y-2">
              <Label>Brief Description</Label>
              <Textarea value={timelineForm.description} onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })} placeholder="Summarize achievements or curriculum..." />
            </div>
            <Button onClick={saveTimeline} className="w-full gap-2 rounded-xl mt-4">
              <CheckCircle2 className="h-4 w-4" />
              {editingTimeline ? "Update Milestone" : "Create Milestone"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
