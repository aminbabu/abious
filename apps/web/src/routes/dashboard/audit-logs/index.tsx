import { createResource, createSignal, Show } from "solid-js";
import { RiSystemTimeLine } from "solid-icons/ri";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { DataTable, ColumnDef } from "~/components/dashboard/data-table";
import { Select } from "~/components/ui/select";
import { api, IAuditLogItem } from "~/lib/api";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
  UPDATE: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
  DELETE: "bg-destructive/10 text-destructive ring-destructive/20",
  LOGIN: "bg-primary/10 text-primary ring-primary/20",
  LOGOUT: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
};

const actionClass = (action: string) =>
  ACTION_COLORS[action?.toUpperCase()] ?? "bg-secondary text-muted-foreground ring-border";

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = createSignal("");

  const [logs] = createResource(async () => {
    try {
      return (await api.auditLogs.list({ limit: 200 })) || [];
    } catch {
      return [];
    }
  });

  // Filter by action dropdown on top of DataTable's own search
  const filteredLogs = () => {
    const list = logs() || [];
    const f = actionFilter().toLowerCase();
    if (!f) return list;
    return list.filter((l) => l.action?.toLowerCase() === f);
  };

  const columns: ColumnDef<IAuditLogItem>[] = [
    {
      key: "createdAt",
      header: "Timestamp",
      sortable: true,
      accessorFn: (l) => l.createdAt || "",
      cell: (l) => (
        <span class="text-[11px] text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
          <RiSystemTimeLine class="size-3 shrink-0" />
          {l.createdAt
            ? new Date(l.createdAt).toLocaleString("en-US", {
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      accessorFn: (l) => l.action || "",
      cell: (l) => (
        <span
          class={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono uppercase ring-1 ${actionClass(l.action)}`}
        >
          {l.action || "—"}
        </span>
      ),
    },
    {
      key: "resource",
      header: "Resource",
      sortable: true,
      accessorFn: (l) => l.resource || "",
      cell: (l) => (
        <div>
          <span class="font-medium text-foreground">{l.resource || "—"}</span>
          <Show when={l.resourceId}>
            <span class="text-[10px] text-muted-foreground font-mono ml-1.5">
              #{String(l.resourceId).slice(0, 8)}…
            </span>
          </Show>
        </div>
      ),
    },
    {
      key: "userId",
      header: "Actor",
      sortable: true,
      accessorFn: (l) => l.userId || "system",
      cell: (l) => (
        <span class="text-[11px] font-mono text-muted-foreground truncate max-w-[120px] block">
          {l.userId ? String(l.userId).slice(0, 16) + (l.userId.length > 16 ? "…" : "") : "system"}
        </span>
      ),
    },
    {
      key: "ipAddress",
      header: "IP Address",
      accessorFn: (l) => l.ipAddress || "—",
      cell: (l) => (
        <code class="text-[11px] text-muted-foreground">{l.ipAddress || "127.0.0.1"}</code>
      ),
    },
    {
      key: "details",
      header: "Details",
      skipFilter: true,
      cell: (l) => (
        <Show
          when={l.details && Object.keys(l.details).length > 0}
          fallback={<span class="text-muted-foreground/50 text-[10px]">—</span>}
        >
          <code class="text-[10px] text-muted-foreground max-w-[160px] block truncate">
            {JSON.stringify(l.details)}
          </code>
        </Show>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Audit Logs"
      description="System security events, mutations, and administrative trail"
    >
      {/* Action filter */}
      <div class="flex items-center gap-2">
        <label class="text-xs font-mono text-muted-foreground shrink-0">Filter by action:</label>
        <Select
          class="w-44"
          value={actionFilter()}
          onChange={setActionFilter}
          options={[
            { value: "", label: "All Actions" },
            { value: "create", label: "CREATE" },
            { value: "update", label: "UPDATE" },
            { value: "delete", label: "DELETE" },
            { value: "login", label: "LOGIN" },
            { value: "logout", label: "LOGOUT" },
          ]}
        />
        <span class="text-xs font-mono text-muted-foreground ml-auto">
          Total: <strong class="text-foreground">{filteredLogs().length}</strong> events
        </span>
      </div>

      <DataTable
        data={filteredLogs()}
        columns={columns}
        loading={logs.loading}
        searchPlaceholder="Search by resource, actor, IP, or action..."
        defaultPageSize={25}
        pageSizeOptions={[10, 25, 50, 100, 200]}
        emptyMessage="No audit log events found."
      />
    </DashboardLayout>
  );
}
