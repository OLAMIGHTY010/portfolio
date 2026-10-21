"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  User,
  FolderGit2,
  Briefcase,
  Code2,
  Award,
  BookOpen,
  Mail,
  FileText,
  Copy,
  Check,
  Sun,
  Moon,
  Activity,
  BarChart3,
  Terminal,
  ArrowRight,
  X,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category: "Navigation" | "Featured Projects" | "Actions" | "Social";
  icon: React.ComponentType<{ className?: string }>;
  perform: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeUrl?: string;
}

export function CommandPalette({ open, onOpenChange, resumeUrl = "/resume.pdf" }: CommandPaletteProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const close = useCallback(() => {
    onOpenChange(false);
    setQuery("");
    setSelectedIndex(0);
  }, [onOpenChange]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("nanicomlekan111@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  }, []);

  const items: CommandItem[] = useMemo(() => [
    // Navigation
    {
      id: "nav-home",
      title: "Home",
      description: "Return to the portfolio hero page",
      category: "Navigation",
      icon: Home,
      perform: () => { router.push("/"); close(); },
      keywords: ["main", "landing", "start"],
    },
    {
      id: "nav-about",
      title: "About Me",
      description: "My background, education, and career journey",
      category: "Navigation",
      icon: User,
      perform: () => { router.push("/about"); close(); },
      keywords: ["bio", "story", "education", "profile"],
    },
    {
      id: "nav-projects",
      title: "Projects",
      description: "Explore all software and analytics projects",
      category: "Navigation",
      icon: FolderGit2,
      perform: () => { router.push("/projects"); close(); },
      keywords: ["work", "portfolio", "code", "repos"],
    },
    {
      id: "nav-experience",
      title: "Experience",
      description: "Banking operations, incident management & career history",
      category: "Navigation",
      icon: Briefcase,
      perform: () => { router.push("/experience"); close(); },
      keywords: ["jobs", "employment", "career", "history", "roles"],
    },
    {
      id: "nav-skills",
      title: "Skills & Stack",
      description: "Full stack engineering, SQL, BI & business analysis toolkit",
      category: "Navigation",
      icon: Code2,
      perform: () => { router.push("/skills"); close(); },
      keywords: ["tech", "languages", "python", "golang", "typescript", "powerbi"],
    },
    {
      id: "nav-certifications",
      title: "Certifications",
      description: "Professional licenses and accredited credentials",
      category: "Navigation",
      icon: Award,
      perform: () => { router.push("/certifications"); close(); },
      keywords: ["licenses", "courses", "certificates"],
    },
    {
      id: "nav-blog",
      title: "Blog",
      description: "Technical articles, guides, and engineering thoughts",
      category: "Navigation",
      icon: BookOpen,
      perform: () => { router.push("/blog"); close(); },
      keywords: ["articles", "posts", "writing"],
    },
    {
      id: "nav-contact",
      title: "Contact",
      description: "Send a message or reach out for opportunities",
      category: "Navigation",
      icon: Mail,
      perform: () => { router.push("/contact"); close(); },
      keywords: ["message", "hire", "email", "reach out"],
    },

    // Featured Projects
    {
      id: "proj-banking",
      title: "Banking Transaction Monitor",
      description: "Real-time transaction tracking and automated anomaly alerts",
      category: "Featured Projects",
      icon: Activity,
      perform: () => { router.push("/projects/banking-transaction-monitor"); close(); },
      keywords: ["fintech", "monitoring", "sql", "python", "banking"],
    },
    {
      id: "proj-powerbi",
      title: "Executive Power BI Dashboard",
      description: "Interactive KPI reporting and executive data analytics",
      category: "Featured Projects",
      icon: BarChart3,
      perform: () => { router.push("/projects/executive-power-bi-dashboard"); close(); },
      keywords: ["dax", "bi", "data modeling", "dashboard", "analytics"],
    },
    {
      id: "proj-devops",
      title: "DevOps CLI Toolkit",
      description: "High-performance Go CLI for automating infrastructure tasks",
      category: "Featured Projects",
      icon: Terminal,
      perform: () => { router.push("/projects/devops-cli-toolkit"); close(); },
      keywords: ["golang", "cli", "cobra", "automation", "devops"],
    },

    // Quick Actions
    {
      id: "action-resume",
      title: "Download Resume / CV",
      description: "Open and download the latest resume PDF",
      category: "Actions",
      icon: FileText,
      perform: () => { window.open(resumeUrl, "_blank"); close(); },
      keywords: ["cv", "resume", "pdf", "download"],
    },
    {
      id: "action-copy-email",
      title: copiedEmail ? "Email Copied!" : "Copy Email Address",
      description: "nanicomlekan111@gmail.com",
      category: "Actions",
      icon: copiedEmail ? Check : Copy,
      perform: () => copyEmail(),
      keywords: ["email", "copy", "gmail"],
    },
    {
      id: "action-theme",
      title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      description: "Toggle portfolio theme colors",
      category: "Actions",
      icon: theme === "dark" ? Sun : Moon,
      perform: () => setTheme(theme === "dark" ? "light" : "dark"),
      keywords: ["theme", "color", "dark", "light", "mode"],
    },

    // Social Links
    {
      id: "social-github",
      title: "GitHub Profile",
      description: "github.com/OLAMIGHTY010",
      category: "Social",
      icon: GithubIcon,
      perform: () => { window.open("https://github.com/OLAMIGHTY010", "_blank"); close(); },
      keywords: ["git", "code", "repositories", "open source"],
    },
    {
      id: "social-linkedin",
      title: "LinkedIn Profile",
      description: "linkedin.com/in/olatunbosun-olalekan",
      category: "Social",
      icon: LinkedinIcon,
      perform: () => { window.open("https://www.linkedin.com/in/olatunbosun-olalekan/", "_blank"); close(); },
      keywords: ["network", "profile", "connect"],
    },
  ], [router, theme, setTheme, resumeUrl, copiedEmail, close, copyEmail]);

  // Filter items based on user search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase().trim();
    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.keywords?.some((k) => k.toLowerCase().includes(lower))
      );
    });
  }, [items, query]);

  // Reset selected index when query changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation & global shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const active = filteredItems[selectedIndex];
        if (active) {
          active.perform();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange, close, filteredItems, selectedIndex]);

  // Group items by category
  const categories = useMemo(() => {
    const groups: { category: string; items: CommandItem[] }[] = [];
    filteredItems.forEach((item) => {
      let g = groups.find((grp) => grp.category === item.category);
      if (!g) {
        g = { category: item.category, items: [] };
        groups.push(g);
      }
      g.items.push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, page, or project..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 divide-y divide-border/40 space-y-2">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  <p>No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    Try searching for &ldquo;Projects&rdquo;, &ldquo;Resume&rdquo;, or &ldquo;Experience&rdquo;
                  </p>
                </div>
              ) : (
                categories.map((group) => (
                  <div key={group.category} className="pt-1.5 first:pt-0">
                    <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                      {group.category}
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {group.items.map((item) => {
                        const globalIndex = filteredItems.findIndex((it) => it.id === item.id);
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.id}
                            onClick={item.perform}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition-colors group ${
                              isSelected
                                ? "bg-primary text-primary-foreground font-medium"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`p-1.5 rounded-lg shrink-0 ${
                                  isSelected
                                    ? "bg-primary-foreground/15 text-primary-foreground"
                                    : "bg-muted text-foreground group-hover:text-primary"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="truncate">
                                <div className="truncate font-medium">{item.title}</div>
                                {item.description && (
                                  <div
                                    className={`text-xs truncate ${
                                      isSelected
                                        ? "text-primary-foreground/80"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <ArrowRight
                              className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                                isSelected
                                  ? "translate-x-0.5 opacity-100"
                                  : "opacity-0 group-hover:opacity-60"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer keyboard helpers */}
            <div className="px-4 py-2 border-t border-border bg-muted/40 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded border border-border bg-background font-mono text-[10px]">↑</kbd>
                  <kbd className="px-1 py-0.5 rounded border border-border bg-background font-mono text-[10px]">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-[10px]">↵</kbd>
                  to select
                </span>
              </div>
              <span className="hidden sm:inline-block">
                Press <kbd className="px-1 py-0.5 rounded border border-border bg-background font-mono text-[10px]">ESC</kbd> to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
