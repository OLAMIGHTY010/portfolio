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
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, FileText } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    name: "",
    organization: "",
    date_achieved: "",
    verification_url: "",
    image_url: "",
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
    setForm({ name: "", organization: "", date_achieved: "", verification_url: "", image_url: "" });
    setDialogOpen(true);
  }

  function openEdit(cert: Certificate) {
    setEditing(cert);
    setForm({
      name: cert.name,
      organization: cert.organization,
      date_achieved: cert.date_achieved,
      verification_url: cert.verification_url || "",
      image_url: cert.image_url || "",
    });
    setDialogOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      
      const fileExt = file.name.split('.').pop() || '';
      const isPdf = fileExt.toLowerCase() === 'pdf' || file.type === 'application/pdf';
      const bucket = isPdf ? 'documents' : 'images';
      
      const fileName = `certificate-${Math.random()}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setForm({ ...form, image_url: publicUrl });
      alert("Image uploaded successfully!");
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert("Error uploading image: " + (error.message || "Unknown error"));
    } finally {
      setUploadingImage(false);
    }
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
        image_url: form.image_url || null,
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
              <div className="space-y-2">
                <Label>Certificate Image</Label>
                <div className="flex gap-2">
                  <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                  <div className="relative w-32 shrink-0">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    <Button type="button" variant="secondary" className="w-full" disabled={uploadingImage}>
                      {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                    </Button>
                  </div>
                </div>
                {form.image_url && (
                  <div className="mt-2 relative aspect-video w-40 rounded-md overflow-hidden border border-border">
                    {form.image_url.toLowerCase().includes('.pdf') ? (
                      <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="h-6 w-6 mb-1" />
                        <span className="text-[10px]">PDF Document</span>
                      </div>
                    ) : (
                      <Image src={form.image_url} alt="Certificate preview" fill className="object-cover" />
                    )}
                  </div>
                )}
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
              <TableHead className="w-16">Image</TableHead>
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
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No certificates yet.
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>
                    {cert.image_url ? (
                      <div className="relative h-10 w-10 rounded overflow-hidden border border-border bg-muted flex items-center justify-center">
                        {cert.image_url.toLowerCase().includes('.pdf') ? (
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Image src={cert.image_url} alt={cert.name} fill className="object-cover" />
                        )}
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center border border-border">
                        <ImageIcon className="h-4 w-4 text-muted-foreground opacity-50" />
                      </div>
                    )}
                  </TableCell>
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
