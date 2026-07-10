import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/sections/animated-section";
import { CertCard } from "@/components/cards/cert-card";
import type { Certificate } from "@/lib/types";
import { isPlaceholderConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Professional certifications in cybersecurity, SQL, Power BI, business agility, and compliance.",
};

const FALLBACK_CERTS: Certificate[] = [
  { id: "1", name: "Introduction to Cybersecurity", organization: "Cisco Networking Academy", date_achieved: "2024-03-15", image_url: null, verification_url: "https://www.credly.com/", sort_order: 1, created_at: "", updated_at: "" },
  { id: "2", name: "SQL for Data Science", organization: "Coursera / UC Davis", date_achieved: "2023-11-20", image_url: null, verification_url: "https://www.coursera.org/", sort_order: 2, created_at: "", updated_at: "" },
  { id: "3", name: "Power BI Data Analyst Associate", organization: "Microsoft", date_achieved: "2024-01-10", image_url: null, verification_url: "https://learn.microsoft.com/", sort_order: 3, created_at: "", updated_at: "" },
  { id: "4", name: "Business Agility Foundation", organization: "ICAgile", date_achieved: "2023-08-05", image_url: null, verification_url: "https://www.icagile.com/", sort_order: 4, created_at: "", updated_at: "" },
  { id: "5", name: "Anti-Money Laundering (AML) Compliance", organization: "FITC Nigeria", date_achieved: "2023-06-18", image_url: null, verification_url: "https://www.fitc-ng.com/", sort_order: 5, created_at: "", updated_at: "" },
];

async function getCertificates(): Promise<Certificate[]> {
  if (isPlaceholderConfig()) return FALLBACK_CERTS;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return FALLBACK_CERTS;
    return data;
  } catch {
    return FALLBACK_CERTS;
  }
}

export default async function CertificationsPage() {
  const certificates = await getCertificates();

  return (
    <div className="pt-28">
      <section className="section-padding !pt-8">
        <div className="container-custom">
          <FadeIn>
            <div className="max-w-3xl mb-16">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Credentials
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                Professional{" "}
                <span className="gradient-text">Certifications</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Validated expertise across cybersecurity, data analytics, business intelligence, and compliance.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => (
              <StaggerItem key={cert.id}>
                <CertCard certificate={cert} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
