import { createResource, createSignal, Show, createMemo } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import CaseStudiesList from "~/components/global/case-studies-list";
import Section from "~/components/section";
import Pagination from "~/components/ui/pagination";
import type { ICaseStudy } from "~/components/global/case-study";
import { api } from "~/lib/api";

const PAGE_SIZE = 6;

export default function CaseStudiesGrid() {
  const [currentPage, setCurrentPage] = createSignal(1);
  const [data] = createResource<ICaseStudy[]>(() => api.caseStudies.list() as Promise<ICaseStudy[]>);

  const totalItems = () => data()?.length ?? 0;
  const totalPages = createMemo(() => Math.max(1, Math.ceil(totalItems() / PAGE_SIZE)));

  const paginatedCaseStudies = createMemo(() => {
    const list = data() ?? [];
    const start = (currentPage() - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  });

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages() || newPage === currentPage()) return;
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <Section>
      <CaseStudiesList
        caseStudies={paginatedCaseStudies()}
        isLoading={data.loading}
        error={data.error}
        limit={String(PAGE_SIZE)}
      />

      <Show when={!data.loading && !data.error && totalPages() > 1}>
        <DecoratorUI class="mt-8">
          <Pagination
            currentPage={currentPage()}
            totalPages={totalPages()}
            totalItems={totalItems()}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
            showItemCount={true}
          />
        </DecoratorUI>
      </Show>
    </Section>
  );
}
