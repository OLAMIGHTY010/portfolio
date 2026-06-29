import { apiFetch } from "../api-client";
import type { CertificateInput, Certificate } from "@/lib/types";

export async function getCertificates(): Promise<Certificate[]> {
  try {
    return await apiFetch<Certificate[]>("/certificates");
  } catch (err) {
    console.warn("Failed to fetch certificates from API:", err);
    return [];
  }
}

export async function createCertificate(certificate: CertificateInput): Promise<Certificate> {
  return await apiFetch<Certificate>("/certificates", {
    method: "POST",
    body: JSON.stringify(certificate),
  });
}

export async function updateCertificate(
  id: string,
  certificate: Partial<CertificateInput>
): Promise<Certificate> {
  return await apiFetch<Certificate>(`/certificates/${id}`, {
    method: "PUT",
    body: JSON.stringify(certificate),
  });
}

export async function deleteCertificate(id: string): Promise<void> {
  await apiFetch<void>(`/certificates/${id}`, {
    method: "DELETE",
  });
}
