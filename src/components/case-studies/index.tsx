import DecoratorUI from "@/components/decorator-ui";
import CaseStudiesList from "@/components/global/case-studies-list";
import Section from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import type { ICaseStudy } from "@/interfaces/case-study";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";

const CaseStudies = () => {
  const [page, setPage] = useState(1);
  const [caseStudies, setCaseStudies] = useState<ICaseStudy[]>([]);
  const { data, error, isLoading } = useSWR(
    "/api/case-studies/index.json",
    axios.get
  );

  useEffect(() => {
    if (!data?.data?.length) return;

    setCaseStudies(data.data);
  }, [data]);

  const paginatedCaseStudies = caseStudies?.slice(0, page * 12);

  return (
    <Section>
      <CaseStudiesList
        caseStudies={paginatedCaseStudies}
        isLoading={isLoading}
        error={error}
        limit="12"
      />
      {data?.length > 12 && (
        <DecoratorUI className="mt-16 text-center">
          <Button
            size="lg"
            className="rounded-full"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </Button>
        </DecoratorUI>
      )}
    </Section>
  );
};

export default CaseStudies;
