import { createSignal, createResource, Show } from "solid-js";
import { useParams, useNavigate, A } from "@solidjs/router";
import * as v from "valibot";
import { createForm, Form, Field, setInput } from "@formisch/solid";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Select } from "~/components/ui/select";
import MarkdownEditor from "~/components/dashboard/markdown-editor";
import ImageUploadDropzone from "~/components/dashboard/image-upload-dropzone";
import {
  RiArrowsArrowLeftLine,
  RiArrowsArrowRightLine,
  RiSystemDeleteBinLine,
} from "solid-icons/ri";
import { api } from "~/lib/api";

const CaseStudySchema = v.object({
  title: v.pipe(
    v.string("Title is required"),
    v.nonEmpty("Please enter project title"),
    v.minLength(3, "Title must be at least 3 characters")
  ),
  type: v.pipe(
    v.string("Category / Type is required"),
    v.nonEmpty("Please enter project category/type")
  ),
  description: v.pipe(
    v.string("Description is required"),
    v.nonEmpty("Please enter project description"),
    v.minLength(10, "Description must be at least 10 characters")
  ),
  banner: v.optional(v.string()),
  liveUrl: v.optional(v.string()),
  stackInput: v.optional(v.string()),
});

export default function EditCaseStudyPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [body, setBody] = createSignal("");
  const [bodyError, setBodyError] = createSignal<string | null>(null);
  const [isPublished, setIsPublished] = createSignal(true);
  const [saving, setSaving] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm({
    schema: CaseStudySchema,
  });

  const [item] = createResource(async () => {
    try {
      const data = await api.caseStudies.get(params.id);
      if (data) {
        setBody(data.body || "");
        setIsPublished(true);
        return data;
      }
      return null;
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load case study.");
      return null;
    }
  });

  const handleSubmit = async (values: v.InferOutput<typeof CaseStudySchema>) => {
    if (!body().trim() || body().trim().length < 20) {
      setBodyError("Case study markdown content must be at least 20 characters long");
      return;
    }
    setBodyError(null);
    setErrorMessage(null);
    setSaving(true);

    try {
      const stack = (values.stackInput || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await api.caseStudies.update(params.id, {
        title: values.title.trim(),
        description: values.description.trim(),
        banner: values.banner?.trim() || "/images/placeholder.jpg",
        type: values.type.trim(),
        liveURL: values.liveUrl?.trim() || undefined,
        stack,
        body: body().trim(),
        isPublished: isPublished(),
      });

      navigate("/dashboard/case-studies");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update case study.");
    } finally {
      setSaving(false);
    }
  };

  const [deleting, setDeleting] = createSignal(false);

  const handleDelete = async () => {
    const study = item();
    if (!study) return;
    const title = study.data?.title || study.id;
    if (!confirm(`Permanently delete case study "${title}"?`)) return;
    setDeleting(true);
    try {
      await api.caseStudies.delete(study.id);
      navigate("/dashboard/case-studies");
    } catch (err: any) {
      alert(err.message || "Failed to delete case study.");
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title="Edit Case Study"
      description={`Editing: ${params.id}`}
      actions={
        <div class="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={deleting()}
            onClick={handleDelete}
            class="font-mono text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 cursor-pointer gap-1.5"
          >
            <RiSystemDeleteBinLine class="size-3.5" />
            <span>{deleting() ? "Deleting..." : "Delete"}</span>
          </Button>
          <A href="/dashboard/case-studies">
            <Button type="button" variant="outline" class="font-mono text-xs cursor-pointer">
              Cancel
            </Button>
          </A>
          <Button
            type="button"
            disabled={saving()}
            onClick={() => {
              const formEl = document.getElementById("edit-case-study-form") as HTMLFormElement | null;
              if (formEl) formEl.requestSubmit();
            }}
            class="font-mono text-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>{saving() ? "Saving Changes..." : "Save Changes"}</span>
            <Show when={!saving()}>
              <RiArrowsArrowRightLine class="size-3.5" />
            </Show>
          </Button>
        </div>
      }
    >
      <div class="space-y-6">
        <A
          href="/dashboard/case-studies"
          class="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <RiArrowsArrowLeftLine class="size-3.5" />
          <span>Back to all case studies</span>
        </A>

        <Show
          when={item()}
          fallback={
            <div class="py-12 text-center text-xs font-mono text-muted-foreground">
              Loading case study details...
            </div>
          }
        >
          {(cs) => (
            <Form
              id="edit-case-study-form"
              of={form}
              onSubmit={handleSubmit}
              class="space-y-6"
            >
              <Show when={errorMessage()}>
                <div class="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                  {errorMessage()}
                </div>
              </Show>

              {/* 2-Column Studio Grid: Left Main Writing Area, Right Sticky Metadata Rail */}
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* ── Left Column: Main Writing Canvas (8 cols) ── */}
                <div class="lg:col-span-8 space-y-6">
                  <Card class="border-dashed bg-card/60">
                    <CardHeader>
                      <CardTitle class="text-sm font-mono">Project Specification</CardTitle>
                      <CardDescription>Update metadata and classification tags.</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field of={form} path={["title"]}>
                          {(field) => (
                            <div class="space-y-1.5">
                              <label class="text-xs font-mono font-medium text-foreground">Project Title *</label>
                              <input
                                {...field.props}
                                type="text"
                                value={field.input ?? cs().data?.title ?? ""}
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

                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-muted-foreground">Slug ID</label>
                          <input
                            type="text"
                            disabled
                            value={cs().id}
                            class="w-full h-9 rounded-md border border-input bg-muted/40 px-3 text-xs font-mono text-muted-foreground shadow-xs outline-none cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <Field of={form} path={["description"]}>
                        {(field) => (
                          <div class="space-y-1.5">
                            <label class="text-xs font-mono font-medium text-foreground">Summary *</label>
                            <textarea
                              {...field.props}
                              rows={3}
                              value={field.input ?? cs().data?.description ?? ""}
                              class={`w-full min-h-[90px] resize-y rounded-md border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                                field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                              }`}
                            />
                            {field.errors && (
                              <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                            )}
                          </div>
                        )}
                      </Field>
                    </CardContent>
                  </Card>

                  {/* Markdown Project Case Study Content with Live Preview */}
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">Case Study Content *</h3>
                        <p class="text-[11px] text-muted-foreground">Detailed architecture, challenge, and results breakdown in Markdown.</p>
                      </div>
                    </div>
                    <MarkdownEditor
                      value={body()}
                      onChange={(val) => {
                        setBody(val);
                        if (val.trim().length >= 20) setBodyError(null);
                      }}
                      placeholder="Write detailed background, architecture, and results in Markdown..."
                      rows={20}
                      required
                    />
                    {bodyError() && (
                      <p class="text-[11px] font-mono text-destructive">{bodyError()}</p>
                    )}
                  </div>
                </div>

                {/* ── Right Column: Sticky Publishing & Metadata Rail (4 cols) ── */}
                <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-0">
                  <Card class="border-dashed bg-card/60">
                    <CardHeader>
                      <CardTitle class="text-sm font-mono">Publishing Status</CardTitle>
                      <CardDescription>Manage visibility and update case study.</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Publication Status *</label>
                        <Select
                          value={isPublished() ? "published" : "draft"}
                          onChange={(val) => setIsPublished(val === "published")}
                          options={[
                            { value: "published", label: "Published (Live on portfolio)", badge: "Live" },
                            { value: "draft", label: "Draft (Hidden from showcase)", badge: "Hidden" },
                          ]}
                        />
                        <p class="text-[11px] font-mono text-muted-foreground">
                          {isPublished()
                            ? "Currently configured as published: featured publicly."
                            : "Currently configured as draft: hidden from public view."}
                        </p>
                      </div>

                      <div class="pt-2 flex flex-col gap-2">
                        <Button
                          type="submit"
                          disabled={saving()}
                          class="w-full font-mono text-xs cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>{saving() ? "Saving Changes..." : "Save Changes"}</span>
                          <Show when={!saving()}>
                            <RiArrowsArrowRightLine class="size-3.5" />
                          </Show>
                        </Button>
                        <A href="/dashboard/case-studies" class="w-full">
                          <Button type="button" variant="outline" class="w-full font-mono text-xs cursor-pointer">
                            Cancel
                          </Button>
                        </A>
                      </div>
                    </CardContent>
                  </Card>

                  <Card class="border-dashed bg-card/60">
                    <CardHeader>
                      <CardTitle class="text-sm font-mono">Category & Media</CardTitle>
                      <CardDescription>Classification, banner image and links.</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                      <Field of={form} path={["type"]}>
                        {(field) => (
                          <div class="space-y-1.5">
                            <label class="text-xs font-mono font-medium text-foreground">Project Category / Type *</label>
                            <input
                              {...field.props}
                              type="text"
                              value={field.input ?? cs().data?.type ?? ""}
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

                      <Field of={form} path={["liveUrl"]}>
                        {(field) => (
                          <div class="space-y-1.5">
                            <label class="text-xs font-mono font-medium text-foreground">Live Deployment URL</label>
                            <input
                              {...field.props}
                              type="url"
                              value={field.input ?? cs().data?.liveURL ?? ""}
                              class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        )}
                      </Field>

                      <Field of={form} path={["banner"]}>
                        {(field) => (
                          <ImageUploadDropzone
                            label="Banner Image"
                            description="Visual showcase banner for cards and hero section"
                            value={field.input ?? cs().data?.banner ?? ""}
                            placeholder="https://images.unsplash.com/..."
                            onChange={(url) => {
                              setInput(form, {
                                path: ["banner"],
                                input: url,
                              });
                            }}
                          />
                        )}
                      </Field>

                      <Field of={form} path={["stackInput"]}>
                        {(field) => (
                          <div class="space-y-1.5">
                            <label class="text-xs font-mono font-medium text-foreground">Tech Stack (comma-separated)</label>
                            <input
                              {...field.props}
                              type="text"
                              value={field.input ?? (cs().data?.stack || []).join(", ") ?? ""}
                              class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        )}
                      </Field>

                    </CardContent>
                  </Card>
                </div>
              </div>
            </Form>
          )}
        </Show>
      </div>
    </DashboardLayout>
  );
}
