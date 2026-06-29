import type { Metadata } from "next";
import { ContactClient } from "@/components/sections/contact-client";
import { getSiteSettings } from "@/lib/actions/settings";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Contact",
    description: `Connect with ${settings.site_name} for projects, opportunities, or collaborations.`,
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <ContactClient settings={settings} />
  );
}
