import { createResource, createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import {
  RiSystemDeleteBinLine,
  RiDesignEditLine,
  RiSystemAddLine,
  RiSystemCheckboxCircleLine,
  RiDocumentDraftLine,
  RiSystemEyeLine,
} from "solid-icons/ri";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { DataTable, ColumnDef } from "~/components/dashboard/data-table";
import { Button } from "~/components/ui/button";
import { api, IBlogPostItem } from "~/lib/api";

export default function BlogsAdminPage() {
  const [deletingId, setDeletingId] = createSignal<string | null>(null);

  const [posts, { refetch }] = createResource(async () => {
    try {
      return (await api.blogs.getAllAdmin()) || [];
    } catch {
      try {
        return (await api.blogs.list()) || [];
      } catch {
        return [];
      }
    }
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action is permanent.`)) return;
    setDeletingId(id);
    try {
      await api.blogs.delete(id);
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<IBlogPostItem>[] = [
    {
      key: "title",
      header: "Title / Slug",
      sortable: true,
      accessorFn: (p) => p.title,
      cell: (p) => (
        <div class="min-w-[200px]">
          <p class="font-medium text-foreground truncate max-w-[260px]">{p.title}</p>
          <p class="text-[11px] text-muted-foreground truncate max-w-[260px] mt-0.5">/{p.slug}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessorFn: (p) => (p.isDraft ? "Draft" : "Published"),
      cell: (p) => (
        <span
          class={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
            p.isDraft
              ? "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20"
              : "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20"
          }`}
        >
          {p.isDraft ? (
            <RiDocumentDraftLine class="size-3" />
          ) : (
            <RiSystemCheckboxCircleLine class="size-3" />
          )}
          {p.isDraft ? "Draft" : "Published"}
        </span>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      skipFilter: true,
      cell: (p) => (
        <div class="flex flex-wrap gap-1 max-w-[160px]">
          {(p.tags || []).slice(0, 3).map((tag) => (
            <span class="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              #{tag}
            </span>
          ))}
          {(p.tags || []).length > 3 && (
            <span class="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              +{(p.tags || []).length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      accessorFn: (p) => p.createdAt || "",
      cell: (p) => (
        <span class="text-[11px] text-muted-foreground whitespace-nowrap">
          {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClass: "text-right",
      cellClass: "text-right",
      skipFilter: true,
      cell: (p) => (
        <div class="flex items-center justify-end gap-1">
          <Show when={!p.isDraft}>
            <A href={`/blogs/${p.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" class="size-7 cursor-pointer" title="Preview">
                <RiSystemEyeLine class="size-3.5 text-muted-foreground" />
              </Button>
            </A>
          </Show>
          <A href={`/dashboard/blogs/${p.id}`}>
            <Button variant="ghost" size="icon" class="size-7 cursor-pointer" title="Edit">
              <RiDesignEditLine class="size-3.5 text-foreground" />
            </Button>
          </A>
          <Button
            variant="ghost"
            size="icon"
            disabled={deletingId() === p.id}
            onClick={() => handleDelete(p.id, p.title)}
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
      title="Blog Posts"
      description="Manage, author, publish, and delete blog articles"
      action={
        <A href="/dashboard/blogs/new">
          <Button size="sm" class="font-mono text-xs flex items-center gap-1.5 cursor-pointer">
            <RiSystemAddLine class="size-3.5" />
            <span>New Article</span>
          </Button>
        </A>
      }
    >
      {/* Stats strip */}
      <Show when={posts()}>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: posts()?.length ?? 0, color: "text-foreground" },
            {
              label: "Published",
              value: posts()?.filter((p) => !p.isDraft).length ?? 0,
              color: "text-emerald-500",
            },
            {
              label: "Drafts",
              value: posts()?.filter((p) => p.isDraft).length ?? 0,
              color: "text-amber-500",
            },
            {
              label: "Tagged",
              value: posts()?.filter((p) => (p.tags || []).length > 0).length ?? 0,
              color: "text-primary",
            },
          ].map((s) => (
            <div class="rounded-xl border border-dashed border-border bg-card/60 px-4 py-3">
              <p class="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p class={`text-2xl font-bold font-mono mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </Show>

      <DataTable
        data={posts()}
        columns={columns}
        loading={posts.loading}
        searchPlaceholder="Search by title, slug, or tags..."
        defaultPageSize={10}
        emptyMessage="No blog posts found. Click 'New Article' to write your first post."
      />
    </DashboardLayout>
  );
}
