import { createSignal, Show } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
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
  RiDesignMagicLine,
} from "solid-icons/ri";
import { api } from "~/lib/api";
import { slugify } from "~/lib/utils";

const CaseStudySchema = v.object({
  title: v.pipe(
    v.string("Title is required"),
    v.nonEmpty("Please enter project title"),
    v.minLength(3, "Title must be at least 3 characters")
  ),
  id: v.pipe(
    v.string("Slug ID is required"),
    v.nonEmpty("Please enter slug ID"),
    v.minLength(2, "Slug ID must be at least 2 characters")
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

export default function NewCaseStudyPage() {
  const navigate = useNavigate();
  const [body, setBody] = createSignal("");
  const [bodyError, setBodyError] = createSignal<string | null>(null);
  const [isPublished, setIsPublished] = createSignal(true);
  const [loading, setLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  // Track if user manually modified slug ID
  const [isSlugCustomized, setIsSlugCustomized] = createSignal(false);

  const form = createForm({
    schema: CaseStudySchema,
    initialValues: {
      title: "",
      id: "",
      type: "Client Project",
      description: "",
      banner: "",
      liveUrl: "",
      stackInput: "",
    },
  });

  const generateSlugFromTitle = (titleValue?: string) => {
    const raw = titleValue ?? (form as any).stores?.title?.input ?? "";
    const generated = slugify(raw);
    setInput(form, {
      path: ["id"],
      input: generated,
    });
  };

  const handleSubmit = async (values: v.InferOutput<typeof CaseStudySchema>) => {
    if (!body().trim() || body().trim().length < 20) {
      setBodyError("Case study markdown content must be at least 20 characters long");
      return;
    }
    setBodyError(null);
    setErrorMessage(null);
    setLoading(true);

    try {
      const stack = (values.stackInput || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await api.caseStudies.create({
        id: values.id.trim(),
        title: values.title.trim(),
        description: values.description.trim(),
        banner: values.banner?.trim() || "/images/placeholder.jpg",
        type: values.type.trim(),
        liveUrl: values.liveUrl?.trim() || undefined,
        stack,
        body: body().trim(),
        isPublished: isPublished(),
      });

      navigate("/dashboard/case-studies");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create case study.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create Case Study"
      description="Document and publish a project case study"
      actions={
        <div class="flex items-center gap-2">
          <A href="/dashboard/case-studies">
            <Button type="button" variant="outline" class="font-mono text-xs cursor-pointer">
              Cancel
            </Button>
          </A>
          <Button
            type="button"
            disabled={loading()}
            onClick={() => {
              const formEl = document.getElementById("new-case-study-form") as HTMLFormElement | null;
              if (formEl) formEl.requestSubmit();
            }}
            class="font-mono text-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>{loading() ? "Saving Case Study..." : "Create Case Study"}</span>
            <Show when={!loading()}>
              <RiArrowsArrowRightLine class="size-3.5" />
            </Show>
          </Button>
        </div>
      }
    >
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <A
            href="/dashboard/case-studies"
            class="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <RiArrowsArrowLeftLine class="size-3.5" />
            <span>Back to all case studies</span>
          </A>
        </div>

        <Form id="new-case-study-form" of={form} onSubmit={handleSubmit} class="space-y-6">
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
                  <CardDescription>Enter project title, slug ID, and preview summary.</CardDescription>
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
                            value={field.input ?? ""}
                            onInput={(e) => {
                              const val = e.currentTarget.value;
                              // Auto generate slug if user hasn't explicitly customized
                              if (!isSlugCustomized()) {
                                setInput(form, {
                                  path: ["id"],
                                  input: slugify(val),
                                });
                              }
                            }}
                            placeholder="e.g. Fintech Mobile Platform"
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

                    <Field of={form} path={["id"]}>
                      {(field) => (
                        <div class="space-y-1.5">
                          <div class="flex items-center justify-between">
                            <label class="text-xs font-mono font-medium text-foreground">Slug ID *</label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsSlugCustomized(false);
                                generateSlugFromTitle();
                              }}
                              title="Regenerate slug ID from current title"
                              class="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline cursor-pointer transition-colors"
                            >
                              <RiDesignMagicLine class="size-3" />
                              <span>Generate</span>
                            </button>
                          </div>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? ""}
                            onInput={() => {
                              setIsSlugCustomized(true);
                            }}
                            placeholder="fintech-mobile-platform"
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

                  <Field of={form} path={["description"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Summary / Abstract *</label>
                        <textarea
                          {...field.props}
                          rows={3}
                          value={field.input ?? ""}
                          placeholder="Summary for preview card..."
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
              {/* Publishing Status */}
              <Card class="border-dashed bg-card/60">
                <CardHeader>
                  <CardTitle class="text-sm font-mono">Publishing Status</CardTitle>
                  <CardDescription>Portfolio feature status.</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-mono font-medium text-foreground">Publication Status *</label>
                    <Select
                      id="case-study-status"
                      value={isPublished() ? "published" : "draft"}
                      onChange={(val) => setIsPublished(val === "published")}
                      options={[
                        {
                          value: "published",
                          label: "Published",
                          badge: "Live",
                          description: "Featured publicly in case studies portfolio",
                        },
                        {
                          value: "draft",
                          label: "Draft",
                          badge: "Hidden",
                          description: "Private, excluded from showcase",
                        },
                      ]}
                    />
                    <p class="text-[11px] font-mono text-muted-foreground">
                      {isPublished()
                        ? "Configured as published: featured publicly."
                        : "Configured as draft: hidden from public view."}
                    </p>
                  </div>

                  <div class="pt-2 flex flex-col gap-2">
                    <Button
                      type="submit"
                      disabled={loading()}
                      class="w-full font-mono text-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>{loading() ? "Saving Case Study..." : "Create Case Study"}</span>
                      <Show when={!loading()}>
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

              {/* Taxonomy & Assets */}
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
                          value={field.input ?? ""}
                          placeholder="e.g. Web App, Mobile, Open Source"
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
                        <label class="text-xs font-mono font-medium text-foreground">Live Deployment URL (optional)</label>
                        <input
                          {...field.props}
                          type="url"
                          value={field.input ?? ""}
                          placeholder="https://..."
                          class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    )}
                  </Field>

                  {/* Banner Image Dropzone */}
                  <Field of={form} path={["banner"]}>
                    {(field) => (
                      <ImageUploadDropzone
                        label="Project Banner Image"
                        description="Visual showcase banner for cards and hero section"
                        value={field.input ?? ""}
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
                          value={field.input ?? ""}
                          placeholder="Next.js, NestJS, TailwindCSS, PostgreSQL"
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
      </div>
    </DashboardLayout>
  );
}

