import { JSX, createSignal, Show, onMount, For, onCleanup } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import {
  RiSystemDashboardLine,
  RiDocumentArticleLine,
  RiBusinessBriefcaseLine,
  RiBusinessCustomerServiceLine,
  RiBuildingsBuildingLine,
  RiCommunicationChatQuoteLine,
  RiSystemSettings3Line,
  RiDocumentFileHistoryLine,
  RiSystemLogoutBoxRLine,
  RiSystemMenuLine,
  RiSystemMenuFoldLine,
  RiSystemMenuUnfoldLine,
  RiSystemCloseLine,
  RiSystemExternalLinkLine,
  RiArrowsArrowRightSLine,
  RiArrowsArrowLeftSLine,
  RiSystemSearchLine,
  RiDocumentFolder2Line,
  RiSystemAppsLine,
  RiSystemShieldCheckLine,
  RiSystemSideBarLine,
  RiDevelopmentCommandLine,
} from "solid-icons/ri";
import ThemeSwitcher from "~/components/theme-switcher";
import CommandDialog from "~/components/dashboard/command-dialog";
import { authClient } from "~/lib/auth-client";

interface NavItem {
  id: string;
  title: string;
  href: string;
  badge?: string;
  icon: (props: any) => JSX.Element;
  shortcut?: string;
}

interface NavGroup {
  id: string;
  label: string;
  icon: (props: any) => JSX.Element;
  description: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    icon: RiSystemDashboardLine,
    description: "System health & analytics",
    items: [
      { id: "dashboard", title: "Dashboard", href: "/dashboard/overview", icon: RiSystemDashboardLine, shortcut: "G D" },
    ],
  },
  {
    id: "content",
    label: "Content Studio",
    icon: RiDocumentFolder2Line,
    description: "Articles, projects & services",
    items: [
      { id: "blogs", title: "Blog Posts", href: "/dashboard/blogs", icon: RiDocumentArticleLine, badge: "CMS", shortcut: "G B" },
      { id: "cases", title: "Case Studies", href: "/dashboard/case-studies", icon: RiBusinessBriefcaseLine, shortcut: "G C" },
      { id: "services", title: "Services", href: "/dashboard/services", icon: RiBusinessCustomerServiceLine, shortcut: "G S" },
      { id: "experience", title: "Experiences", href: "/dashboard/experience", icon: RiBuildingsBuildingLine, shortcut: "G E" },
      { id: "testimonials", title: "Testimonials", href: "/dashboard/testimonials", icon: RiCommunicationChatQuoteLine, shortcut: "G T" },
    ],
  },
  {
    id: "system",
    label: "Settings & Logs",
    icon: RiSystemSettings3Line,
    description: "Preferences & audit records",
    items: [
      { id: "settings", title: "Settings", href: "/dashboard/settings", icon: RiSystemSettings3Line, shortcut: "G ," },
      { id: "audit", title: "Audit Logs", href: "/dashboard/audit-logs", icon: RiDocumentFileHistoryLine, badge: "Sec", shortcut: "G A" },
    ],
  },
];

const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);

