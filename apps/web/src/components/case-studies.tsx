import { createResource, Show } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import CaseStudiesList from "~/components/global/case-studies-list";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import type { ICaseStudy } from "~/components/global/case-study";

async function fetchCaseStudies(): Promise<ICaseStudy[]> {
  try {
    const res = await fetch("https://api.abious.ddev.site/api/case-studies");
    if (!res.ok) throw new Error("Failed to fetch case studies");
    return await res.json();
  } catch (e) {
    return [
      {
        id: "exponential-cms",
        data: {
          title: "Exponential CMS",
          description: "Headless Content Management System designed for speed and flexibility.",
          banner: "/images/case-studies/exponential-cms.png",
          liveURL: "https://exponential-cms.aminbabu.com",
        },
      },
      {
        id: "seven-rings-cement",
        data: {
          title: "Seven Rings Cement",
          description: "High-performance marketing platform built for an enterprise cement manufacturer.",
          banner: "/images/case-studies/seven-rings-cement.png",
        },
      },
      {
        id: "universalyst",
        data: {
          title: "Universalyst",
          description: "A platform empowering artists to showcase, buy, sell, and advertise artwork.",
          banner: "/images/case-studies/universalyst.png",
        },
      },
    ];
  }
}

export default function CaseStudies(props: { title?: string }) {
  const [data] = createResource(fetchCaseStudies);
  const title = () => props.title ?? "recent case studies";

  return (
    <Section id="caseStudies">
      <Paragraph class="mb-3 font-mono font-medium md:text-right">
        ./{title()}
      </Paragraph>
      <DecoratorUI>
        <Heading class="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Where Creativity Meets Precision
        </Heading>
      </DecoratorUI>
      <DecoratorUI class="mb-16 before:-bottom-2 before:border-t-0 lg:mb-20">
        <Paragraph class="max-w-2xl">
          Explore my latest projects, blending cutting-edge tech with creative
          design for exceptional user experiences and real results.
        </Paragraph>
      </DecoratorUI>
      <CaseStudiesList
        limit="6"
        caseStudies={data()}
        isLoading={data.loading}
        error={data.error}
      />
      <Show when={data()?.length}>
        <DecoratorUI class="mt-16 text-center">
          <Button asChild size="lg" class="rounded-full">
            <a href="/case-studies">View All Case Studies</a>
          </Button>
        </DecoratorUI>
      </Show>
    </Section>
  );
}
