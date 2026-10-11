import { JSX, Show } from "solid-js";
import {
  RiArrowsArrowLeftLine,
  RiArrowsArrowRightLine,
  RiBuildingsHomeLine,
  RiBusinessWindowLine,
  RiDesignPencilLine,
  RiDevelopmentCodeSSlashLine,
  RiDevelopmentCommandLine,
  RiDocumentFileWarningLine,
} from "solid-icons/ri";
import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";

export interface NotFoundStateProps {
  badge?: string;
  code?: string;
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  children?: JSX.Element;
}

export default function NotFoundState(props: NotFoundStateProps) {
  const badge = () => props.badge ?? "./status/404";
  const code = () => props.code ?? "404";
  const title = () => props.title ?? "Page Not Found";
  const description = () =>
    props.description ??
    "The page you are looking for doesn't exist, has been moved, or the link might be broken.";

  const primaryAction = () =>
    props.primaryAction ?? {
      label: "Browse Case Studies",
      href: "/case-studies",
    };

  const secondaryAction = () =>
    props.secondaryAction ?? {
      label: "Return Home",
      href: "/",
    };

  const quickLinks = [
    {
      title: "Case Studies",
      description: "Production web applications, systems, and architectural work.",
      href: "/case-studies",
      icon: RiDevelopmentCodeSSlashLine,
      badge: "./showcase",
    },
    {
      title: "Services & Capabilities",
      description: "Frontend architecture, fullstack engineering, and performance.",
      href: "/services",
      icon: RiBusinessWindowLine,
      badge: "./offerings",
    },
    {
      title: "Experience & Career",
      description: "Work timeline, technical leadership, and past contributions.",
      href: "/experience",
      icon: RiDesignPencilLine,
      badge: "./history",
    },
  ];

  return (
    <Section class="pt-28 pb-16 lg:pt-36 lg:pb-24">
      {/* Eyebrow / breadcrumb-style indicator */}
      <Paragraph class="mb-4 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        {badge()}
      </Paragraph>

      {/* Main Hero Header with signature crosshair accents */}
      <DecoratorUI class="after:bg-secondary pt-3 before:border-b-0 after:absolute after:-inset-x-3 after:inset-y-0 after:-z-10">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-5">
          <span class="inline-flex items-baseline font-mono text-4xl font-extrabold tracking-tight text-primary/30 sm:text-6xl lg:text-7xl select-none">
            {code()}
          </span>
          <Heading size="lg" class="max-w-2xl text-balance">
            {title()}
          </Heading>
        </div>
      </DecoratorUI>

      {/* Description */}
      <DecoratorUI class="after:bg-secondary before:-bottom-3 before:border-t-0 after:absolute after:-inset-3 after:-z-10">
        <Paragraph size="lg" class="max-w-2xl text-muted-foreground leading-relaxed">
          {description()}
        </Paragraph>
      </DecoratorUI>

      {/* Diagnostic Terminal Status Bar */}
      <DecoratorUI class="my-6 before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed py-2">
        <div class="border-border/80 bg-background/90 text-foreground flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed px-4 py-3 font-mono text-xs shadow-xs backdrop-blur-xs">
          <div class="flex items-center gap-2">
            <span class="relative flex size-2">
              <span class="bg-amber-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span class="bg-amber-500 relative inline-flex size-2 rounded-full" />
            </span>
            <span class="font-semibold text-primary/80">ERR_RESOURCE_NOT_FOUND</span>
            <span class="text-muted-foreground hidden sm:inline">•</span>
            <span class="text-muted-foreground hidden sm:inline">status: 404 (Not Found)</span>
          </div>
          <div class="text-muted-foreground/80 flex items-center gap-2">
            <RiDevelopmentCommandLine class="size-3.5" />
            <span>action: route_recovery</span>
          </div>
        </div>
      </DecoratorUI>

      {/* Primary Recovery Callout */}
      <DecoratorUI class="mt-6 mb-10">
        <div class="bg-secondary/60 relative rounded-2xl border border-dashed border-border/80 p-6 md:p-8 backdrop-blur-xs">
          {/* Subtle decorative crosshair corner markers */}
          <span class="text-muted-foreground/40 font-mono text-[10px] absolute top-2 left-2 select-none">+</span>
          <span class="text-muted-foreground/40 font-mono text-[10px] absolute top-2 right-2 select-none">+</span>
          <span class="text-muted-foreground/40 font-mono text-[10px] absolute bottom-2 left-2 select-none">+</span>
          <span class="text-muted-foreground/40 font-mono text-[10px] absolute bottom-2 right-2 select-none">+</span>

          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div class="flex items-start gap-4">
              <div class="bg-background text-primary flex size-12 shrink-0 items-center justify-center rounded-xl border border-border shadow-xs">
                <RiDocumentFileWarningLine class="size-6 text-primary/90" />
              </div>
              <div class="space-y-1">
                <h4 class="font-semibold text-foreground text-base sm:text-lg">
                  Looking for something specific?
                </h4>
                <p class="text-sm text-muted-foreground max-w-lg leading-relaxed">
                  The URL requested is unavailable. You can return directly to the homepage or explore engineering case studies and technical consulting services.
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 shrink-0">
              <Show when={secondaryAction()}>
                {(sec) => (
                  <Button
                    variant="outline"
                    href={sec().href}
                    class="rounded-full px-5 h-10 font-medium"
                  >
                    <RiBuildingsHomeLine class="mr-1.5 size-4" />
                    {sec().label}
                  </Button>
                )}
              </Show>

              <Show when={primaryAction()}>
                {(prim) => (
                  <Button
                    href={prim().href}
                    class="rounded-full px-5 h-10 font-medium"
                  >
                    {prim().label}
                    <RiArrowsArrowRightLine class="ml-1.5 size-4" />
                  </Button>
                )}
              </Show>
            </div>
          </div>

          {props.children}
        </div>
      </DecoratorUI>

      {/* Suggested Destinations Grid */}
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-dashed border-border/70 pb-2">
          <span class="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Suggested Destinations
          </span>
          <span class="font-mono text-xs text-muted-foreground/70">
            [03 destinations]
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((item) => (
            <a
              href={item.href}
              class="group bg-card hover:bg-secondary/40 relative flex flex-col justify-between rounded-xl border border-border/80 p-5 transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-9 items-center justify-center rounded-lg border border-border/60 transition-colors">
                    <item.icon class="size-4.5" />
                  </div>
                  <span class="font-mono text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.badge}
                  </span>
                </div>
                <h5 class="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                  {item.title}
                </h5>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div class="mt-4 flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                <span>Navigate</span>
                <RiArrowsArrowRightLine class="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
