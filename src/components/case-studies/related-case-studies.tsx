import "@splidejs/react-splide/css";

import DecoratorUI from "@/components/decorator-ui";
import CaseStudy from "@/components/global/case-study";
import Section from "@/components/layouts/section";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";
import CaseStudiesLoader from "@/components/ui/loaders/case-studies";
import type { ICaseStudy } from "@/interfaces/case-study";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import axios from "axios";
import useSWR from "swr";

const RelatedCaseStudies = ({ id, type }: { id: string; type: string }) => {
  const {
    data: caseStudies,
    error,
    isLoading,
  } = useSWR(`/api/case-studies/${id}/${type}/index.json`, axios.get);

  let content = null;

  if (isLoading) {
    content = (
      <DecoratorUI className="-mt-5">
        <div className="bg-secondary -mx-3 p-3">
          <CaseStudiesLoader />
        </div>
      </DecoratorUI>
    );
  }

  if (!isLoading && error) {
    content = (
      <DecoratorUI className="-mt-5">
        <div className="bg-secondary -mx-3 p-3">{error.message}</div>
      </DecoratorUI>
    );
  }

  if (!isLoading && !error && !caseStudies?.length) {
    content = (
      <DecoratorUI className="-mt-5">
        <div className="bg-secondary -mx-3 p-3">
          <p className="text-muted-foreground">
            No related case studies found.
          </p>
        </div>
      </DecoratorUI>
    );
  }

  if (!isLoading && !error && caseStudies?.length) {
    content = (
      <Splide
        hasTrack={false}
        options={{
          type: "slide",
          perPage: 1,
          gap: "0.75rem",
          arrows: false,
          pagination: true,
          mediaQuery: "min",
          breakpoints: {
            768: {
              perPage: 2,
            },
            1024: {
              perPage: 3,
            },
          },
        }}
        aria-label="Related Case Studies"
        className="-mt-5"
      >
        <DecoratorUI className="before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed py-px">
          <div className="-mx-3 bg-secondary px-3">
            <SplideTrack>
              {caseStudies?.map((caseStudy: ICaseStudy) => (
                <SplideSlide key={caseStudy?.id} className="py-3">
                  <CaseStudy caseStudy={caseStudy} />
                </SplideSlide>
              ))}
            </SplideTrack>
          </div>
        </DecoratorUI>
        {caseStudies?.length > 3 && (
          <DecoratorUI>
            <ul className="splide__pagination"></ul>
          </DecoratorUI>
        )}
      </Splide>
    );
  }

  return (
    <Section>
      <Paragraph className="mb-3 font-mono font-medium md:text-right">
        ./related projects
      </Paragraph>
      <DecoratorUI className="mb-16 lg:mb-20">
        <Heading className="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Discover More Groundbreaking Projects
        </Heading>
      </DecoratorUI>
      {content}
    </Section>
  );
};

export default RelatedCaseStudies;
