"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CertificateInput } from "@/lib/types";
import { isPlaceholderConfig } from "@/lib/utils";

export async function getCertificates() {
  if (isPlaceholderConfig()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createCertificate(certificate: CertificateInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certificates")
    .insert(certificate)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/certifications");
  revalidatePath("/admin/certificates");
  return data;
}

export async function updateCertificate(
  id: string,
  certificate: Partial<CertificateInput>
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certificates")
    .update(certificate)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/certifications");
  revalidatePath("/admin/certificates");
  return data;
}

export async function deleteCertificate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("certificates")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/certifications");
  revalidatePath("/admin/certificates");
}
