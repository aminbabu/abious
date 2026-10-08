import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";
import type { ICaseStudy } from "~/components/global/case-study";
import { cn } from "~/lib/utils";

export default function FeaturedImage(props: {
  caseStudy?: ICaseStudy;
  class?: string;
}) {
  return (
    <Section class={cn("pt-0 lg:pt-0", props.class)}>
      <DecoratorUI class="bg-secondary p-3 md:-mx-3">
        <figure class="aspect-video overflow-hidden rounded-xl grayscale-100 transition duration-500 hover:grayscale-0">
          <img
            src={props.caseStudy?.data?.banner}
            alt={props.caseStudy?.data?.title}
            width="1200"
            height="630"
            class="h-full w-full object-cover object-center"
          />
        </figure>
      </DecoratorUI>
    </Section>
  );
}
