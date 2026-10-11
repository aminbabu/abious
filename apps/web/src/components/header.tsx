import { createSignal, Show, onCleanup, createEffect } from "solid-js";
import {
  RiLogosGithubLine,
  RiLogosLinkedinLine,
  RiEditorTextWrap,
  RiSystemCloseLine,
} from "solid-icons/ri";
import CalCom from "~/components/global/calcom";
import Container from "~/components/container";
import ThemeSwitcher from "~/components/theme-switcher";
import { Button } from "~/components/ui/button";

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
    title: "Experience",
    href: "/#experience",
  },
  {
    id: 4,
    title: "Testimonials",
    href: "/#testimonials",
  },
  {
    id: 5,
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

  // Lock body scroll and handle Escape key when mobile menu is open
  createEffect(() => {
    if (typeof window === "undefined") return;
    if (sheetOpen()) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSheetOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      onCleanup(() => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      });
    } else {
      document.body.style.overflow = "";
    }
  });

  return (
    <header class="border-border bg-background/80 fixed inset-x-0 top-0 z-50 border-b border-dashed backdrop-blur-3xl transition-colors">
      <Container>
        <div class="border-border flex items-center justify-between gap-x-3 py-3 md:border-x md:border-dashed md:px-3 lg:gap-x-6">
          {/* Brand - visible on both mobile and desktop */}
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

          {/* Desktop Navigation Links */}
          <ul class="mr-auto hidden items-center gap-x-3.5 md:flex lg:gap-x-5">
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

          {/* Right Action Items (Social, Theme, Cal, Mobile Trigger) */}
          <ul class="ml-auto flex items-center gap-x-1 sm:gap-x-1.5">
            {socialItems.map((item) => (
              <li key={item.id} class="hidden md:block">
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
              <CalCom type="popup" />
            </li>
            {/* Mobile Menu Trigger button */}
            <li class="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSheetOpen(true)}
                aria-label="Open navigation menu"
                class="cursor-pointer"
              >
                <RiEditorTextWrap class="size-5 text-foreground" />
              </Button>
            </li>
          </ul>
        </div>

        {/* Mobile Slide-Up Bottom Sheet with Overlay */}
        <Show when={sheetOpen()}>
          <div class="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            {/* Backdrop Overlay */}
            <div
              class="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setSheetOpen(false)}
            />

            {/* Bottom Sheet Drawer */}
            <div class="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-4 border-t border-dashed border-border bg-background p-6 shadow-2xl transition-all duration-300 ease-out animate-in slide-in-from-bottom">
              {/* Sheet Header */}
              <div class="flex items-center justify-between pb-2 border-b border-dashed border-border/80">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close navigation menu"
                  class="size-8 rounded-full"
                >
                  <RiSystemCloseLine class="size-5" />
                </Button>
              </div>

              {/* Navigation Items */}
              <nav aria-label="Mobile Navigation Links">
                <ul class="flex flex-col gap-y-1.5 py-2">
                  {navigationItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={() => setSheetOpen(false)}
                        class="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Social Actions */}
              <div class="flex items-center justify-between pt-3 border-t border-dashed border-border/80">
                <span class="text-xs font-mono text-muted-foreground uppercase tracking-wider">Connect</span>
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
        </Show>
      </Container>
    </header>
  );
}