export default function DashboardLayout(props: {
  title: string;
  description?: string;
  action?: JSX.Element;
  actions?: JSX.Element;
  children: JSX.Element;
}) {
  const location = useLocation();

  // Find active group based on current pathname
  const activeGroupForPath = () => {
    const curItem = allNavItems.find(
      (item) =>
        location.pathname === item.href ||
        (item.href !== "/dashboard/overview" && location.pathname.startsWith(item.href))
    );
    if (!curItem) return navGroups[0].id;
    const group = navGroups.find((g) => g.items.some((i) => i.id === curItem.id));
    return group ? group.id : navGroups[0].id;
  };

  const [selectedGroupId, setSelectedGroupId] = createSignal<string>(activeGroupForPath());
  const [flyoutPinned, setFlyoutPinned] = createSignal<boolean>(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = createSignal<boolean>(false);
  const [commandDialogOpen, setCommandDialogOpen] = createSignal<boolean>(false);
  const [user, setUser] = createSignal<{ name?: string; email?: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = createSignal<boolean>(true);
  const [quickFilter, setQuickFilter] = createSignal<string>("");

  onMount(async () => {
    // Global Cmd+K / Ctrl+K listener for Shadcn-like search
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandDialogOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeydown);
    onCleanup(() => window.removeEventListener("keydown", handleGlobalKeydown));

    // Restore flyout pinned preference
    try {
      const savedPinned = localStorage.getItem("ab_flyout_pinned");
      if (savedPinned !== null) {
        setFlyoutPinned(savedPinned === "true");
      }
    } catch {
      // Ignore localStorage error
    }

    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setUser(session.data.user);
        setCheckingAuth(false);
      } else {
        window.location.replace("/auth/login");
      }
    } catch {
      window.location.replace("/auth/login");
    }
  });

  const toggleFlyoutPinned = () => {
    const next = !flyoutPinned();
    setFlyoutPinned(next);
    try {
      localStorage.setItem("ab_flyout_pinned", String(next));
    } catch {
      // Ignore localStorage error
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.replace("/auth/login");
    } catch {
      window.location.replace("/auth/login");
    }
  };

  const currentGroup = () =>
    navGroups.find((g) => g.id === selectedGroupId()) || navGroups[0];

  const filteredItems = () => {
    const q = quickFilter().trim().toLowerCase();
    const items = currentGroup().items;
    if (!q) return items;
    return items.filter((i) => i.title.toLowerCase().includes(q));
  };

  const breadcrumb = () => {
    const cur = allNavItems.find(
      (i) =>
        location.pathname === i.href ||
        (i.href !== "/dashboard/overview" && location.pathname.startsWith(i.href))
    );
    return cur ? cur.title : props.title;
  };

  const userInitials = () => {
    const u = user();
    if (!u) return "?";
    if (u.name) return u.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    if (u.email) return u.email[0].toUpperCase();
    return "A";
  };

  return (
    <Show
      when={!checkingAuth() && user()}
      fallback={
        <div class="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-xs text-muted-foreground">
          <div class="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
          <span>Verifying authorization…</span>
        </div>
      }
    >
      <div class="min-h-screen bg-background text-foreground flex antialiased">
        {/* Mobile Backdrop */}
        <Show when={mobileDrawerOpen()}>
          <div
            class="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileDrawerOpen(false)}
          />
        </Show>

        {/* ══════════════════════════════════════════════════════════════════
            DESKTOP DUAL-RAIL COMMAND DOCK (Sticky, Left)
            ══════════════════════════════════════════════════════════════════ */}
        <aside class="hidden lg:flex sticky top-0 h-screen z-40 shrink-0 select-none border-r border-dashed border-border bg-card/90 backdrop-blur-xl">
          {/* ── Rail 1: Command Icon Rail (w-15 / 60px) ── */}
          <div class="flex flex-col items-center justify-between w-[64px] border-r border-dashed border-border/80 bg-background/50 py-4">
            {/* Brand Logo */}
            <div class="flex flex-col items-center">
              <A
                href="/"
                class="text-primary group relative px-1.5 py-0.5 font-mono text-sm font-medium inline-block select-none transition-transform hover:scale-105"
                title="Return to public site"
              >
                <span class="border-primary/60 group-hover:bg-border absolute inset-0 -z-10 border border-dashed bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed transition-colors duration-300" />
                ./ab
              </A>
            </div>

            {/* Core Rail Group Triggers */}
            <div class="flex flex-col items-center gap-2 my-auto">
              <For each={navGroups}>
                {(group) => {
                  const isSelected = () => selectedGroupId() === group.id;
                  const hasActiveRoute = () =>
                    group.items.some(
                      (item) =>
                        location.pathname === item.href ||
                        (item.href !== "/dashboard/overview" && location.pathname.startsWith(item.href))
                    );

                  return (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        if (!flyoutPinned()) setFlyoutPinned(true);
                      }}
                      title={`${group.label} — ${group.description}`}
                      class={`relative group/btn flex items-center justify-center size-11 rounded-xl transition-all duration-200 cursor-pointer ${
                        isSelected()
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-2 ring-primary/40"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <group.icon class="size-5" />

                      {/* Active indicator dot if group contains current route */}
                      <Show when={hasActiveRoute() && !isSelected()}>
                        <span class="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
                      </Show>

                      {/* Tooltip on hover */}
                      <span class="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-foreground text-background text-[11px] font-mono font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-opacity z-50 shadow-lg">
                        {group.label}
                      </span>
                    </button>
                  );
                }}
              </For>
            </div>

            {/* Rail Bottom Actions (Live site + Avatar) */}
            <div class="flex flex-col items-center gap-2.5 pt-2 border-t border-dashed border-border/70 w-full">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="View live site in new tab"
                class="flex items-center justify-center size-9 rounded-lg text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
              >
                <RiSystemExternalLinkLine class="size-4" />
              </a>

              {/* User Avatar */}
              <div
                class="size-8 rounded-full bg-primary/15 flex items-center justify-center text-[11px] font-mono font-bold text-primary ring-1 ring-primary/30"
                title={`${user()?.name || "Admin"} (${user()?.email || ""})`}
              >
                {userInitials()}
              </div>
            </div>
          </div>

          {/* ── Rail 2: Dynamic Flyout Command Panel (w-56) ── */}
          <div
            class={`flex flex-col transition-[width,opacity] duration-300 ease-in-out bg-card/95 ${
              flyoutPinned() ? "w-60 opacity-100" : "w-0 opacity-0 pointer-events-none overflow-hidden"
            }`}
          >
            {/* Panel Header */}
            <div class="flex items-center justify-between h-16 px-4 border-b border-dashed border-border/80">
              <div class="min-w-0">
                <span class="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 block">
                  Workspace
                </span>
                <h3 class="text-xs font-mono font-bold text-foreground truncate">
                  {currentGroup().label}
                </h3>
              </div>

              {/* Improved Sidebar Panel Close / Collapse Button */}
              <button
                type="button"
                onClick={toggleFlyoutPinned}
                title="Collapse sidebar panel"
                class="flex items-center justify-center size-8 rounded-lg border border-dashed border-border/80 text-muted-foreground hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive cursor-pointer transition-all"
                aria-label="Collapse sidebar panel"
              >
                <RiSystemMenuFoldLine class="size-4" />
              </button>
            </div>

            {/* Panel Quick Filter */}
            <div class="px-3 pt-3 pb-2">
              <div class="relative flex items-center">
                <RiSystemSearchLine class="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter views..."
                  value={quickFilter()}
                  onInput={(e) => setQuickFilter(e.currentTarget.value)}
                  class="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-background/70 border border-dashed border-border/80 text-[11px] font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Group Navigation Links */}
            <div class="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              <For each={filteredItems()}>
                {(item) => {
                  const isActive = () =>
                    location.pathname === item.href ||
                    (item.href !== "/dashboard/overview" && location.pathname.startsWith(item.href));

                  return (
                    <A
                      href={item.href}
                      class={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-mono font-medium transition-all group ${
                        isActive()
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <div class="flex items-center gap-2.5 min-w-0">
                        <item.icon class="size-3.5 shrink-0 opacity-80" />
                        <span class="truncate">{item.title}</span>
                      </div>

                      <div class="flex items-center gap-1.5 shrink-0">
                        <Show when={item.badge}>
                          <span
                            class={`px-1 py-0.2 rounded text-[9px] font-mono ${
                              isActive()
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {item.badge}
                          </span>
                        </Show>
                        <Show when={item.shortcut}>
                          <span
                            class={`text-[9px] font-mono tracking-tight ${
                              isActive() ? "text-primary-foreground/70" : "text-muted-foreground/50"
                            }`}
                          >
                            {item.shortcut}
                          </span>
                        </Show>
                      </div>
                    </A>
                  );
                }}
              </For>
            </div>

            {/* Flyout Panel Footer */}
            <div class="border-t border-dashed border-border/80 p-3 space-y-2">
              <div class="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span class="flex items-center gap-1 text-primary">
                  <RiSystemShieldCheckLine class="size-3" />
                  <span>Admin Session</span>
                </span>
                <span>Active</span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                class="w-full flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-mono text-destructive hover:bg-destructive/10 border border-dashed border-destructive/30 transition-colors cursor-pointer"
              >
                <RiSystemLogoutBoxRLine class="size-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════════
            MOBILE DRAWER (Overlay for screens < lg)
            ══════════════════════════════════════════════════════════════════ */}
        <aside
          class={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-dashed border-border bg-card/95 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:hidden ${
            mobileDrawerOpen() ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Header */}
          <div class="flex h-16 items-center justify-between border-b border-dashed border-border px-5">
            <A
              href="/"
              class="text-primary group relative px-1.5 font-mono text-sm font-medium inline-block select-none"
            >
              <span class="border-primary/60 group-hover:bg-border absolute inset-0 -z-10 border border-dashed bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed transition-colors duration-300" />
              ./ab <span class="text-[10px] text-muted-foreground ml-0.5">cms</span>
            </A>
            <button
              type="button"
              class="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary cursor-pointer transition-colors"
              onClick={() => setMobileDrawerOpen(false)}
            >
              <RiSystemCloseLine class="size-5" />
            </button>
          </div>

          {/* Mobile Navigation List */}
          <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            <For each={navGroups}>
              {(group) => (
                <div>
                  <p class="px-2 mb-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {group.label}
                  </p>
                  <div class="space-y-0.5">
                    <For each={group.items}>
                      {(item) => {
                        const isActive = () =>
                          location.pathname === item.href ||
                          (item.href !== "/dashboard/overview" && location.pathname.startsWith(item.href));

                        return (
                          <A
                            href={item.href}
                            onClick={() => setMobileDrawerOpen(false)}
                            class={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-mono font-medium transition-all ${
                              isActive()
                                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`}
                          >
                            <div class="flex items-center gap-2.5">
                              <item.icon class="size-4 shrink-0" />
                              <span>{item.title}</span>
                            </div>
                            <Show when={item.badge}>
                              <span
                                class={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                                  isActive()
                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {item.badge}
                              </span>
                            </Show>
                          </A>
                        );
                      }}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </nav>

          {/* Mobile Footer */}
          <div class="border-t border-dashed border-border p-4 space-y-2">
            <div class="flex items-center gap-2.5 rounded-lg border border-dashed border-border/70 px-3 py-2">
              <div class="size-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-mono font-bold text-primary shrink-0 ring-1 ring-primary/30">
                {userInitials()}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-mono font-medium text-foreground truncate">
                  {user()?.name || "Admin"}
                </p>
                <p class="text-[10px] text-muted-foreground truncate">{user()?.email || ""}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              class="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-mono text-destructive hover:bg-destructive/10 border border-dashed border-destructive/30 transition-colors cursor-pointer"
            >
              <RiSystemLogoutBoxRLine class="size-3.5 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════════
            MAIN CONTENT AREA
            ══════════════════════════════════════════════════════════════════ */}
        <div class="flex flex-1 flex-col min-w-0">
          {/* Sticky Dashboard Top Header */}
          <header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-dashed border-border bg-card/85 px-4 backdrop-blur-md sm:px-6">
            {/* Mobile menu toggler */}
            <button
              type="button"
              class={`rounded-lg p-2 transition-colors lg:hidden cursor-pointer ${
                mobileDrawerOpen()
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              onClick={() => setMobileDrawerOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              title={mobileDrawerOpen() ? "Close menu" : "Open menu"}
            >
              <Show
                when={mobileDrawerOpen()}
                fallback={<RiSystemMenuLine class="size-5" />}
              >
                <RiSystemCloseLine class="size-5" />
              </Show>
            </button>

            {/* Desktop sidebar expand toggler (only visible when sidebar panel is collapsed) */}
            <Show when={!flyoutPinned()}>
              <button
                type="button"
                onClick={toggleFlyoutPinned}
                class="hidden lg:flex items-center justify-center size-9 rounded-lg border border-dashed border-border/80 bg-background/60 hover:bg-secondary hover:border-primary/50 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                title="Expand sidebar panel"
                aria-label="Expand sidebar panel"
              >
                <RiSystemMenuUnfoldLine class="size-4 text-primary" />
              </button>
            </Show>

            {/* Breadcrumb / Title Bar */}
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <span class="hover:text-foreground transition-colors">CMS</span>
                <RiArrowsArrowRightSLine class="size-3 shrink-0" />
                <span class="text-foreground font-semibold truncate">{breadcrumb()}</span>
              </div>
              <Show when={props.description}>
                <p class="text-[11px] text-muted-foreground truncate hidden sm:block mt-0.5">
                  {props.description}
                </p>
              </Show>
            </div>

            {/* Top Right Controls */}
            <div class="flex items-center gap-2 shrink-0">
              {/* Shadcn-like Command Search Trigger Button */}
              <button
                type="button"
                onClick={() => setCommandDialogOpen(true)}
                class="hidden sm:inline-flex items-center gap-2.5 h-9 px-3 rounded-lg border border-dashed border-border/80 bg-background/70 hover:bg-secondary hover:border-primary/50 text-xs font-mono text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                title="Search commands (⌘K or Ctrl+K)"
                aria-label="Search dashboard commands"
              >
                <RiSystemSearchLine class="size-3.5 text-primary" />
                <span class="hidden md:inline">Search commands...</span>
                <span class="inline md:hidden">Search</span>
                <kbd class="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted/70 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <RiDevelopmentCommandLine class="size-2.5" />
                  <span>K</span>
                </kbd>
              </button>

              {/* Mobile Search Icon Button */}
              <button
                type="button"
                onClick={() => setCommandDialogOpen(true)}
                class="sm:hidden flex items-center justify-center size-9 rounded-lg border border-dashed border-border/80 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                aria-label="Search"
              >
                <RiSystemSearchLine class="size-4" />
              </button>

              <Show when={props.action || props.actions}>
                <div class="flex items-center gap-2">{props.action || props.actions}</div>
              </Show>

              <ThemeSwitcher />

              {/* User badge */}
              <div class="flex items-center gap-2 pl-2 border-l border-dashed border-border">
                <div class="size-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-mono font-bold text-primary ring-1 ring-primary/30">
                  {userInitials()}
                </div>
                <div class="hidden sm:block">
                  <p class="text-xs font-mono font-medium text-foreground leading-tight max-w-[120px] truncate">
                    {user()?.name || "Admin"}
                  </p>
                  <p class="text-[10px] text-muted-foreground leading-tight max-w-[120px] truncate">
                    {user()?.email || ""}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div class="w-full space-y-6">
              {props.children}
            </div>
          </main>
        </div>

        {/* Shadcn-like Command Palette Dialog */}
        <CommandDialog
          open={commandDialogOpen()}
          onClose={() => setCommandDialogOpen(false)}
        />
      </div>
    </Show>
  );
}
