import DecoratorUI from "@/components/decorator-ui";
import Section from "@/components/layouts/section";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const PageHero = ({
  title,
  description,
  children,
  className,
}: {
  title: string | undefined;
  description?: string;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <Section className={cn("pt-28 lg:pt-28", className)}>
      <DecoratorUI className="after:bg-secondary pt-3 before:border-b-0 after:absolute after:-inset-x-3 after:inset-y-0 after:-z-10">
        <Heading asChild size="lg">
          <h1 className="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            {title}
          </h1>
        </Heading>
      </DecoratorUI>
      {description && (
        <DecoratorUI className="after:bg-secondary before:-bottom-3 before:border-t-0 after:absolute after:-inset-3 after:-z-10">
          <Paragraph size="lg" className="max-w-3xl">
            {description}
          </Paragraph>
        </DecoratorUI>
      )}
      {children}
    </Section>
  );
};

export default PageHero;
