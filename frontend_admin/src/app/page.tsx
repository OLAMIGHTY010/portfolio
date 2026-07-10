import { HomeClient } from "@/components/sections/home-client";
import { getSiteSettings } from "@/lib/actions/settings";
import { getStats } from "@/lib/actions/stats";
import { getFeaturedProjects } from "@/lib/actions/projects";

// Ensure this page runs dynamically to pull fresh DB content
export const revalidate = 60;

export default async function HomePage() {
  const [settings, stats, featuredProjects] = await Promise.all([
    getSiteSettings(),
    getStats(),
    getFeaturedProjects(),
  ]);

  return (
    <HomeClient
      settings={settings}
      stats={stats}
      featuredProjects={featuredProjects}
    />
  );
}
