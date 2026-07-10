import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
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

export const dynamic = "force-dynamic";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>
            <div className="relative min-h-screen flex flex-col">
              <main className="flex-1">{children}</main>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

