import { createResource, createSignal, Show } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import CaseStudiesList from "~/components/global/case-studies-list";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
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
          banner: "/images/case-studies/exponential-cms.webp",
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

export default function CaseStudiesGrid() {
  const [page, setPage] = createSignal(1);
  const [data] = createResource(fetchCaseStudies);

  const paginatedCaseStudies = () => {
    const list = data() ?? [];
    return list.slice(0, page() * 12);
  };

  const hasMore = () => {
    const list = data() ?? [];
    return list.length > page() * 12;
  };

  return (
    <Section>
      <CaseStudiesList
        caseStudies={paginatedCaseStudies()}
        isLoading={data.loading}
        error={data.error}
        limit="12"
      />
      <Show when={hasMore()}>
        <DecoratorUI class="mt-16 text-center">
          <Button
            size="lg"
            class="rounded-full"
            onClick={() => setPage(p => p + 1)}
          >
            Load More
          </Button>
        </DecoratorUI>
      </Show>
    </Section>
  );
}
