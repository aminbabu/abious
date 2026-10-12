import { createSignal, createResource, Show } from "solid-js";
import * as v from "valibot";
import { createForm, Form, Field, setInput } from "@formisch/solid";
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
import { Select } from "~/components/ui/select";
import IconPicker, { SERVICE_ICONS_MAP } from "~/components/dashboard/icon-picker";
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
  const [isActive, setIsActive] = createSignal(true);
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
    setIsActive(true);
    setShowForm(false);
    setErrorMessage(null);
  };

  const handleEdit = (service: IServiceItem) => {
    setEditingId(service.id);
    setIsActive(service.isActive ?? true);
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
          isActive: isActive(),
        });
      } else {
        await api.services.create({
          title: values.title.trim(),
          description: values.description.trim(),
          icon: values.icon?.trim() || undefined,
          isActive: isActive(),
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
      cell: (s) => {
        const IconComponent = (s.icon && SERVICE_ICONS_MAP[s.icon]) ? SERVICE_ICONS_MAP[s.icon] : null;
        return (
          <div class="min-w-[180px] flex items-center gap-3">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-primary">
              <Show when={IconComponent} fallback={<span class="text-xs font-mono">./</span>}>
                {(() => {
                  const Comp = IconComponent!;
                  return <Comp class="size-4" />;
                })()}
              </Show>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-medium text-foreground text-xs font-mono">{s.title}</p>
                <Show when={s.isActive ?? true}>
                  <span class="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] text-emerald-500 font-semibold font-mono">
                    Active
                  </span>
                </Show>
              </div>
              <p class="text-[10px] text-muted-foreground font-mono mt-0.5">
                {s.icon || "Default Icon"}
              </p>
            </div>
          </div>
        );
      },
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
        <Card class="border-dashed bg-card/60 border-primary/40 mb-6 shadow-sm">
          <CardHeader class="flex flex-row items-start justify-between pb-4 border-b border-border/40">
            <div>
              <CardTitle class="text-sm font-mono flex items-center gap-2">
                <span>{editingId() ? "Edit Service Offering" : "Add New Service Offering"}</span>
                <Show when={editingId()}>
                  <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground font-normal">
                    ID: {editingId()}
                  </span>
                </Show>
              </CardTitle>
              <CardDescription class="text-xs">
                {editingId()
                  ? "Update package title, visual identifier icon, and offering scope."
                  : "Fill in the service details to list a technical consulting offering on your portfolio."}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              class="size-7 cursor-pointer shrink-0 text-muted-foreground hover:text-foreground"
              onClick={resetForm}
            >
              <RiSystemCloseLine class="size-4" />
            </Button>
          </CardHeader>
          <CardContent class="pt-5">
            <Show when={errorMessage()}>
              <div class="mb-4 flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                <RiSystemAlertLine class="size-4 shrink-0" />
                <span>{errorMessage()}</span>
              </div>
            </Show>

            <Form of={form} onSubmit={handleSubmit} class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Service Title */}
                <div class="md:col-span-5">
                  <Field of={form} path={["title"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Service Title *</label>
                        <input
                          {...field.props}
                          type="text"
                          value={field.input ?? (editingId() ? services()?.find((s) => s.id === editingId())?.title : "") ?? ""}
                          placeholder="e.g. Full-Stack Development"
                          class={`w-full h-9 rounded-md border bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                            field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                          }`}
                        />
                        {field.errors && (
                          <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                {/* Visual Icon Picker */}
                <div class="md:col-span-4">
                  <Field of={form} path={["icon"]}>
                    {(field) => (
                      <IconPicker
                        label="Service Icon"
                        value={field.input ?? (editingId() ? services()?.find((s) => s.id === editingId())?.icon : "") ?? "RiBusinessWindowLine"}
                        onChange={(iconName) => {
                          setInput(form, {
                            path: ["icon"],
                            input: iconName,
                          });
                        }}
                      />
                    )}
                  </Field>
                </div>

                {/* Service Status Select */}
                <div class="md:col-span-3">
                  <div class="space-y-1.5">
                    <label class="text-xs font-mono font-medium text-foreground">Status *</label>
                    <Select
                      value={isActive() ? "active" : "inactive"}
                      onChange={(val) => setIsActive(val === "active")}
                      options={[
                        { value: "active", label: "Active (Offered)", badge: "Live" },
                        { value: "inactive", label: "Inactive (Hidden)", badge: "Draft" },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Description Textarea with Increased Height */}
              <Field of={form} path={["description"]}>
                {(field) => (
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between">
                      <label class="text-xs font-mono font-medium text-foreground">Service Description & Scope *</label>
                      <span class="text-[11px] font-mono text-muted-foreground">Markdown supported</span>
                    </div>
                    <textarea
                      {...field.props}
                      rows={6}
                      value={field.input ?? (editingId() ? services()?.find((s) => s.id === editingId())?.description : "") ?? ""}
                      placeholder="Outline the core value proposition, key deliverables, technologies, and target clients..."
                      class={`w-full min-h-[140px] resize-y rounded-md border bg-background/50 px-3.5 py-2.5 text-xs font-mono text-foreground leading-relaxed shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                        field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                      }`}
                    />

                    {field.errors && (
                      <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                    )}
                  </div>
                )}
              </Field>

              {/* Action Buttons */}
              <div class="flex items-center justify-between pt-2 border-t border-border/40">
                <p class="text-[11px] font-mono text-muted-foreground">
                  * Indicates required field. Changes will take effect across public services immediately.
                </p>
                <div class="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={resetForm} class="font-mono text-xs cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving()} class="font-mono text-xs cursor-pointer gap-1.5">
                    <RiSystemCheckLine class="size-3.5" />
                    <span>{saving() ? "Saving..." : editingId() ? "Update Service" : "Add Service"}</span>
                  </Button>
                </div>
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
