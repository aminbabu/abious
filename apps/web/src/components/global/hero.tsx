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
  class?: string;
}) {
  return (
    <Section class={cn("pt-28 lg:pt-32", props.class)}>
      <DecoratorUI class="after:bg-secondary pt-3 before:border-b-0 after:absolute after:-inset-x-3 after:inset-y-0 after:-z-10">
        <Heading size="lg" class="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
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
