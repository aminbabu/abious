import { createSignal, createMemo, For, Show, JSX } from "solid-js";
import {
  RiArrowsArrowUpLine,
  RiArrowsArrowDownLine,
  RiArrowsExpandUpDownLine,
  RiArrowsArrowLeftLine,
  RiArrowsArrowRightLine,
  RiSystemSearchLine,
} from "solid-icons/ri";

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessorFn?: (row: T) => string | number;
  cell?: (row: T) => JSX.Element;
  sortable?: boolean;
  headerClass?: string;
  cellClass?: string;
  skipFilter?: boolean;
}

interface DataTableProps<T> {
  data: T[] | undefined;
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  showSearch?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
}

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];
type SortDir = "asc" | "desc" | null;

export function DataTable<T>(props: DataTableProps<T>) {
  const [search, setSearch] = createSignal("");
  const [sortKey, setSortKey] = createSignal<string | null>(null);
  const [sortDir, setSortDir] = createSignal<SortDir>(null);
  const [pageSize, setPageSize] = createSignal(props.defaultPageSize ?? 10);
  const [page, setPage] = createSignal(1);

  const handleSort = (key: string) => {
    if (sortKey() !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir() === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
    setPage(1);
  };

  const filtered = createMemo(() => {
    const rows = props.data ?? [];
    const q = search().toLowerCase().trim();
    if (!q) return rows;
    return rows.filter((row) =>
      props.columns.some((col) => {
        if (col.skipFilter) return false;
        const val = col.accessorFn ? String(col.accessorFn(row)) : "";
        return val.toLowerCase().includes(q);
      })
    );
  });

  const sorted = createMemo(() => {
    const rows = [...filtered()];
    const key = sortKey();
    const dir = sortDir();
    if (!key || !dir) return rows;
    const col = props.columns.find((c) => c.key === key);
    if (!col?.accessorFn) return rows;
    return rows.sort((a, b) => {
      const av = col.accessorFn!(a);
      const bv = col.accessorFn!(b);
      if (av === bv) return 0;
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return dir === "asc" ? cmp : -cmp;
    });
  });

  const totalRows = () => sorted().length;
  const totalPages = () => Math.max(1, Math.ceil(totalRows() / pageSize()));
  const resetPage = () => setPage(1);

  const paginated = createMemo(() => {
    const start = (page() - 1) * pageSize();
    return sorted().slice(start, start + pageSize());
  });

  const pageNumbers = createMemo(() => {
    const total = totalPages();
    const cur = page();
    const delta = 2;
    const range: (number | "...")[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= cur - delta && i <= cur + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  });

  return (
    <div class="space-y-3">
      <Show when={props.showSearch !== false}>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="relative w-full sm:w-72">
            <RiSystemSearchLine class="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              id="dt-search"
              type="text"
              placeholder={props.searchPlaceholder ?? "Search..."}
              value={search()}
              onInput={(e) => { setSearch(e.currentTarget.value); resetPage(); }}
              class="w-full rounded-lg border border-input bg-card/60 pl-8 pr-3 py-1.5 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div class="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0">
            <span>Rows per page:</span>
            <select
              value={pageSize()}
              onChange={(e) => { setPageSize(Number(e.currentTarget.value)); resetPage(); }}
              class="rounded-md border border-input bg-card/60 px-2 py-1 text-xs font-mono text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <For each={props.pageSizeOptions ?? DEFAULT_PAGE_SIZES}>
                {(n) => <option value={n}>{n}</option>}
              </For>
            </select>
          </div>
        </div>
      </Show>

      <div class="rounded-xl border border-dashed border-border overflow-hidden bg-card/60">
        <div class="overflow-x-auto">
          <Show
            when={!props.loading}
            fallback={
              <div class="py-16 text-center">
                <div class="mx-auto size-5 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
                <p class="text-xs font-mono text-muted-foreground">Loading data...</p>
              </div>
            }
          >
            <table class="w-full text-left text-xs font-mono">
              <thead class="border-b border-dashed border-border bg-secondary/40">
                <tr>
                  <For each={props.columns}>
                    {(col) => (
                      <th
                        class={`py-3 px-4 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground whitespace-nowrap ${col.sortable ? "cursor-pointer select-none hover:text-foreground transition-colors" : ""} ${col.headerClass ?? ""}`}
                        onClick={() => col.sortable && handleSort(col.key)}
                      >
                        <div class="flex items-center gap-1.5">
                          <span>{col.header}</span>
                          <Show when={col.sortable}>
                            <span class="text-muted-foreground/60">
                              {sortKey() === col.key ? (
                                sortDir() === "asc" ? (
                                  <RiArrowsArrowUpLine class="size-3 text-primary" />
                                ) : (
                                  <RiArrowsArrowDownLine class="size-3 text-primary" />
                                )
                              ) : (
                                <RiArrowsExpandUpDownLine class="size-3" />
                              )}
                            </span>
                          </Show>
                        </div>
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody class="divide-y divide-dashed divide-border/60">
                <Show
                  when={paginated().length > 0}
                  fallback={
                    <tr>
                      <td colspan={props.columns.length} class="py-14 text-center text-xs font-mono text-muted-foreground">
                        {props.emptyMessage ?? "No records found."}
                      </td>
                    </tr>
                  }
                >
                  <For each={paginated()}>
                    {(row) => (
                      <tr class="hover:bg-secondary/20 transition-colors group">
                        <For each={props.columns}>
                          {(col) => (
                            <td class={`py-3 px-4 align-middle ${col.cellClass ?? ""}`}>
                              {col.cell ? col.cell(row) : String(col.accessorFn ? col.accessorFn(row) : "")}
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </Show>
              </tbody>
            </table>
          </Show>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
        <span>
          Showing{" "}
          <strong class="text-foreground">
            {Math.min((page() - 1) * pageSize() + 1, totalRows())}–{Math.min(page() * pageSize(), totalRows())}
          </strong>{" "}
          of <strong class="text-foreground">{totalRows()}</strong> results
        </span>
        <div class="flex items-center gap-1">
          <button
            type="button"
            disabled={page() === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            class="flex items-center justify-center size-7 rounded-md border border-dashed border-border hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RiArrowsArrowLeftLine class="size-3.5" />
          </button>
          <For each={pageNumbers()}>
            {(num) =>
              num === "..." ? (
                <span class="px-2 text-muted-foreground/60">…</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setPage(num as number)}
                  class={`flex items-center justify-center h-7 min-w-[28px] px-2 rounded-md border border-dashed transition-colors cursor-pointer ${page() === num ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}
                >
                  {num}
                </button>
              )
            }
          </For>
          <button
            type="button"
            disabled={page() === totalPages()}
            onClick={() => setPage((p) => Math.min(totalPages(), p + 1))}
            class="flex items-center justify-center size-7 rounded-md border border-dashed border-border hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <RiArrowsArrowRightLine class="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
