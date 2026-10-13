import { createResource, createSignal, For, Show } from "solid-js";
import * as v from "valibot";
import { createForm, Form, Field, setInput, reset } from "@formisch/solid";
import {
  RiBuildingsBuildingLine,
  RiMapMapPin2Line,
  RiSystemTimeLine,
  RiSystemAddLine,
  RiSystemCloseLine,
  RiSystemCheckLine,
  RiSystemDeleteBinLine,
  RiDesignEditLine,
  RiSystemAlertLine,
} from "solid-icons/ri";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Image from "~/components/ui/image";
import ImageUploadDropzone from "~/components/dashboard/image-upload-dropzone";
import { api, IExperienceItem } from "~/lib/api";

const ExperienceSchema = v.object({
  company: v.pipe(
    v.string("Company name is required"),
    v.nonEmpty("Please enter company name"),
    v.minLength(2, "Company must be at least 2 characters")
  ),
  location: v.pipe(
    v.string("Location is required"),
    v.nonEmpty("Please enter location")
  ),
  logo: v.pipe(
    v.string("Logo URL is required"),
    v.nonEmpty("Please enter logo URL")
  ),
  roleTitle: v.pipe(
    v.string("Primary role is required"),
    v.nonEmpty("Please enter primary role title")
  ),
  roleType: v.pipe(
    v.string("Role type is required"),
    v.nonEmpty("Please enter role type (e.g. Full-time, Contract)")
  ),
  startDate: v.pipe(
    v.string("Start date is required"),
    v.nonEmpty("Please enter start date (e.g. Jan 2022)")
  ),
  endDate: v.optional(v.string()),
});

