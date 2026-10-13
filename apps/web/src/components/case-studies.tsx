import { createResource, Show } from "solid-js";
import { RiArrowsArrowRightLine } from "solid-icons/ri";
import DecoratorUI from "~/components/decorator-ui";
import CaseStudiesList from "~/components/global/case-studies-list";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import type { ICaseStudy } from "~/components/global/case-study";
import { api } from "~/lib/api";

export default function CaseStudies(props: { title?: string }) {
  const [data] = createResource<ICaseStudy[]>(() => api.caseStudies.list() as Promise<ICaseStudy[]>);
  const title = () => props.title ?? "recent case studies";


  return (
    <Section id="caseStudies">
      <Paragraph class="mb-3 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        ./{title()}
      </Paragraph>
      <DecoratorUI>
        <Heading class="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Where Creativity Meets Precision
        </Heading>
      </DecoratorUI>
      <DecoratorUI class="mb-16 before:-bottom-2 before:border-t-0 lg:mb-20">
        <Paragraph class="max-w-2xl text-muted-foreground text-base sm:text-lg">
          Explore my latest projects, blending cutting-edge tech with creative
          design for exceptional user experiences and real results.
        </Paragraph>
      </DecoratorUI>
      <CaseStudiesList
        limit="9"
        caseStudies={data()}
        isLoading={data.loading}
        error={data.error}
      />
      <Show when={data()?.length}>
        <DecoratorUI class="mt-16 text-center">
          <Button href="/case-studies" size="lg" class="h-10 rounded-full px-6 text-sm font-medium">
            View All Case Studies
            <RiArrowsArrowRightLine class="ml-2 size-4" />
          </Button>
        </DecoratorUI>
      </Show>
    </Section>
  );
}
