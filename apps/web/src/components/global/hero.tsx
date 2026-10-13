import { A } from "@solidjs/router";
import { RiArrowsArrowLeftLine } from "solid-icons/ri";
import { JSX } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import { cn } from "~/lib/utils";

export default function PageHero(props: {
  title?: string;
  description?: string;
  children?: JSX.Element;
  backLink?: { href: string; label: string };
  class?: string;
}) {
  return (
    <Section class={cn("pt-24 lg:pt-28", props.class)}>
      {props.backLink && (
        <div class="mb-3 flex items-center justify-between">
          {props.backLink ? (
            <A
              href={props.backLink.href}
              class="group inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <RiArrowsArrowLeftLine class="size-3.5 transition-transform group-hover:-translate-x-1" />
              <span>{props.backLink.label}</span>
            </A>
          ) : (
            <span />
          )}
        </div>
      )}
      <DecoratorUI class="after:bg-secondary pt-3 before:border-b-0 after:absolute after:-inset-x-3 after:inset-y-0 after:-z-10">
        <Heading
          size="lg"
          class="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
        >
          {props.title}
        </Heading>
      </DecoratorUI>
      {props.description && (
        <DecoratorUI class="after:bg-secondary before:-bottom-3 before:border-t-0 after:absolute after:-inset-3 after:-z-10">
          <Paragraph size="lg" class="max-w-3xl">
            {props.description}
          </Paragraph>
        </DecoratorUI>
      )}
      {props.children}
    </Section>
  );
}
