import DecoratorUI from "@/components/decorator-ui";
import Section from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";

const NotFound = () => {
  return (
    <Section>
      <Paragraph className="mb-3 font-mono font-medium md:text-right">
        ./page does not exist
      </Paragraph>
      <DecoratorUI>
        <Heading className="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Well, this is awkward... The page ghosted us!
        </Heading>
      </DecoratorUI>
      <DecoratorUI className="mb-16 before:-bottom-2 before:border-t-0 lg:mb-20">
        <Paragraph className="max-w-2xl">
          Looks like the page you&apos;re looking for doesn&apos;t exist or has
          been moved. Try heading back home or double-checking the URL.
          Don&apos;t worry—we&apos;ve got plenty more to explore!
        </Paragraph>
      </DecoratorUI>
      <DecoratorUI className="mt-16">
        <Button asChild size="lg" className="rounded-full">
          <a href="/">Back to Home</a>
        </Button>
      </DecoratorUI>
    </Section>
  );
};

export default NotFound;
