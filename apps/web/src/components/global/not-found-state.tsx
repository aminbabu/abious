import { JSX, Show } from "solid-js";
import {
  RiArrowsArrowLeftLine,
  RiBuildingsHomeLine,
  RiDocumentFileWarningLine,
} from "solid-icons/ri";
import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
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
  const badge = () => props.badge ?? "./error/404";
  const code = () => props.code ?? "404";
  const title = () => props.title ?? "Resource Not Found";
  const description = () =>
    props.description ??
    "The requested page or case study could not be located or may have been moved.";

  const primaryAction = () =>
    props.primaryAction ?? {
      label: "Explore Case Studies",
      href: "/case-studies",
    };

  const secondaryAction = () =>
    props.secondaryAction ?? {
      label: "Back to Home",
      href: "/",
    };

  return (
    <Section class="pt-28 pb-20 lg:pt-36 lg:pb-28">
      {/* Eyebrow / breadcrumb-style indicator */}
      <Paragraph class="mb-4 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        {badge()}
      </Paragraph>

      {/* Main Hero Header */}
      <DecoratorUI class="after:bg-secondary pt-3 before:border-b-0 after:absolute after:-inset-x-3 after:inset-y-0 after:-z-10">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
          <span class="font-mono text-4xl font-bold tracking-tight text-primary/40 sm:text-5xl lg:text-6xl">
            {code()}
          </span>
          <Heading size="lg" class="max-w-2xl">
            {title()}
          </Heading>
        </div>
      </DecoratorUI>

      {/* Description */}
      <DecoratorUI class="after:bg-secondary before:-bottom-3 before:border-t-0 after:absolute after:-inset-3 after:-z-10">
        <Paragraph size="lg" class="max-w-2xl">
          {description()}
        </Paragraph>
      </DecoratorUI>

      {/* Interactive Card & Recovery Navigation */}
      <DecoratorUI class="mt-8">
        <div class="bg-secondary/70 -mx-3 rounded-2xl border border-dashed border-border/70 p-6 md:p-8 backdrop-blur-xs">
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div class="flex items-start gap-4">
              <div class="bg-background text-primary flex size-12 shrink-0 items-center justify-center rounded-xl border border-border shadow-xs">
                <RiDocumentFileWarningLine class="size-6" />
              </div>
              <div class="space-y-1">
                <h4 class="font-medium text-foreground text-base">
                  Looking for something specific?
                </h4>
                <p class="text-sm text-muted-foreground max-w-md">
                  Check out the full showcase of engineering case studies or return to the main overview.
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <Show when={secondaryAction()}>
                {(sec) => (
                  <Button
                    variant="outline"
                    href={sec().href}
                    class="rounded-full px-5"
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
                    class="rounded-full px-5"
                  >
                    <RiArrowsArrowLeftLine class="mr-1.5 size-4" />
                    {prim().label}
                  </Button>
                )}
              </Show>
            </div>
          </div>

          {props.children}
        </div>
      </DecoratorUI>
    </Section>
  );
}
