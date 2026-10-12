import { createResource, createSignal, Show, For } from "solid-js";
import * as v from "valibot";
import { createForm, Form, Field } from "@formisch/solid";
import {
  RiSystemAddLine,
  RiSystemDeleteBinLine,
  RiDesignEditLine,
  RiSystemStarFill,
  RiSystemCloseLine,
  RiSystemCheckLine,
  RiSystemAlertLine,
} from "solid-icons/ri";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { DataTable, ColumnDef } from "~/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api, ITestimonialItem } from "~/lib/api";

const TestimonialSchema = v.object({
  name: v.pipe(
    v.string("Client name is required"),
    v.nonEmpty("Please enter client name"),
    v.minLength(2, "Client name must be at least 2 characters")
  ),
  role: v.pipe(
    v.string("Role is required"),
    v.nonEmpty("Please enter client role")
  ),
  company: v.pipe(
    v.string("Company is required"),
    v.nonEmpty("Please enter client company")
  ),
  avatar: v.optional(v.string()),
  rating: v.optional(v.number()),
  body: v.pipe(
    v.string("Testimonial text is required"),
    v.nonEmpty("Please enter testimonial text"),
    v.minLength(10, "Testimonial text must be at least 10 characters")
  ),
});

export default function TestimonialsAdminPage() {
  const [testimonials, { refetch }] = createResource(async () => {
    try {
      return (await api.testimonials.list()) || [];
    } catch {
      return [];
    }
  });

  const [rating, setRating] = createSignal(5);
  const [editingId, setEditingId] = createSignal<string | null>(null);
  const [saving, setSaving] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm({
    schema: TestimonialSchema,
    initialValues: {
      name: "",
      role: "",
      company: "",
      avatar: "",
      body: "",
      rating: 5,
    },
  });

  const resetForm = () => {
    setRating(5);
    setEditingId(null);
    setShowForm(false);
    setErrorMessage(null);
  };

  const handleEdit = (item: ITestimonialItem) => {
    setEditingId(item.id);
    setRating(item.rating || 5);
    setErrorMessage(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (values: v.InferOutput<typeof TestimonialSchema>) => {
    setSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: values.name.trim(),
        role: values.role.trim(),
        company: values.company.trim(),
        avatar: values.avatar?.trim() || undefined,
        body: values.body.trim(),
        rating: rating(),
      };

      if (editingId()) {
        await api.testimonials.update(editingId()!, payload);
      } else {
        await api.testimonials.create(payload);
      }
      resetForm();
      refetch();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial? This is permanent.")) return;
    setDeletingId(id);
    try {
      await api.testimonials.delete(id);
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to delete testimonial.");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<ITestimonialItem>[] = [
    {
      key: "client",
      header: "Client",
      sortable: true,
      accessorFn: (t) => t.name || t.data?.name || "Anonymous",
      cell: (t) => {
        const clientName = t.name || t.data?.name || "Anonymous";
        const clientRole = t.role || t.data?.role || "";
        const clientCompany = t.company || t.data?.company || "";
        const clientAvatar = t.avatar || t.data?.avatar || "";
        return (
          <div class="flex items-center gap-2.5">
            <Show
              when={clientAvatar}
              fallback={
                <div class="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
                  {clientName.slice(0, 2).toUpperCase()}
                </div>
              }
            >
              <img
                src={clientAvatar}
                alt={clientName}
                class="size-7 rounded-full object-cover border border-border"
              />
            </Show>
            <div>
              <p class="font-medium text-foreground">{clientName}</p>
              <p class="text-[11px] text-muted-foreground font-mono">
                {clientRole}
                {clientCompany && ` • ${clientCompany}`}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      accessorFn: (t) => t.rating || 5,
      cell: (t) => (
        <div class="flex items-center gap-0.5 text-amber-500">
          <For each={Array(Math.min(t.rating || 5, 5)).fill(0)}>
            {() => <RiSystemStarFill class="size-3" />}
          </For>
          <span class="ml-1 text-[10px] font-mono text-muted-foreground">({t.rating || 5}/5)</span>
        </div>
      ),
    },
    {
      key: "body",
      header: "Testimonial",
      accessorFn: (t) => t.body || "",
      cell: (t) => (
        <p class="text-[11px] text-muted-foreground italic line-clamp-2 max-w-[320px] leading-relaxed">
          "{t.body || "—"}"
        </p>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClass: "text-right",
      cellClass: "text-right",
      skipFilter: true,
      cell: (t) => (
        <div class="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(t)}
            class="size-7 cursor-pointer"
            title="Edit"
          >
            <RiDesignEditLine class="size-3.5 text-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(t.id)}
            disabled={deletingId() === t.id}
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
      title="Client Testimonials"
      description="Manage customer endorsements, ratings, and social proof"
      actions={
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          class="font-mono text-xs cursor-pointer gap-1.5"
        >
          <RiSystemAddLine class="size-3.5" />
          <span>Add Testimonial</span>
        </Button>
      }
    >
      {/* Inline Form */}
      <Show when={showForm()}>
        <Card class="border-dashed bg-card/60 border-primary/40">
          <CardHeader class="flex flex-row items-start justify-between pb-3">
            <div>
              <CardTitle class="text-sm font-mono">
                {editingId() ? "Edit Testimonial" : "Add Testimonial"}
              </CardTitle>
              <CardDescription class="text-xs">
                {editingId() ? "Update the endorsement details below." : "Record a client review or quote."}
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

            <Form of={form} onSubmit={handleSubmit} class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field of={form} path={["name"]}>
                  {(field) => {
                    const currentItem = () => editingId() ? testimonials()?.find((t) => t.id === editingId()) : null;
                    return (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Client Name *</label>
                        <input
                          {...field.props}
                          type="text"
                          value={field.input ?? currentItem()?.name ?? currentItem()?.data?.name ?? ""}
                          placeholder="Sarah Connor"
                          class={`w-full rounded-lg border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                            field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                          }`}
                        />
                        {field.errors && (
                          <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                        )}
                      </div>
                    );
                  }}
                </Field>

                <Field of={form} path={["role"]}>
                  {(field) => {
                    const currentItem = () => editingId() ? testimonials()?.find((t) => t.id === editingId()) : null;
                    return (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Role *</label>
                        <input
                          {...field.props}
                          type="text"
                          value={field.input ?? currentItem()?.role ?? currentItem()?.data?.role ?? ""}
                          placeholder="CTO"
                          class={`w-full rounded-lg border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                            field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                          }`}
                        />
                        {field.errors && (
                          <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                        )}
                      </div>
                    );
                  }}
                </Field>

                <Field of={form} path={["company"]}>
                  {(field) => {
                    const currentItem = () => editingId() ? testimonials()?.find((t) => t.id === editingId()) : null;
                    return (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Company *</label>
                        <input
                          {...field.props}
                          type="text"
                          value={field.input ?? currentItem()?.company ?? currentItem()?.data?.company ?? ""}
                          placeholder="Cyberdyne Systems"
                          class={`w-full rounded-lg border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                            field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                          }`}
                        />
                        {field.errors && (
                          <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                        )}
                      </div>
                    );
                  }}
                </Field>

                <Field of={form} path={["avatar"]}>
                  {(field) => {
                    const currentItem = () => editingId() ? testimonials()?.find((t) => t.id === editingId()) : null;
                    return (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Avatar URL</label>
                        <input
                          {...field.props}
                          type="url"
                          value={field.input ?? currentItem()?.avatar ?? currentItem()?.data?.avatar ?? ""}
                          placeholder="https://..."
                          class="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    );
                  }}
                </Field>

                <div class="space-y-1.5">
                  <label class="text-xs font-mono font-medium text-foreground">Rating (1–5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating()}
                    onInput={(e) => setRating(parseInt(e.currentTarget.value, 10))}
                    class="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <Field of={form} path={["body"]}>
                  {(field) => {
                    const currentItem = () => editingId() ? testimonials()?.find((t) => t.id === editingId()) : null;
                    return (
                      <div class="space-y-1.5 sm:col-span-3">
                        <label class="text-xs font-mono font-medium text-foreground">Testimonial Body *</label>
                        <textarea
                          {...field.props}
                          rows={3}
                          value={field.input ?? currentItem()?.body ?? ""}
                          placeholder="Amin delivered exceptional architecture ahead of schedule..."
                          class={`w-full rounded-lg border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed ${
                            field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                          }`}
                        />
                        {field.errors && (
                          <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                        )}
                      </div>
                    );
                  }}
                </Field>
              </div>

              <div class="flex items-center gap-2">
                <Button type="submit" disabled={saving()} class="font-mono text-xs cursor-pointer gap-1.5">
                  <RiSystemCheckLine class="size-3.5" />
                  {saving() ? "Saving..." : editingId() ? "Update Testimonial" : "Add Testimonial"}
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
        data={testimonials()}
        columns={columns}
        loading={testimonials.loading}
        searchPlaceholder="Search by client name, role, or testimonial text..."
        defaultPageSize={10}
        emptyMessage="No testimonials recorded yet. Click 'Add Testimonial' to get started."
      />
    </DashboardLayout>
  );
}
