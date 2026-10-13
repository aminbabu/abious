import { For, Show } from "solid-js";
import {
  RiArrowsArrowLeftSLine,
  RiArrowsArrowRightSLine,
} from "solid-icons/ri";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  class?: string;
  showItemCount?: boolean;
}

export function Pagination(props: PaginationProps) {
  // Generate pages to show with ellipsis for large page counts
  const pageNumbers = () => {
    const current = props.currentPage;
    const total = props.totalPages;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    // Always include page 1
    pages.push(1);

    if (current > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push("ellipsis");
    }

    // Always include last page
    pages.push(total);

    return pages;
  };

  const showingStart = () => {
    if (!props.totalItems || props.totalItems === 0) return 0;
    const size = props.pageSize ?? 6;
    return (props.currentPage - 1) * size + 1;
  };

  const showingEnd = () => {
    if (!props.totalItems) return 0;
    const size = props.pageSize ?? 6;
    return Math.min(props.currentPage * size, props.totalItems);
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      class={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-6",
        props.class,
      )}
    >
      <Show when={props.showItemCount && props.totalItems !== undefined}>
        <div class="text-xs text-muted-foreground font-mono">
          Showing <span class="font-semibold text-foreground">{showingStart()}</span>–
          <span class="font-semibold text-foreground">{showingEnd()}</span> of{" "}
          <span class="font-semibold text-foreground">{props.totalItems}</span> items
        </div>
      </Show>

      <div class="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={props.currentPage <= 1}
          onClick={() => props.onPageChange(props.currentPage - 1)}
          aria-label="Previous Page"
          class="rounded-full px-3 gap-1 text-xs"
        >
          <RiArrowsArrowLeftSLine class="size-4" />
          <span class="hidden sm:inline">Prev</span>
        </Button>

        <div class="flex items-center gap-1">
          <For each={pageNumbers()}>
            {(pageItem) => (
              <Show
                when={pageItem !== "ellipsis"}
                fallback={
                  <span class="px-2 py-1 text-xs text-muted-foreground select-none">
                    …
                  </span>
                }
              >
                <Button
                  variant={pageItem === props.currentPage ? "default" : "outline"}
                  size="sm"
                  aria-current={pageItem === props.currentPage ? "page" : undefined}
                  onClick={() => props.onPageChange(pageItem as number)}
                  class={cn(
                    "min-w-8 h-8 rounded-full text-xs px-2.5",
                    pageItem === props.currentPage && "pointer-events-none shadow-xs font-semibold",
                  )}
                >
                  {pageItem}
                </Button>
              </Show>
            )}
          </For>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={props.currentPage >= props.totalPages}
          onClick={() => props.onPageChange(props.currentPage + 1)}
          aria-label="Next Page"
          class="rounded-full px-3 gap-1 text-xs"
        >
          <span class="hidden sm:inline">Next</span>
          <RiArrowsArrowRightSLine class="size-4" />
        </Button>
      </div>
    </nav>
  );
}

export default Pagination;
