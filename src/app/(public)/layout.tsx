import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/actions/settings";
import { Analytics } from "@vercel/analytics/react";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <>
      <div className="relative min-h-screen flex flex-col">
        <Navbar siteName={settings.site_name} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </div>
      <Analytics />
    </>
  );
}
