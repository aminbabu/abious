import { createSignal, createResource, Show } from "solid-js";
import * as v from "valibot";
import { createForm, Form, Field } from "@formisch/solid";
import {
  RiSystemDeleteBinLine,
  RiDesignEditLine,
  RiSystemAddLine,
  RiSystemCheckLine,
  RiSystemCloseLine,
  RiSystemAlertLine,
} from "solid-icons/ri";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { DataTable, ColumnDef } from "~/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api, IServiceItem } from "~/lib/api";

const ServiceSchema = v.object({
  title: v.pipe(
    v.string("Service title is required"),
    v.nonEmpty("Please enter service title"),
    v.minLength(2, "Service title must be at least 2 characters")
  ),
  icon: v.optional(v.string()),
  description: v.pipe(
    v.string("Description is required"),
    v.nonEmpty("Please enter service description"),
    v.minLength(5, "Description must be at least 5 characters")
  ),
});

export default function ServicesAdminPage() {
  const [services, { refetch }] = createResource(async () => {
    try {
      return (await api.services.getAllAdmin()) || [];
    } catch {
      return (await api.services.list()) || [];
    }
  });

  const [editingId, setEditingId] = createSignal<string | number | null>(null);
  const [saving, setSaving] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | number | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm({
    schema: ServiceSchema,
    initialValues: {
      title: "",
      icon: "",
      description: "",
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setErrorMessage(null);
  };

  const handleEdit = (service: IServiceItem) => {
    setEditingId(service.id);
    setErrorMessage(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (values: v.InferOutput<typeof ServiceSchema>) => {
    setSaving(true);
    setErrorMessage(null);

    try {
      if (editingId()) {
        await api.services.update(String(editingId()), {
          title: values.title.trim(),
          description: values.description.trim(),
          icon: values.icon?.trim() || undefined,
        });
      } else {
        await api.services.create({
          title: values.title.trim(),
          description: values.description.trim(),
          icon: values.icon?.trim() || undefined,
          isActive: true,
        });
      }
      resetForm();
      refetch();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Delete this service? This is permanent.")) return;
    setDeletingId(id);
    try {
      await api.services.delete(String(id));
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to delete service.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<IServiceItem>[] = [
    {
      key: "title",
      header: "Service",
      sortable: true,
      accessorFn: (s) => s.title,
      cell: (s) => (
        <div class="min-w-[160px]">
          <div class="flex items-center gap-2">
            <p class="font-medium text-foreground">{s.title}</p>
            <Show when={s.isActive ?? true}>
              <span class="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-500 font-semibold">
                Active
              </span>
            </Show>
          </div>
          <Show when={s.icon}>
            <p class="text-[11px] text-muted-foreground font-mono mt-0.5">{s.icon}</p>
          </Show>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      accessorFn: (s) => s.description,
      cell: (s) => (
        <p class="text-[11px] text-muted-foreground line-clamp-2 max-w-[340px] leading-relaxed">
          {s.description}
        </p>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClass: "text-right",
      cellClass: "text-right",
      skipFilter: true,
      cell: (s) => (
        <div class="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(s)}
            class="size-7 cursor-pointer"
            title="Edit"
          >
            <RiDesignEditLine class="size-3.5 text-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(s.id)}
            disabled={deletingId() === s.id}
            class="size-7 text-destructive hover:text-destructive cursor-pointer"
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
      title="Service Offerings"
      description="Manage consulting packages and technical development services"
      actions={
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          class="font-mono text-xs cursor-pointer gap-1.5"
        >
          <RiSystemAddLine class="size-3.5" />
          <span>New Service</span>
        </Button>
      }
    >
      {/* Inline Form */}
      <Show when={showForm()}>
        <Card class="border-dashed bg-card/60 border-primary/40">
          <CardHeader class="flex flex-row items-start justify-between pb-3">
            <div>
              <CardTitle class="text-sm font-mono">
                {editingId() ? "Edit Service" : "Add New Service"}
              </CardTitle>
              <CardDescription class="text-xs">
                {editingId() ? "Modify the service details below." : "Fill in the details to add a new service offering."}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" class="size-7 cursor-pointer shrink-0" onClick={resetForm}>
              <RiSystemCloseLine class="size-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            <Show when={errorMessage()}>
              <div class="mb-4 flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                <RiSystemAlertLine class="size-4 shrink-0" />
                <span>{errorMessage()}</span>
              </div>
            </Show>

            <Form of={form} onSubmit={handleSubmit} class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field of={form} path={["title"]}>
                {(field) => (
                  <div class="space-y-1.5">
                    <label class="text-xs font-mono font-medium text-foreground">Service Title *</label>
                    <input
                      {...field.props}
                      type="text"
                      value={field.input ?? (editingId() ? services()?.find((s) => s.id === editingId())?.title : "") ?? ""}
                      placeholder="e.g. Full-Stack Development"
                      class={`w-full rounded-lg border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                        field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                      }`}
                    />
                    {field.errors && (
                      <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field of={form} path={["icon"]}>
                {(field) => (
                  <div class="space-y-1.5">
                    <label class="text-xs font-mono font-medium text-foreground">Icon Identifier</label>
                    <input
                      {...field.props}
                      type="text"
                      value={field.input ?? (editingId() ? services()?.find((s) => s.id === editingId())?.icon : "") ?? ""}
                      placeholder="e.g. RiCodeBoxLine"
                      class="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}
              </Field>

              <Field of={form} path={["description"]}>
                {(field) => (
                  <div class="space-y-1.5 sm:col-span-3">
                    <label class="text-xs font-mono font-medium text-foreground">Description *</label>
                    <textarea
                      {...field.props}
                      rows={2}
                      value={field.input ?? (editingId() ? services()?.find((s) => s.id === editingId())?.description : "") ?? ""}
                      placeholder="Short summary of the service..."
                      class={`w-full rounded-lg border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                        field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                      }`}
                    />
                    {field.errors && (
                      <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                    )}
                  </div>
                )}
              </Field>

              <div class="sm:col-span-3 flex items-center gap-2 pt-1">
                <Button type="submit" disabled={saving()} class="font-mono text-xs cursor-pointer gap-1.5">
                  <RiSystemCheckLine class="size-3.5" />
                  {saving() ? "Saving..." : editingId() ? "Update Service" : "Add Service"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} class="font-mono text-xs cursor-pointer">
                  Cancel
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </Show>

      <DataTable
        data={services()}
        columns={columns}
        loading={services.loading}
        searchKey="title"
        searchPlaceholder="Filter services by title..."
        pageSize={10}
      />
    </DashboardLayout>
  );
}
