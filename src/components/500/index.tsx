import DecoratorUI from "@/components/decorator-ui";
import Section from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";

const InternalServerError = () => {
  return (
    <Section>
      <Paragraph className="mb-3 font-mono font-medium md:text-right">
        ./internal server error
      </Paragraph>
      <DecoratorUI>
        <Heading className="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Whoops! Something broke on our end.
        </Heading>
      </DecoratorUI>
      <DecoratorUI className="mb-16 before:-bottom-2 before:border-t-0 lg:mb-20">
        <Paragraph className="max-w-2xl">
          The server encountered an unexpected hiccup. We're already on it—our
          devs have been notified (or are probably debugging furiously). Try
          again in a bit, or head back to safety.
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

export default InternalServerError;
