import { JSX, createSignal, createEffect, onMount, onCleanup, Show, For } from "solid-js";
import { Portal } from "solid-js/web";
import { useNavigate } from "@solidjs/router";
import {
  RiSystemSearchLine,
  RiSystemDashboardLine,
  RiDocumentArticleLine,
  RiBusinessBriefcaseLine,
  RiBusinessCustomerServiceLine,
  RiBuildingsBuildingLine,
  RiCommunicationChatQuoteLine,
  RiSystemSettings3Line,
  RiDocumentFileHistoryLine,
  RiSystemLogoutBoxRLine,
  RiSystemExternalLinkLine,
  RiSystemCloseLine,
  RiSystemAddLine,
  RiWeatherSunLine,
  RiWeatherMoonLine,
  RiArrowsCornerDownLeftLine,
  RiArrowsArrowUpLine,
  RiArrowsArrowDownLine,
} from "solid-icons/ri";
import { authClient } from "~/lib/auth-client";
import { useTheme } from "~/context/theme";

export interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Quick Actions" | "Theme & System";
  shortcut?: string;
  icon: (props: any) => JSX.Element;
  onSelect: () => void;
  keywords?: string[];
}

interface CommandDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandDialog(props: CommandDialogProps) {
  const navigate = useNavigate();
  const themeContext = useTheme();
  const [search, setSearch] = createSignal("");
  const [selectedIndex, setSelectedIndex] = createSignal(0);
  let inputRef: HTMLInputElement | undefined;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.replace("/auth/login");
    } catch {
      window.location.replace("/auth/login");
    }
  };

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-overview",
      title: "Dashboard Overview",
      category: "Navigation",
      shortcut: "G D",
      icon: RiSystemDashboardLine,
      keywords: ["stats", "analytics", "home", "metrics"],
      onSelect: () => navigate("/dashboard/overview"),
    },
    {
      id: "nav-blogs",
      title: "Blog Posts",
      category: "Navigation",
      shortcut: "G B",
      icon: RiDocumentArticleLine,
      keywords: ["articles", "posts", "cms", "writing"],
      onSelect: () => navigate("/dashboard/blogs"),
    },
    {
      id: "nav-cases",
      title: "Case Studies",
      category: "Navigation",
      shortcut: "G C",
      icon: RiBusinessBriefcaseLine,
      keywords: ["portfolio", "projects", "work", "clients"],
      onSelect: () => navigate("/dashboard/case-studies"),
    },
    {
      id: "nav-services",
      title: "Services",
      category: "Navigation",
      shortcut: "G S",
      icon: RiBusinessCustomerServiceLine,
      keywords: ["offerings", "skills", "packages"],
      onSelect: () => navigate("/dashboard/services"),
    },
    {
      id: "nav-experience",
      title: "Experiences & Career",
      category: "Navigation",
      shortcut: "G E",
      icon: RiBuildingsBuildingLine,
      keywords: ["jobs", "timeline", "roles", "companies", "experience"],
      onSelect: () => navigate("/dashboard/experience"),
    },
    {
      id: "nav-testimonials",
      title: "Client Testimonials",
      category: "Navigation",
      shortcut: "G T",
      icon: RiCommunicationChatQuoteLine,
      keywords: ["reviews", "ratings", "feedback"],
      onSelect: () => navigate("/dashboard/testimonials"),
    },
    {
      id: "nav-audit",
      title: "Audit Logs",
      category: "Navigation",
      shortcut: "G A",
      icon: RiDocumentFileHistoryLine,
      keywords: ["security", "history", "activity", "events"],
      onSelect: () => navigate("/dashboard/audit-logs"),
    },
    {
      id: "nav-settings",
      title: "CMS Settings",
      category: "Navigation",
      shortcut: "G ,",
      icon: RiSystemSettings3Line,
      keywords: ["preferences", "configuration", "account"],
      onSelect: () => navigate("/dashboard/settings"),
    },

    // Quick Actions
    {
      id: "act-new-blog",
      title: "Create New Blog Post",
      category: "Quick Actions",
      icon: RiSystemAddLine,
      keywords: ["write", "article", "draft"],
      onSelect: () => navigate("/dashboard/blogs/new"),
    },
    {
      id: "act-new-case",
      title: "Create New Case Study",
      category: "Quick Actions",
      icon: RiSystemAddLine,
      keywords: ["add project", "portfolio item"],
      onSelect: () => navigate("/dashboard/case-studies/new"),
    },
    {
      id: "act-view-site",
      title: "View Public Website",
      category: "Quick Actions",
      icon: RiSystemExternalLinkLine,
      keywords: ["live", "portfolio", "homepage"],
      onSelect: () => window.open("/", "_blank"),
    },

    // Theme & System
    {
      id: "sys-toggle-theme",
      title: "Toggle Light / Dark Mode",
      category: "Theme & System",
      icon: RiWeatherMoonLine,
      keywords: ["color", "mode", "night", "appearance"],
      onSelect: () => themeContext?.toggleTheme(),
    },
    {
      id: "sys-logout",
      title: "Sign Out of Admin",
      category: "Theme & System",
      icon: RiSystemLogoutBoxRLine,
      keywords: ["exit", "leave", "auth"],
      onSelect: handleSignOut,
    },
  ];

  // Filter commands by query
  const filteredCommands = () => {
    const q = search().trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchCategory = c.category.toLowerCase().includes(q);
      const matchKeywords = c.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchCategory || matchKeywords;
    });
  };

  // Group commands for rendering
  const groupedCommands = () => {
    const list = filteredCommands();
    const categories: ("Navigation" | "Quick Actions" | "Theme & System")[] = [
      "Navigation",
      "Quick Actions",
      "Theme & System",
    ];
    return categories
      .map((cat) => ({
        category: cat,
        items: list.filter((item) => item.category === cat),
      }))
      .filter((group) => group.items.length > 0);
  };

  // Keep selected index within bounds
  createEffect(() => {
    const list = filteredCommands();
    if (selectedIndex() >= list.length) {
      setSelectedIndex(Math.max(0, list.length - 1));
    }
  });

  // Focus input on open
  createEffect(() => {
    if (props.open) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef?.focus();
      }, 50);
    }
  });

  // Keyboard navigation within dialog
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!props.open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      props.onClose();
      return;
    }

    const list = filteredCommands();
    if (list.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + list.length) % list.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = list[selectedIndex()];
      if (selected) {
        props.onClose();
        selected.onSelect();
      }
    }
  };

  createEffect(() => {
    if (props.open) {
      window.addEventListener("keydown", handleKeyDown);
      onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
    }
  });

  return (
    <Show when={props.open}>
      <Portal>
        {/* Backdrop */}
        <div
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
          onClick={props.onClose}
        />

        {/* Dialog Window */}
        <div class="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 px-4 animate-in fade-in-0 zoom-in-95 duration-200">
          <div
            class="overflow-hidden rounded-2xl border border-dashed border-border bg-card/95 shadow-2xl backdrop-blur-2xl ring-1 ring-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div class="flex items-center gap-3 border-b border-dashed border-border px-4 py-3.5">
              <RiSystemSearchLine class="size-4.5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search()}
                onInput={(e) => {
                  setSearch(e.currentTarget.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                class="flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <Show when={search()}>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  class="rounded-md p-1 text-muted-foreground hover:bg-secondary cursor-pointer"
                >
                  <RiSystemCloseLine class="size-4" />
                </button>
              </Show>
              <kbd class="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Command Results List */}
            <div class="max-h-[340px] overflow-y-auto p-2 scroll-py-2 font-mono">
              <Show
                when={filteredCommands().length > 0}
                fallback={
                  <div class="py-10 text-center text-xs text-muted-foreground">
                    No results found for "<span class="text-foreground">{search()}</span>"
                  </div>
                }
              >
                <For each={groupedCommands()}>
                  {(group) => (
                    <div class="mb-2 last:mb-0">
                      <div class="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        {group.category}
                      </div>
                      <div class="space-y-0.5">
                        <For each={group.items}>
                          {(item) => {
                            // Find absolute index in flat filtered list
                            const itemIndex = () =>
                              filteredCommands().findIndex((c) => c.id === item.id);
                            const isSelected = () => selectedIndex() === itemIndex();

                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  props.onClose();
                                  item.onSelect();
                                }}
                                onMouseEnter={() => setSelectedIndex(itemIndex())}
                                class={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer text-left ${
                                  isSelected()
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-foreground hover:bg-secondary/70"
                                }`}
                              >
                                <div class="flex items-center gap-2.5 min-w-0">
                                  <item.icon
                                    class={`size-4 shrink-0 ${
                                      isSelected()
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                  <span class="truncate">{item.title}</span>
                                </div>

                                <div class="flex items-center gap-2 shrink-0">
                                  <Show when={item.shortcut}>
                                    <span
                                      class={`text-[10px] tracking-widest ${
                                        isSelected()
                                          ? "text-primary-foreground/80"
                                          : "text-muted-foreground/60"
                                      }`}
                                    >
                                      {item.shortcut}
                                    </span>
                                  </Show>
                                  <Show when={isSelected()}>
                                    <RiArrowsCornerDownLeftLine class="size-3.5 opacity-80" />
                                  </Show>
                                </div>
                              </button>
                            );
                          }}
                        </For>
                      </div>
                    </div>
                  )}
                </For>
              </Show>
            </div>

            {/* Dialog Footer with Keyboard hints */}
            <div class="flex items-center justify-between border-t border-dashed border-border bg-background/50 px-4 py-2 text-[10px] font-mono text-muted-foreground">
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <kbd class="flex items-center justify-center size-4 rounded border border-border bg-muted">
                    <RiArrowsArrowUpLine class="size-2.5" />
                  </kbd>
                  <kbd class="flex items-center justify-center size-4 rounded border border-border bg-muted">
                    <RiArrowsArrowDownLine class="size-2.5" />
                  </kbd>
                  <span>navigate</span>
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="flex items-center justify-center size-4 rounded border border-border bg-muted">
                    <RiArrowsCornerDownLeftLine class="size-2.5" />
                  </kbd>
                  <span>select</span>
                </span>
              </div>
              <span class="hidden sm:inline">Abious CMS Palette</span>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