export default function ExperienceAdminPage() {
  const [experiences, { refetch }] = createResource(async () => {
    try {
      return (await api.experience.list()) || [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = createSignal(false);
  const [editingId, setEditingId] = createSignal<string | number | null>(null);
  const [saving, setSaving] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | number | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm({
    schema: ExperienceSchema,
    initialValues: {
      company: "",
      location: "",
      logo: "",
      roleTitle: "",
      roleType: "Full-time",
      startDate: "",
      endDate: "Present",
    },
  });

  const resetForm = () => {
    reset(form);
    setEditingId(null);
    setShowForm(false);
    setErrorMessage(null);
  };

  const handleEdit = (item: IExperienceItem) => {
    setEditingId(item.id);
    setErrorMessage(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (values: v.InferOutput<typeof ExperienceSchema>) => {
    setSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        company: values.company.trim(),
        location: values.location.trim(),
        logo: values.logo.trim(),
        positions: [
          {
            id: Date.now(),
            title: values.roleTitle.trim(),
            type: values.roleType.trim(),
            startDate: values.startDate.trim(),
            endDate: values.endDate?.trim() || "Present",
          },
        ],
      };

      if (editingId()) {
        await api.experience.update(editingId()!, payload);
      } else {
        await api.experience.create(payload);
      }

      resetForm();
      refetch();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save experience.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Delete this experience entry?")) return;
    setDeletingId(id);
    try {
      await api.experience.delete(id);
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to delete experience.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPositions = () =>
    (experiences() || []).reduce((acc, e) => acc + (e.positions || []).length, 0);

  return (
    <DashboardLayout
      title="Experiences"
      description="Professional career history and employment milestones"
      actions={
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          class="font-mono text-xs cursor-pointer gap-1.5"
        >
          <RiSystemAddLine class="size-3.5" />
          <span>Add Experience</span>
        </Button>
      }
    >
      {/* Inline Form */}
      <Show when={showForm()}>
        <Card class="border-dashed bg-card/60 border-primary/40 mb-6">
          <CardHeader class="flex flex-row items-start justify-between pb-3">
            <div>
              <CardTitle class="text-sm font-mono">
                {editingId() ? "Edit Career Milestone" : "Add Career Milestone"}
              </CardTitle>
              <CardDescription class="text-xs">
                {editingId() ? "Update company, location, or role position details." : "Record a company, location, and role position."}
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

            <Form of={form} onSubmit={handleSubmit} class="space-y-5">
              {/* Top Row: Company & Location */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field of={form} path={["company"]}>
                  {(field) => {
                    const currentItem = () => editingId() ? experiences()?.find((e) => e.id === editingId()) : null;
                    return (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Company Name *</label>
                        <input
                          {...field.props}
                          type="text"
                          value={field.input ?? currentItem()?.company ?? ""}
                          placeholder="Google / Tech Corp"
                          class={`w-full h-9 rounded-md border bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
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

                <Field of={form} path={["location"]}>
                  {(field) => {
                    const currentItem = () => editingId() ? experiences()?.find((e) => e.id === editingId()) : null;
                    return (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Location *</label>
                        <input
                          {...field.props}
                          type="text"
                          value={field.input ?? currentItem()?.location ?? ""}
                          placeholder="San Francisco, CA / Remote"
                          class={`w-full h-9 rounded-md border bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
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

              {/* Company Logo Dropzone */}
              <div>
                <Field of={form} path={["logo"]}>
                  {(field) => {
                    const currentItem = () => editingId() ? experiences()?.find((e) => e.id === editingId()) : null;
                    return (
                      <ImageUploadDropzone
                        compact
                        label="Company Logo / Brand Mark"
                        description="Upload company emblem or SVG/PNG mark (max 10MB)"
                        value={field.input ?? currentItem()?.logo ?? ""}
                        onChange={(url) => {
                          setInput(form, {
                            path: ["logo"],
                            input: url,
                          });
                        }}
                      />
                    );
                  }}
                </Field>
              </div>

              {/* Position / Role Details: 4 columns on large screens */}
              <div class="border-t border-dashed border-border/60 pt-4">
                <div class="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  Primary Position Details
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Field of={form} path={["roleTitle"]}>
                    {(field) => {
                      const currentPos = () => editingId() ? experiences()?.find((e) => e.id === editingId())?.positions?.[0] : null;
                      return (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">Role Title *</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? currentPos()?.title ?? ""}
                            placeholder="Principal Architect"
                            class={`w-full h-9 rounded-md border bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
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

                  <Field of={form} path={["roleType"]}>
                    {(field) => {
                      const currentPos = () => editingId() ? experiences()?.find((e) => e.id === editingId())?.positions?.[0] : null;
                      return (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">Employment Type *</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? currentPos()?.type ?? ""}
                            placeholder="Full-time / Contract"
                            class={`w-full h-9 rounded-md border bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
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

                  <Field of={form} path={["startDate"]}>
                    {(field) => {
                      const currentPos = () => editingId() ? experiences()?.find((e) => e.id === editingId())?.positions?.[0] : null;
                      return (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">Start Date *</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? currentPos()?.startDate ?? ""}
                            placeholder="e.g. Jan 2022"
                            class={`w-full h-9 rounded-md border bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
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

                  <Field of={form} path={["endDate"]}>
                    {(field) => {
                      const currentPos = () => editingId() ? experiences()?.find((e) => e.id === editingId())?.positions?.[0] : null;
                      return (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">End Date</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? currentPos()?.endDate ?? ""}
                            placeholder="Present or Dec 2024"
                            class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      );
                    }}
                  </Field>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-border/40">
                <p class="text-[11px] font-mono text-muted-foreground">
                  * Required fields. Added milestone will immediately appear on your timeline.
                </p>
                <div class="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={resetForm} class="font-mono text-xs cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving()} class="font-mono text-xs cursor-pointer gap-1.5">
                    <RiSystemCheckLine class="size-3.5" />
                    <span>{saving() ? "Saving..." : editingId() ? "Update Milestone" : "Add Experience"}</span>
                  </Button>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </Show>

      {/* Stats */}
      <Show when={experiences()}>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Companies", value: experiences()?.length ?? 0 },
            { label: "Total Roles", value: totalPositions() },
            {
              label: "Current Role",
              value: (experiences()?.[0]?.positions?.[0]?.endDate === "Present" ||
                experiences()?.[0]?.positions?.[0]?.endDate === "present" ||
                !experiences()?.[0]?.positions?.[0]?.endDate) ? "Active" : "—",
              isText: true,
            },
          ].map((s) => (
            <div class="rounded-xl border border-dashed border-border bg-card/60 px-4 py-3">
              <p class="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p class="text-2xl font-bold font-mono mt-0.5 text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </Show>

      <Show
        when={experiences() && (experiences() || []).length > 0}
        fallback={
          <div class="rounded-xl border border-dashed border-border bg-card/60 py-16 text-center">
            <RiBuildingsBuildingLine class="size-8 mx-auto mb-3 text-muted-foreground/40" />
            <p class="text-xs font-mono text-muted-foreground">No experience records loaded.</p>
            <p class="text-[11px] text-muted-foreground/60 mt-1">Data comes from the API — check API connectivity.</p>
          </div>
        }
      >
        <div class="space-y-4">
          <div class="space-y-3">
            <For each={experiences()}>
              {(item) => (
                <Card class="border-dashed bg-card/60 hover:border-primary/30 transition-colors">
                  <CardHeader class="pb-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <Show
                          when={item.logo}
                          fallback={
                            <div class="size-9 rounded-lg bg-secondary flex items-center justify-center">
                              <RiBuildingsBuildingLine class="size-4 text-muted-foreground" />
                            </div>
                          }
                        >
                          <Image
                            src={item.logo}
                            alt={item.company}
                            class="size-9 rounded-lg object-contain bg-secondary/40 p-1"
                          />
                        </Show>
                        <div>
                          <CardTitle class="text-sm font-mono font-semibold">{item.company}</CardTitle>
                          <CardDescription class="flex items-center gap-1 text-[11px] mt-0.5">
                            <RiMapMapPin2Line class="size-3 shrink-0" />
                            {item.location}
                          </CardDescription>
                        </div>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-md mr-1">
                          {(item.positions || []).length} role{(item.positions || []).length !== 1 ? "s" : ""}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          class="size-7 cursor-pointer"
                          title="Edit"
                        >
                          <RiDesignEditLine class="size-3.5 text-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId() === item.id}
                          class="size-7 text-destructive hover:text-destructive cursor-pointer"
                          title="Delete"
                        >
                          <RiSystemDeleteBinLine class="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent class="pt-0">
                    <div class="space-y-2 border-t border-dashed border-border/60 pt-3">
                      <For each={item.positions || []}>
                        {(pos, idx) => (
                          <div class={`flex items-center justify-between text-xs font-mono ${idx() > 0 ? "border-t border-dashed border-border/40 pt-2" : ""}`}>
                            <div class="flex items-center gap-2">
                              <div class="size-1.5 rounded-full bg-primary/60 shrink-0" />
                              <span class="font-medium text-foreground">{pos.title}</span>
                              <span class="text-[10px] rounded-md bg-secondary px-1.5 py-0.5 text-muted-foreground">
                                {pos.type}
                              </span>
                            </div>
                            <span class="text-muted-foreground text-[11px] flex items-center gap-1 shrink-0">
                              <RiSystemTimeLine class="size-3" />
                              {pos.startDate} — {pos.endDate || "Present"}
                            </span>
                          </div>
                        )}
                      </For>
                    </div>
                  </CardContent>
                </Card>
              )}
            </For>
          </div>
        </div>
      </Show>
    </DashboardLayout>
  );
}
