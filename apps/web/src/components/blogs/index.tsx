import { createResource, createSignal, Show, createMemo } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import BlogsList from "~/components/global/blogs-list";
import Section from "~/components/section";
import Pagination from "~/components/ui/pagination";
import { api, type IBlogPostItem } from "~/lib/api";

const PAGE_SIZE = 6;

export default function BlogsGrid() {
  const [currentPage, setCurrentPage] = createSignal(1);
  const [data] = createResource<IBlogPostItem[]>(async () => {
    try {
      const list = await api.blogs.list();
      return (list || []) as IBlogPostItem[];
    } catch {
      return [];
    }
  });

  const totalItems = () => data()?.length ?? 0;
  const totalPages = createMemo(() => Math.max(1, Math.ceil(totalItems() / PAGE_SIZE)));

  const paginatedBlogs = createMemo(() => {
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
      <BlogsList
        blogs={paginatedBlogs()}
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
