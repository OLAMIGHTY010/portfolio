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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setRefreshing(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      // 1. Fetch counts
      const [projects, certificates, blogPosts, messages] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false),
      ]);

      setStats({
        projects: projects.count || 0,
        certificates: certificates.count || 0,
        blogPosts: blogPosts.count || 0,
        messages: messages.count || 0,
      });

      // 2. Fetch live settings summary
      const { data: settings } = await supabase
        .from("site_settings")
        .select("site_name, site_title, is_open_to_opportunities")
        .eq("id", "default")
        .single();
        
      if (settings) {
        setConfig({
          siteName: settings.site_name,
          siteTitle: settings.site_title,
          isOpen: settings.is_open_to_opportunities,
        });
      }

      // 3. Perform diagnostic table checks
      const tableNames = [
        "profiles", "projects", "certificates", "blog_posts", "messages",
        "site_settings", "stats", "timeline", "experiences", "skill_categories"
      ];

      const checkPromises = tableNames.map(async (name) => {
        const { error } = await supabase.from(name).select("*").limit(1);
        // If PGRST116 (single item missing) or no error, table exists.
        // If the error code indicates relation does not exist (typically 42P01), table is missing.
        // In Supabase postgrest, relation missing usually returns a 404 status / code 'PGRST116' is not table missing,
        // but table missing returns a code like '42P01'.
        const code = error?.code;
        const exists = !error || (code !== "42P01" && !error?.message?.includes("does not exist"));
        return { name, exists };
      });

      const checkedTables = await Promise.all(checkPromises);
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
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Supabase Tables Status
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
            ) : tables.length === 0 ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Connection to Supabase failed. Please verify your environment variables.
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

                {!allTablesOk && (
                  <div className="mt-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-sm space-y-2">
                    <p className="font-semibold text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Database Migration Required
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      One or more schema tables are missing. Copy the SQL script located in the
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
                  <Button variant="outline" className="w-full rounded-xl" render={<Link href="/admin/settings" />}>
                    Edit Settings Hub
                  </Button>
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
