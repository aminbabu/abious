import { createSignal, Show, onCleanup, createEffect, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import {
  RiLogosGithubLine,
  RiLogosLinkedinLine,
  RiEditorTextWrap,
  RiUserFacesUserLine,
  RiSystemDashboardLine,
  RiSystemLoginBoxLine,
  RiSystemLogoutBoxRLine,
  RiArrowsArrowDownSLine,
  RiSystemShieldCheckLine,
  RiSystemSettings3Line,
  RiDesignEditLine,
} from "solid-icons/ri";
import CalCom from "~/components/global/calcom";
import Container from "~/components/container";
import ThemeSwitcher from "~/components/theme-switcher";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

const navigationItems = [
  {
    id: 1,
    title: "Services",
    href: "/#services",
  },
  {
    id: 2,
    title: "Case Studies",
    href: "/#caseStudies",
  },
  {
    id: 3,
    title: "Blogs",
    href: "/blogs",
  },
  {
    id: 4,
    title: "Experiences",
    href: "/#experience",
  },
  {
    id: 5,
    title: "Testimonials",
    href: "/#testimonials",
  },
  {
    id: 6,
    title: "Contact",
    href: "/#contact",
  },
];

const socialItems = [
  {
    id: 1,
    title: "Github",
    href: "https://github.com/aminbabu",
    icon: RiLogosGithubLine,
  },
  {
    id: 2,
    title: "Linkedin",
    href: "https://www.linkedin.com/in/aminbabu",
    icon: RiLogosLinkedinLine,
  },
];

export default function Header() {
  const [sheetOpen, setSheetOpen] = createSignal(false);
  const [userMenuOpen, setUserMenuOpen] = createSignal(false);
  const [user, setUser] = createSignal<{ name?: string; email?: string } | null>(null);
  const [authChecked, setAuthChecked] = createSignal(false);

  const userInitials = () => {
    const u = user();
    if (!u) return "?";
    if (u.name) return u.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    if (u.email) return u.email[0].toUpperCase();
    return "A";
  };

  onMount(async () => {
    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setUser(session.data.user);
      }
    } catch {
      // User is a guest
    } finally {
      setAuthChecked(true);
    }
  });

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  // Lock body scroll and handle Escape key when mobile menu is open
  createEffect(() => {
    if (typeof window === "undefined") return;
    if (sheetOpen()) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSheetOpen(false);
      };
      const handleResize = () => {
        // Auto close when resized to desktop (>= 1024px)
        if (window.innerWidth >= 1024) {
          setSheetOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", handleResize);

      onCleanup(() => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", handleResize);
      });
    }
  });

  return (
    <header class="border-border bg-background/80 fixed inset-x-0 top-0 z-50 border-b border-dashed backdrop-blur-3xl transition-colors">
      <Container>
        <div class="border-border flex items-center justify-between gap-x-2 sm:gap-x-4 py-3 md:border-x md:border-dashed md:px-3 lg:gap-x-6">
          {/* Brand Logo - visible across all screens */}
          <a
            href="/"
            class="text-primary group relative px-1.5 font-mono text-sm font-medium inline-block select-none shrink-0"
            aria-label="Amin Babu Home"
          >
            <span class="border-primary/60 group-hover:bg-border absolute inset-0 -z-10 border border-dashed bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed transition-colors duration-300"></span>
            ./ab
            <svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              class="fill-primary absolute -left-0.5 -top-0.5 pointer-events-none"
            >
              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
            </svg>
            <svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              class="fill-primary absolute -right-0.5 -top-0.5 pointer-events-none"
            >
              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
            </svg>
            <svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              class="fill-primary absolute -bottom-0.5 -left-0.5 pointer-events-none"
            >
              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
            </svg>
            <svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              class="fill-primary absolute -bottom-0.5 -right-0.5 pointer-events-none"
            >
              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
            </svg>
          </a>

          {/* Desktop Navigation Links - hidden under 1024px (< lg) */}
          <ul class="mr-auto hidden items-center gap-x-4 lg:flex xl:gap-x-6">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Action Items */}
          <ul class="ml-auto flex items-center gap-x-1 sm:gap-x-1.5">
            {socialItems.map((item) => (
              <li key={item.id} class="hidden lg:block">
                <Button
                  variant="ghost"
                  size="icon"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.title}
                >
                  <item.icon class="size-5" />
                </Button>
              </li>
            ))}
            <li>
              <ThemeSwitcher />
            </li>
            <li>
              <CalCom
                type="popup"
                class="hidden sm:inline-flex"
              />
            </li>

            {/* Auth Action Controls (Desktop & Tablet) */}
            <Show when={authChecked()}>
              <Show
                when={user()}
                fallback={
                  <li class="hidden sm:block">
                    <Button
                      variant="outline"
                      size="sm"
                      href="/auth/login"
                      class="rounded-full text-xs font-mono font-medium h-9 px-3 gap-1.5 cursor-pointer border-dashed hover:border-primary/60"
                    >
                      <RiSystemLoginBoxLine class="size-3.5" />
                      <span>Admin</span>
                    </Button>
                  </li>
                }
              >
                {(u) => (
                  <li class="relative hidden sm:block">
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen())}
                      class="flex items-center gap-2 rounded-full border border-dashed border-border bg-card/80 hover:bg-secondary/60 hover:border-primary/60 px-2 py-1 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
                      aria-expanded={userMenuOpen()}
                      aria-haspopup="true"
                    >
                      <div class="size-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-mono font-bold text-primary shrink-0 ring-1 ring-primary/30">
                        {userInitials()}
                      </div>
                      <span class="max-w-[100px] truncate text-xs font-mono font-medium text-foreground">
                        {u().name || "Account"}
                      </span>
                      <RiArrowsArrowDownSLine
                        class={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                          userMenuOpen() ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <Show when={userMenuOpen()}>
                      <div
                        class="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div class="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-dashed border-border bg-card/95 p-2 shadow-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
                        {/* User Identity Header */}
                        <div class="border-b border-dashed border-border/70 px-2.5 pb-2.5 pt-1">
                          <p class="text-xs font-mono font-semibold text-foreground truncate">
                            {u().name || "Admin"}
                          </p>
                          <p class="text-[11px] font-mono text-muted-foreground truncate">
                            {u().email || ""}
                          </p>
                          <div class="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary font-mono text-[10px] font-medium">
                            <RiSystemShieldCheckLine class="size-3" />
                            <span>Authenticated Admin</span>
                          </div>
                        </div>

                        {/* Navigation Links */}
                        <div class="py-1.5 space-y-0.5 font-mono text-xs">
                          <a
                            href="/dashboard/overview"
                            onClick={() => setUserMenuOpen(false)}
                            class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-foreground hover:bg-secondary hover:text-primary transition-colors"
                          >
                            <RiSystemDashboardLine class="size-3.5 text-primary" />
                            <span>Dashboard Overview</span>
                          </a>
                          <a
                            href="/dashboard/blogs"
                            onClick={() => setUserMenuOpen(false)}
                            class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <RiDesignEditLine class="size-3.5" />
                            <span>Manage Content</span>
                          </a>
                          <a
                            href="/dashboard/settings"
                            onClick={() => setUserMenuOpen(false)}
                            class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <RiSystemSettings3Line class="size-3.5" />
                            <span>CMS Settings</span>
                          </a>
                        </div>

                        {/* Sign Out Action */}
                        <div class="border-t border-dashed border-border/70 pt-1 font-mono text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              handleSignOut();
                            }}
                            class="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left"
                          >
                            <RiSystemLogoutBoxRLine class="size-3.5 shrink-0" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </Show>
                  </li>
                )}
              </Show>
            </Show>

            {/* Mobile Menu Trigger button - visible under 1024px (< lg) */}
            <li class="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSheetOpen(true)}
                aria-label="Open navigation menu"
                class="cursor-pointer size-9"
              >
                <RiEditorTextWrap class="size-5 text-foreground" />
              </Button>
            </li>
          </ul>
        </div>
      </Container>

      {/* Mobile Slide-Up Bottom Drawer rendered into Portal at body level */}
      <Show when={sheetOpen()}>
        <Portal>
          <div class="fixed inset-0 z-100 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation Drawer">
            {/* Backdrop Overlay */}
            <div
              class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setSheetOpen(false)}
            />

            {/* Bottom Sheet Drawer - styled like shadcn drawer */}
            <div class="fixed inset-x-0 bottom-0 z-101 flex max-h-[85vh] flex-col rounded-t-2xl border-t border-dashed border-border bg-background p-6 shadow-2xl transition-all duration-300 ease-out animate-in slide-in-from-bottom">
              {/* Drawer Drag Handle Pill */}
              <div class="mx-auto -mt-2 mb-4 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/30 cursor-pointer" onClick={() => setSheetOpen(false)} />

              {/* Drawer Header */}
              <div class="flex items-center justify-between pb-3 border-b border-dashed border-border/80">
                <div class="flex flex-col gap-0.5">
                  <a
                    href="/"
                    onClick={() => setSheetOpen(false)}
                    class="text-primary group relative px-1.5 font-mono text-sm self-start font-medium inline-block select-none"
                    aria-label="Amin Babu Home"
                  >
                    <span class="border-primary/60 group-hover:bg-border absolute inset-0 -z-10 border border-dashed bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed transition-colors duration-300"></span>
                    ./ab
                    <svg width="5" height="5" viewBox="0 0 5 5" class="fill-primary absolute -left-0.5 -top-0.5 pointer-events-none">
                      <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                    </svg>
                    <svg width="5" height="5" viewBox="0 0 5 5" class="fill-primary absolute -right-0.5 -top-0.5 pointer-events-none">
                      <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                    </svg>
                    <svg width="5" height="5" viewBox="0 0 5 5" class="fill-primary absolute -bottom-0.5 -left-0.5 pointer-events-none">
                      <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                    </svg>
                    <svg width="5" height="5" viewBox="0 0 5 5" class="fill-primary absolute -bottom-0.5 -right-0.5 pointer-events-none">
                      <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                    </svg>
                  </a>
                  <span class="text-xs text-muted-foreground">Navigation & Connect</span>
                </div>
                {/* Standard close button */}
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close navigation menu"
                  class="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" class="size-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav aria-label="Mobile Navigation Links" class="overflow-y-auto py-2">
                <ul class="flex flex-col gap-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        class="flex items-center rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-secondary transition-colors"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Mobile Auth Management Card */}
                <div class="mt-3 p-3 rounded-xl border border-dashed border-border bg-secondary/40">
                  <Show
                    when={user()}
                    fallback={
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <RiUserFacesUserLine class="size-4 text-muted-foreground" />
                          <span class="text-xs font-mono text-muted-foreground">Portal Access</span>
                        </div>
                        <a
                          href="/auth/login"
                          onClick={() => setSheetOpen(false)}
                          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-primary/50 text-xs font-mono font-medium text-primary hover:bg-primary/10 transition-colors"
                        >
                          <RiSystemLoginBoxLine class="size-3.5" />
                          <span>Admin Login</span>
                        </a>
                      </div>
                    }
                  >
                    {(u) => (
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-[11px] font-mono text-muted-foreground uppercase">Logged in as</span>
                          <span class="text-xs font-mono font-medium text-primary truncate max-w-[150px]">
                            {u().email || u().name}
                          </span>
                        </div>
                        <div class="flex items-center gap-2 pt-1">
                          <a
                            href="/dashboard/overview"
                            onClick={() => setSheetOpen(false)}
                            class="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-medium shadow-xs"
                          >
                            <RiSystemDashboardLine class="size-3.5" />
                            <span>Dashboard</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setSheetOpen(false);
                              handleSignOut();
                            }}
                            class="px-2.5 py-1.5 rounded-lg border border-dashed border-destructive/50 text-destructive font-mono text-xs hover:bg-destructive/10 transition-colors cursor-pointer"
                          >
                            <RiSystemLogoutBoxRLine class="size-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Show>
                </div>
              </nav>

              {/* Drawer Footer with Book a Call and Socials on Mobile */}
              <div class="flex flex-col gap-3 pt-3 border-t border-dashed border-border/80">
                <div class="sm:hidden">
                  <CalCom
                    type="popup"
                    class="w-full justify-center"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono text-muted-foreground uppercase tracking-wider">Socials</span>
                  <div class="flex items-center gap-x-2">
                    {socialItems.map((item) => (
                      <Button
                        variant="outline"
                        size="icon"
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.title}
                        class="size-8 rounded-full"
                      >
                        <item.icon class="size-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </header>
  );
}
