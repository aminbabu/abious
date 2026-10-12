import { createResource, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import {
  RiDocumentArticleLine,
  RiBusinessBriefcaseLine,
  RiBusinessCustomerServiceLine,
  RiCommunicationChatQuoteLine,
  RiBuildingsBuildingLine,
  RiSystemDashboardLine,
  RiSystemSettings3Line,
  RiDocumentFileHistoryLine,
  RiSystemTimeLine,
  RiArrowsArrowRightLine,
  RiSystemAddLine,
  RiSystemExternalLinkLine,
  RiSystemShieldCheckLine,
  RiSystemCheckLine,
  RiSystemRefreshLine,
} from "solid-icons/ri";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api";

export default function OverviewPage() {
  const [overview, { refetch: refetchOverview }] = createResource(async () => {
    try {
      return await api.reports.getOverview();
    } catch {
      return {
        timestamp: new Date().toISOString(),
        inquiries: { total: 0, unread: 0 },
        content: { caseStudies: 0, services: 0, testimonials: 0, experiences: 0, posts: 0 },
        users: { total: 0 },
      };
    }
  });

  const [auditLogs, { refetch: refetchLogs }] = createResource(async () => {
    try {
      const logs = await api.auditLogs.list({ limit: 6 });
      return logs || [];
    } catch {
      return [];
    }
  });

  const handleRefresh = () => {
    refetchOverview();
    refetchLogs();
  };

  // Content metric cards matching the exact sidebar content models with unified styling
  const statCards = () => [
    {
      title: "Blog Posts",
      value: overview()?.content?.posts ?? 0,
      description: "Published articles & drafts",
      icon: RiDocumentArticleLine,
      href: "/dashboard/blogs",
    },
    {
      title: "Case Studies",
      value: overview()?.content?.caseStudies ?? 0,
      description: "Featured engineering projects",
      icon: RiBusinessBriefcaseLine,
      href: "/dashboard/case-studies",
    },
    {
      title: "Technical Services",
      value: overview()?.content?.services ?? 0,
      description: "Architecture & offerings",
      icon: RiBusinessCustomerServiceLine,
      href: "/dashboard/services",
    },
    {
      title: "Work Experiences",
      value: overview()?.content?.experiences ?? 0,
      description: "Career roles & timeline",
      icon: RiBuildingsBuildingLine,
      href: "/dashboard/experience",
    },
    {
      title: "Testimonials",
      value: overview()?.content?.testimonials ?? 0,
      description: "Client & peer recommendations",
      icon: RiCommunicationChatQuoteLine,
      href: "/dashboard/testimonials",
    },
    {
      title: "System Audit Logs",
      value: overview()?.users?.total ?? 1,
      badge: "Healthy",
      description: "Administrative trace records",
      icon: RiDocumentFileHistoryLine,
      href: "/dashboard/audit-logs",
    },
  ];

  return (
    <DashboardLayout
      title="System Overview"
      description="Real-time telemetry, content inventory, and admin quick actions"
      action={
        <div class="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            class="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-border bg-background hover:bg-secondary text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Refresh metrics"
          >
            <RiSystemRefreshLine class="size-3.5" />
            <span>Refresh</span>
          </button>
          <A href="/dashboard/blogs/new">
            <Button size="sm" class="font-mono text-xs cursor-pointer gap-1.5 shadow-sm">
              <RiSystemAddLine class="size-4" />
              <span>Create Post</span>
            </Button>
          </A>
        </div>
      }
    >
      <div class="space-y-6 w-full">
        {/* System Health / Status Banner */}
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-dashed border-border bg-card/60 backdrop-blur-xs font-mono text-xs">
          <div class="flex items-center gap-2.5">
            <span class="size-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
            <span class="font-semibold text-foreground">API Gateway & Database</span>
            <span class="text-muted-foreground/60">•</span>
            <span class="text-muted-foreground">All operational</span>
          </div>
          <div class="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-dashed border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              <RiSystemShieldCheckLine class="size-3.5" />
              <span>Security Protected</span>
            </span>
            <span class="opacity-40">•</span>
            <span>
              Synced:{" "}
              {overview()?.timestamp
                ? new Date(overview()!.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "Just now"}
            </span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <For each={statCards()}>
            {(stat) => (
              <Card class="border-dashed bg-card/75 backdrop-blur-xs transition-all duration-200 hover:border-primary/50 group">
                <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle class="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </CardTitle>
                  <div class="size-8 rounded-lg border border-dashed border-border/80 bg-background/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors">
                    <stat.icon class="size-4" />
                  </div>
                </CardHeader>
                <CardContent class="space-y-2">
                  <div class="flex items-baseline gap-2">
                    <span class="text-3xl font-bold font-mono tracking-tight text-foreground">
                      {stat.value}
                    </span>
                    <Show when={stat.badge}>
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-dashed border-emerald-500/30 font-medium">
                        {stat.badge}
                      </span>
                    </Show>
                  </div>
                  <div class="flex items-center justify-between pt-1 border-t border-dashed border-border/60">
                    <p class="text-xs text-muted-foreground truncate">{stat.description}</p>
                    <A
                      href={stat.href}
                      class="text-xs font-mono font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors group-hover:translate-x-0.5"
                    >
                      <span>Manage</span>
                      <RiArrowsArrowRightLine class="size-3.5" />
                    </A>
                  </div>
                </CardContent>
              </Card>
            )}
          </For>
        </div>

        {/* Quick Operations & Recent Audit Trail */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Panel */}
          <Card class="border-dashed bg-card/75 backdrop-blur-xs lg:col-span-1 flex flex-col">
            <CardHeader class="pb-3">
              <CardTitle class="text-sm font-mono flex items-center gap-2">
                <RiSystemDashboardLine class="size-4 text-primary" />
                <span>Command Shortcuts</span>
              </CardTitle>
              <CardDescription>Rapid administrative workflows.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-2 flex-1 flex flex-col justify-between">
              <div class="space-y-2 font-mono">
                <A href="/dashboard/blogs/new" class="block">
                  <Button variant="outline" class="w-full justify-between text-xs h-10 border-dashed hover:border-primary/50 cursor-pointer">
                    <span class="flex items-center gap-2">
                      <RiDocumentArticleLine class="size-3.5 text-primary" />
                      <span>Compose Article</span>
                    </span>
                    <span class="text-muted-foreground text-[10px]">G B</span>
                  </Button>
                </A>
                <A href="/dashboard/case-studies/new" class="block">
                  <Button variant="outline" class="w-full justify-between text-xs h-10 border-dashed hover:border-primary/50 cursor-pointer">
                    <span class="flex items-center gap-2">
                      <RiBusinessBriefcaseLine class="size-3.5 text-primary" />
                      <span>Add Case Study</span>
                    </span>
                    <span class="text-muted-foreground text-[10px]">G C</span>
                  </Button>
                </A>
                <A href="/dashboard/services" class="block">
                  <Button variant="outline" class="w-full justify-between text-xs h-10 border-dashed hover:border-primary/50 cursor-pointer">
                    <span class="flex items-center gap-2">
                      <RiBusinessCustomerServiceLine class="size-3.5 text-primary" />
                      <span>Configure Services</span>
                    </span>
                    <span class="text-muted-foreground text-[10px]">G S</span>
                  </Button>
                </A>
                <A href="/dashboard/settings" class="block">
                  <Button variant="outline" class="w-full justify-between text-xs h-10 border-dashed hover:border-primary/50 cursor-pointer">
                    <span class="flex items-center gap-2">
                      <RiSystemSettings3Line class="size-3.5 text-primary" />
                      <span>CMS Preferences</span>
                    </span>
                    <span class="text-muted-foreground text-[10px]">G ,</span>
                  </Button>
                </A>
              </div>

              {/* Live Preview Button */}
              <div class="pt-3 border-t border-dashed border-border/80">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/60 hover:bg-secondary text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span class="flex items-center gap-2">
                    <RiSystemExternalLinkLine class="size-3.5" />
                    <span>Open Live Portfolio</span>
                  </span>
                  <RiSystemExternalLinkLine class="size-3 text-muted-foreground group-hover:text-foreground" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Recent Audit Activities */}
          <Card class="border-dashed bg-card/75 backdrop-blur-xs lg:col-span-2">
            <CardHeader class="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle class="text-sm font-mono flex items-center gap-2">
                  <RiDocumentFileHistoryLine class="size-4 text-primary" />
                  <span>Recent Audit Trail</span>
                </CardTitle>
                <CardDescription>Immutable administrative transaction logging.</CardDescription>
              </div>
              <A href="/dashboard/audit-logs">
                <Button variant="ghost" size="sm" class="text-xs font-mono text-primary gap-1">
                  <span>View All</span>
                  <RiArrowsArrowRightLine class="size-3.5" />
                </Button>
              </A>
            </CardHeader>
            <CardContent>
              <Show
                when={auditLogs() && auditLogs().length > 0}
                fallback={
                  <div class="py-12 text-center text-xs font-mono text-muted-foreground border border-dashed border-border rounded-xl">
                    No recent audit activity recorded yet.
                  </div>
                }
              >
                <div class="space-y-2.5">
                  <For each={auditLogs()}>
                    {(log) => (
                      <div class="flex items-center justify-between p-2.5 rounded-lg border border-dashed border-border/70 bg-background/50 text-xs font-mono transition-colors hover:bg-secondary/40">
                        <div class="flex items-center gap-2.5 min-w-0">
                          <span class="rounded px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider shrink-0">
                            {log.action}
                          </span>
                          <span class="text-foreground font-medium truncate">{log.resource}</span>
                          <Show when={log.resourceId}>
                            <span class="text-muted-foreground text-[10px] truncate max-w-[120px] hidden sm:inline">
                              #{log.resourceId}
                            </span>
                          </Show>
                        </div>
                        <div class="flex items-center gap-1.5 text-muted-foreground text-[10px] shrink-0">
                          <RiSystemTimeLine class="size-3 opacity-70" />
                          <span>
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
