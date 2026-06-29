"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Award,
  FileText,
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Settings,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

import { API_URL } from "@/lib/api-client";
import { getSiteSettings } from "@/lib/actions/settings";
import { getStats } from "@/lib/actions/stats";
import { getTimeline } from "@/lib/actions/timeline";
import { getExperiences } from "@/lib/actions/experience";
import { getSkillCategories } from "@/lib/actions/skills";
import { getProjects } from "@/lib/actions/projects";
import { getCertificates } from "@/lib/actions/certificates";
import { getBlogPosts } from "@/lib/actions/blog";
import { getMessages } from "@/lib/actions/messages";

interface Stats {
  projects: number;
  certificates: number;
  blogPosts: number;
  messages: number;
}

interface TableStatus {
  name: string;
  exists: boolean;
}

interface LiveConfig {
  siteName: string;
  siteTitle: string;
  isOpen: boolean;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [config, setConfig] = useState<LiveConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbMode, setDbMode] = useState<"supabase" | "fallback" | "offline">("offline");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setRefreshing(true);
    setLoading(true);
    try {
      // 1. Check Backend Health & Database Mode
      let mode: "supabase" | "fallback" | "offline" = "offline";
      try {
        const healthUrl = API_URL.replace(/\/api$/, "/health");
        const healthRes = await fetch(healthUrl, { cache: "no-store" });
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          mode = healthData.db_mode || "supabase";
        }
      } catch (err) {
        console.error("Backend health check failed:", err);
      }
      setDbMode(mode);

      if (mode === "offline") {
        setStats({ projects: 0, certificates: 0, blogPosts: 0, messages: 0 });
        setTables([]);
        setConfig(null);
        return;
      }

      // 2. Fetch counts & settings via Express API action helpers
      let projectsList: any[] = [];
      let certificatesList: any[] = [];
      let blogPostsList: any[] = [];
      let messagesList: any[] = [];
      let settings: any = null;

      try { projectsList = await getProjects(false); } catch (e) { console.error(e); }
      try { certificatesList = await getCertificates(); } catch (e) { console.error(e); }
      try { blogPostsList = await getBlogPosts(false); } catch (e) { console.error(e); }
      try { messagesList = await getMessages(); } catch (e) { console.error(e); }
      try { settings = await getSiteSettings(); } catch (e) { console.error(e); }

      setStats({
        projects: projectsList.length,
        certificates: certificatesList.length,
        blogPosts: blogPostsList.length,
        messages: messagesList.filter((m) => !m.read).length,
      });

      if (settings) {
        setConfig({
          siteName: settings.site_name,
          siteTitle: settings.site_title,
          isOpen: settings.is_open_to_opportunities,
        });
      }

      // 3. Table diagnostics via API checking
      const tablesToCheck = [
        { name: "site_settings", check: () => getSiteSettings() },
        { name: "stats", check: () => getStats() },
        { name: "timeline", check: () => getTimeline() },
        { name: "experiences", check: () => getExperiences() },
        { name: "skill_categories", check: () => getSkillCategories() },
        { name: "projects", check: () => getProjects(false) },
        { name: "certificates", check: () => getCertificates() },
        { name: "blog_posts", check: () => getBlogPosts(false) },
        { name: "messages", check: () => getMessages() },
      ];

      const checkedTables = await Promise.all(
        tablesToCheck.map(async (t) => {
          if (mode === "fallback") {
            // In local-fallback mode, tables are mocked virtually and always succeed
            return { name: t.name, exists: true };
          }
          try {
            await t.check();
            return { name: t.name, exists: true };
          } catch (e) {
            console.error(`Table check failed for ${t.name}:`, e);
            return { name: t.name, exists: false };
          }
        })
      );
      setTables(checkedTables);

    } catch (err) {
      console.error("Dashboard diagnostic fetch failed:", err);
      setStats({ projects: 0, certificates: 0, blogPosts: 0, messages: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const statCards = [
    { title: "Projects", value: stats?.projects, icon: FolderKanban, color: "text-blue-500", href: "/admin/projects" },
    { title: "Certificates", value: stats?.certificates, icon: Award, color: "text-emerald-500", href: "/admin/certificates" },
    { title: "Blog Posts", value: stats?.blogPosts, icon: FileText, color: "text-purple-500", href: "/admin/blog" },
    { title: "Unread Messages", value: stats?.messages, icon: Inbox, color: "text-orange-500", href: "/admin/inbox" },
  ];

  const allTablesOk = tables.length > 0 && tables.every((t) => t.exists);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Diagnostics</h1>
          <p className="text-muted-foreground mt-1">
            Real-time status overview of database schemas, configs, and metrics.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="gap-2 self-start"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Diagnostics
        </Button>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href} className="block group">
            <Card className="hover:border-primary/30 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-5 w-5 ${card.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-foreground">{card.value}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connection Diagnostics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Database Diagnostics
              </span>
              {!loading && (
                <>
                  {dbMode === "fallback" && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      Local Fallback Mode
                    </Badge>
                  )}
                  {dbMode === "supabase" && (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      Supabase Connected
                    </Badge>
                  )}
                  {dbMode === "offline" && (
                    <Badge variant="destructive">
                      API Server Offline
                    </Badge>
                  )}
                </>
              )}
            </CardTitle>
            <CardDescription>
              We run real-time checks on the status of your tables to make sure they are active.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : dbMode === "offline" ? (
              <div className="flex flex-col gap-3 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-sm">
                <p className="font-semibold text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Connection to API Server failed.
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Make sure your backend API server is deployed and running, and that the
                  <code className="px-1.5 py-0.5 rounded bg-muted font-mono font-bold text-foreground mx-1">
                    NEXT_PUBLIC_API_URL
                  </code>
                  environment variable is correctly set in your project settings.
                </p>
              </div>
            ) : tables.length === 0 ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Could not fetch database status from the backend.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tables.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20"
                    >
                      <span className="font-mono text-sm font-medium text-foreground">{t.name}</span>
                      {t.exists ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                          <CheckCircle2 className="h-4 w-4" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
                          <AlertTriangle className="h-4 w-4" /> Missing
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {!allTablesOk && dbMode === "supabase" && (
                  <div className="mt-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-sm space-y-2">
                    <p className="font-semibold text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Database Migration Required
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      One or more schema tables are missing from Supabase. Copy the SQL script located in the
                      <code className="px-1.5 py-0.5 rounded bg-muted font-mono font-bold text-foreground mx-1">
                        supabase/schema.sql
                      </code>
                      file, open your Supabase Dashboard, select the SQL Editor, paste the script, and click &quot;Run&quot;.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Site Preview summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Live Site Info
            </CardTitle>
            <CardDescription>
              Active profile loaded from Site Settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : config ? (
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">Owner Name</span>
                  <p className="font-semibold text-foreground">{config.siteName}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">Homepage SEO Title</span>
                  <p className="text-muted-foreground leading-relaxed">{config.siteTitle}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-bold block mb-2">Availability Status</span>
                  <Badge variant={config.isOpen ? "default" : "secondary"}>
                    {config.isOpen ? "Open to opportunities" : "Not looking"}
                  </Badge>
                </div>
                <div className="pt-2">
                  <Link href="/admin/settings" passHref legacyBehavior>
                    <Button variant="outline" className="w-full rounded-xl">
                      Edit Settings Hub
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-6">
                No active settings row. Go to the Settings Hub to initialize.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
