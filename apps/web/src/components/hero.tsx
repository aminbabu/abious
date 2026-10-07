import { RiDocumentFilePdfLine } from "solid-icons/ri";
import DecoratorUI from "~/components/decorator-ui";
import CalCom from "~/components/global/calcom";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import skillPaths from "./hero-icons.json";

export default function Hero() {
  return (
    <Section class="pt-20 lg:pt-20">
      <Paragraph class="mb-3 font-mono font-medium md:text-right">
        ./aminbabu
      </Paragraph>
      <DecoratorUI>
        <Heading size="lg" class="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          Transforming Ideas into Powerful Digital Solutions
        </Heading>
      </DecoratorUI>
      <DecoratorUI class="mb-16 before:-bottom-3 before:border-t-0 lg:mb-20">
        <Paragraph size="lg" class="max-w-3xl">
          Expert in crafting responsive web and mobile applications using
          JavaScript, Next.js, NestJS, MERN stack, PHP, Laravel, WordPress,
          Webflow, and more — delivering seamless and high-performance user
          experiences across platforms.
        </Paragraph>
      </DecoratorUI>
      <DecoratorUI class="mb-16 flex items-center gap-3 lg:mb-20">
        <CalCom
          title="Discuss Your Project"
          size="lg"
          type="popup"
          class="h-10 px-6 font-medium"
        />
        <Button
          size="lg"
          variant="outline"
          href="/resume/Resume - Amin Babu.pdf"
          target="_blank"
          class="h-10 cursor-pointer rounded-full px-6 font-medium"
        >
          <RiDocumentFilePdfLine class="mr-2 size-4" />
          Resume
        </Button>
      </DecoratorUI>
      <DecoratorUI class="bg-background pointer-events-none -rotate-3 before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed md:-mx-5">
        <div class="flex -translate-x-full items-center animate-marquee">
          {[
            ...skillPaths,
            ...skillPaths,
            ...skillPaths,
          ].map((path) => (
            <div class="inline-flex items-center justify-center p-6 md:p-7 lg:p-8">
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                class="size-10 lg:size-12"
              >
                <path d={path} />
              </svg>
            </div>
          ))}
        </div>
      </DecoratorUI>
    </Section>
  );
}
