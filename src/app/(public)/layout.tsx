import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

import { getSiteSettings } from "@/lib/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: {
      default: settings.site_title,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.site_description,
    metadataBase: new URL(settings.site_url),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: settings.site_url,
      title: settings.site_title,
      description: settings.site_description,
      siteName: settings.site_name,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.site_title,
      description: settings.site_description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

import { Analytics } from "@vercel/analytics/react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>
            <div className="relative min-h-screen flex flex-col">
              <Navbar siteName={settings.site_name} />
              <main className="flex-1">{children}</main>
              <Footer settings={settings} />
            </div>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
