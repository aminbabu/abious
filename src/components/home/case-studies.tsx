import DecoratorUI from "@/components/decorator-ui";
import CaseStudiesList from "@/components/global/case-studies-list";
import Section from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";
import axios from "axios";
import useSWR from "swr";

const CaseStudies = ({
  title = "recent case studies",
}: {
  title?: string | undefined;
}) => {
  const { data, error, isLoading } = useSWR(
    "/api/case-studies/index.json",
    axios.get
  );

  return (
    <Section id="caseStudies">
      <Paragraph className="mb-3 font-mono font-medium md:text-right">
        ./{title}
      </Paragraph>
      <DecoratorUI>
        <Heading className="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Where Creativity Meets Precision
        </Heading>
      </DecoratorUI>
      <DecoratorUI className="mb-16 before:-bottom-2 before:border-t-0 lg:mb-20">
        <Paragraph className="max-w-2xl">
          Explore my latest projects, blending cutting-edge tech with creative
          design for exceptional user experiences and real results.
        </Paragraph>
      </DecoratorUI>
      <CaseStudiesList
        limit="6"
        caseStudies={data?.data}
        isLoading={isLoading}
        error={error}
      />
      {data?.data?.length ? (
        <DecoratorUI className="mt-16 text-center">
          <Button asChild size="lg" className="rounded-full">
            <a href="/case-studies">View All Case Studies</a>
          </Button>
        </DecoratorUI>
      ) : null}
    </Section>
  );
};

export default CaseStudies;
