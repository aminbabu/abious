import { createResource, createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import {
  RiSystemDeleteBinLine,
  RiDesignEditLine,
  RiSystemAddLine,
  RiSystemExternalLinkLine,
} from "solid-icons/ri";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { DataTable, ColumnDef } from "~/components/dashboard/data-table";
import { Button } from "~/components/ui/button";
import { api, ICaseStudyItem } from "~/lib/api";

export default function CaseStudiesAdminPage() {
  const [deletingId, setDeletingId] = createSignal<string | null>(null);

  const [caseStudies, { refetch }] = createResource(async () => {
    try {
      return (await api.caseStudies.list()) || [];
    } catch {
      return [];
    }
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete case study "${title}"? This is permanent.`)) return;
    setDeletingId(id);
    try {
      await api.caseStudies.delete(id);
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to delete case study.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<ICaseStudyItem>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      accessorFn: (c) => c.data?.title || c.id,
      cell: (c) => (
        <div class="min-w-[180px]">
          <p class="font-medium text-foreground truncate max-w-[240px]">{c.data?.title || c.id}</p>
          <Show when={c.slug}>
            <p class="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[240px]">/{c.slug}</p>
          </Show>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      accessorFn: (c) => c.data?.type || "Project",
      cell: (c) => (
        <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-semibold font-mono uppercase">
          {c.data?.type || "Project"}
        </span>
      ),
    },
    {
      key: "stack",
      header: "Stack",
      skipFilter: true,
      cell: (c) => (
        <div class="flex flex-wrap gap-1 max-w-[200px]">
          {(c.data?.stack || []).slice(0, 4).map((tech) => (
            <span class="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              {tech}
            </span>
          ))}
          {(c.data?.stack || []).length > 4 && (
            <span class="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              +{(c.data?.stack || []).length - 4}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      accessorFn: (c) => c.data?.description || "",
      cell: (c) => (
        <p class="text-[11px] text-muted-foreground line-clamp-2 max-w-[280px] leading-relaxed">
          {c.data?.description || "—"}
        </p>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClass: "text-right",
      cellClass: "text-right",
      skipFilter: true,
      cell: (c) => (
        <div class="flex items-center justify-end gap-1">
          <Show when={c.data?.liveURL}>
            <a href={c.data?.liveURL} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" class="size-7 cursor-pointer" title="Live URL">
                <RiSystemExternalLinkLine class="size-3.5 text-muted-foreground" />
              </Button>
            </a>
          </Show>
          <A href={`/dashboard/case-studies/${c.id}`}>
            <Button variant="ghost" size="icon" class="size-7 cursor-pointer" title="Edit">
              <RiDesignEditLine class="size-3.5 text-foreground" />
            </Button>
          </A>
          <Button
            variant="ghost"
            size="icon"
            disabled={deletingId() === c.id}
            onClick={() => handleDelete(c.id, c.data?.title || c.id)}
            class="size-7 text-destructive hover:bg-destructive/10 cursor-pointer"
            title="Delete"
          >
            <RiSystemDeleteBinLine class="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Case Studies"
      description="Portfolio projects, technology stacks, and live deployments"
      action={
        <A href="/dashboard/case-studies/new">
          <Button size="sm" class="font-mono text-xs flex items-center gap-1.5 cursor-pointer">
            <RiSystemAddLine class="size-3.5" />
            <span>Add Case Study</span>
          </Button>
        </A>
      }
    >
      {/* Stats strip */}
      <Show when={caseStudies()}>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Total Projects", value: caseStudies()?.length ?? 0 },
            {
              label: "With Live URL",
              value: caseStudies()?.filter((c) => c.data?.liveURL).length ?? 0,
            },
            {
              label: "With Stack",
              value: caseStudies()?.filter((c) => (c.data?.stack || []).length > 0).length ?? 0,
            },
          ].map((s) => (
            <div class="rounded-xl border border-dashed border-border bg-card/60 px-4 py-3">
              <p class="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p class="text-2xl font-bold font-mono mt-0.5 text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </Show>

      <DataTable
        data={caseStudies()}
        columns={columns}
        loading={caseStudies.loading}
        searchPlaceholder="Search by title, type, or description..."
        defaultPageSize={10}
        emptyMessage="No case studies yet. Click 'Add Case Study' to get started."
      />
    </DashboardLayout>
  );
}
