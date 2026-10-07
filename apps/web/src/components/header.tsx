import { createSignal, Show } from "solid-js";
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

  return (
    <header class="border-border bg-background/10 fixed inset-x-0 top-0 z-50 border-b border-dashed backdrop-blur-3xl">
      <Container class="container">
        <div class="md:border-x-border flex items-center justify-between gap-x-4 py-3 md:border-x md:border-dashed md:px-4 lg:gap-x-6">
          {/* Brand */}
          <a
            href="/"
            class="text-primary group relative hidden px-1.5 font-mono text-sm font-medium md:block"
          >
            <span class="border-primary/60 group-hover:bg-border absolute inset-0 -z-10 border border-dashed bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed transition-colors duration-300"></span>
            ./ab
            <svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              class="fill-primary absolute -left-0.5 -top-0.5"
            >
              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
            </svg>
            <svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              class="fill-primary absolute -right-0.5 -top-0.5"
            >
              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
            </svg>
            <svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              class="fill-primary absolute -bottom-0.5 -left-0.5"
            >
              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
            </svg>
            <svg
              width="5"
              height="5"
              viewBox="0 0 5 5"
              class="fill-primary absolute -bottom-0.5 -right-0.5"
            >
              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
            </svg>
          </a>

          {/* Navigation Links */}
          <ul class="mr-auto hidden items-center gap-x-3.5 md:flex lg:gap-x-5">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  class="hover:text-foreground/75 text-sm transition-colors duration-300"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Sheet Trigger */}
          <button
            onClick={() => setSheetOpen(!sheetOpen())}
            class="cursor-pointer md:hidden text-foreground p-1"
            aria-label="Open menu"
          >
            <RiEditorTextWrap class="text-xl" />
          </button>

          {/* Desktop Right Items */}
          <ul class="ml-auto flex items-center gap-x-1">
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
          </ul>
        </div>

        {/* Mobile Bottom Sheet */}
        <Show when={sheetOpen()}>
          <div class="fixed inset-x-0 bottom-0 top-auto z-50 border-t border-dashed border-border bg-background p-6 shadow-lg md:hidden">
            <div class="flex items-center justify-between pb-4">
              <a
                href="/"
                class="text-primary group relative px-1.5 font-mono text-sm self-start font-medium"
              >
                <span class="border-primary/60 group-hover:bg-border absolute inset-0 -z-10 border border-dashed bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed transition-colors duration-300"></span>
                ./ab
              </a>
              <button
                onClick={() => setSheetOpen(false)}
                class="text-muted-foreground hover:text-foreground"
                aria-label="Close menu"
              >
                <RiSystemCloseLine class="text-2xl" />
              </button>
            </div>
            <ul class="flex flex-col gap-y-3 py-4">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={() => setSheetOpen(false)}
                    class="hover:text-foreground/75 text-sm transition-colors duration-300"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
            <div class="flex items-center gap-x-3 pt-4 border-t border-dashed border-border">
              {socialItems.map((item) => (
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
              ))}
            </div>
          </div>
        </Show>
      </Container>
    </header>
  );
}
