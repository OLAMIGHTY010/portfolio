"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState({
    name: "",
    organization: "",
    date_achieved: "",
    verification_url: "",
  });

  useEffect(() => {
    fetchCerts();
  }, []);

  async function fetchCerts() {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .order("sort_order", { ascending: true });
      setCertificates(data || []);
    } catch {
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", organization: "", date_achieved: "", verification_url: "" });
    setDialogOpen(true);
  }

  function openEdit(cert: Certificate) {
    setEditing(cert);
    setForm({
      name: cert.name,
      organization: cert.organization,
      date_achieved: cert.date_achieved,
      verification_url: cert.verification_url || "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const payload = {
        name: form.name,
        organization: form.organization,
        date_achieved: form.date_achieved,
        verification_url: form.verification_url || null,
      };

      if (editing) {
        await supabase.from("certificates").update(payload).eq("id", editing.id);
      } else {
        await supabase.from("certificates").insert(payload);
      }

      setDialogOpen(false);
      fetchCerts();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this certificate?")) return;
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.from("certificates").delete().eq("id", id);
      fetchCerts();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certificates</h1>
          <p className="text-muted-foreground mt-1">Manage your professional certifications.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="gap-2" />} onClick={openCreate}>
              <Plus className="h-4 w-4" /> Add Certificate
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Certificate Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Introduction to Cybersecurity" />
              </div>
              <div className="space-y-2">
                <Label>Issuing Organization</Label>
                <Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Cisco Networking Academy" />
              </div>
              <div className="space-y-2">
                <Label>Date Achieved</Label>
                <Input type="date" value={form.date_achieved} onChange={(e) => setForm({ ...form, date_achieved: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Verification URL</Label>
                <Input value={form.verification_url} onChange={(e) => setForm({ ...form, verification_url: e.target.value })} placeholder="https://credly.com/..." />
              </div>
              <Button onClick={handleSave} className="w-full gap-2" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No certificates yet.
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cert.organization}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(cert.date_achieved)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(cert)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(cert.id)} className="text-destructive hover:text-destructive">
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
