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

const BlogPostSchema = v.object({
  title: v.pipe(
    v.string("Title is required"),
    v.nonEmpty("Please enter post title"),
    v.minLength(3, "Title must be at least 3 characters")
  ),
  slug: v.pipe(
    v.string("Slug is required"),
    v.nonEmpty("Please enter URL slug"),
    v.minLength(2, "Slug must be at least 2 characters")
  ),
  summary: v.pipe(
    v.string("Summary is required"),
    v.nonEmpty("Please enter a summary"),
    v.minLength(10, "Summary must be at least 10 characters")
  ),
  coverImage: v.optional(v.string()),
  tagsInput: v.optional(v.string()),
  isDraft: v.optional(v.boolean()),
  content: v.pipe(
    v.string("Content is required"),
    v.nonEmpty("Please write article content in Markdown"),
    v.minLength(20, "Content must be at least 20 characters")
  ),
});

export default function NewBlogPostPage() {
  const navigate = useNavigate();
  const [content, setContent] = createSignal("");
  const [contentError, setContentError] = createSignal<string | null>(null);
  const [isDraft, setIsDraft] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  // Track if user manually modified the slug to stop automatically overriding it
  const [isSlugCustomized, setIsSlugCustomized] = createSignal(false);

  const form = createForm({
    schema: BlogPostSchema,
    initialValues: {
      title: "",
      slug: "",
      summary: "",
      coverImage: "",
      tagsInput: "",
      content: "",
      isDraft: false,
    },
  });

  const generateSlugFromTitle = (titleValue?: string) => {
    const raw = titleValue ?? (form as any).stores?.title?.input ?? "";
    const generated = slugify(raw);
    setInput(form, {
      path: ["slug"],
      input: generated,
    });
  };

  const handleSubmit = async (values: v.InferOutput<typeof BlogPostSchema>) => {
    // Validate markdown content
    if (!content().trim() || content().trim().length < 20) {
      setContentError("Content must be at least 20 characters long");
      return;
    }
    setContentError(null);
    setErrorMessage(null);
    setLoading(true);

    try {
      const tags = (values.tagsInput || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await api.blogs.create({
        title: values.title.trim(),
        slug: values.slug.trim(),
        summary: values.summary.trim(),
        content: content().trim(),
        coverImage: values.coverImage?.trim() || undefined,
        tags,
        isDraft: isDraft(),
      });

      navigate("/dashboard/blogs");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create Blog Article"
      description="Author and publish a technical or design article"
      actions={
        <div class="flex items-center gap-2">
          <A href="/dashboard/blogs">
            <Button type="button" variant="outline" class="font-mono text-xs cursor-pointer">
              Cancel
            </Button>
          </A>
          <Button
            type="button"
            disabled={loading()}
            onClick={() => {
              const formEl = document.getElementById("blog-post-form") as HTMLFormElement | null;
              if (formEl) formEl.requestSubmit();
            }}
            class="font-mono text-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>{loading() ? "Saving Article..." : isDraft() ? "Save as Draft" : "Publish Article"}</span>
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
            href="/dashboard/blogs"
            class="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <RiArrowsArrowLeftLine class="size-3.5" />
            <span>Back to all posts</span>
          </A>
        </div>

        <Form id="blog-post-form" of={form} onSubmit={handleSubmit} class="space-y-6">
          <Show when={errorMessage()}>
            <div class="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
              {errorMessage()}
            </div>
          </Show>

          {/* 2-Column Studio Grid: Left Main Writing Area, Right Sticky Metadata Rail */}
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── Left Column: Main Writing Canvas (8 cols) ── */}
            <div class="lg:col-span-8 space-y-6">
              {/* Primary Content Card */}
              <Card class="border-dashed bg-card/60">
                <CardHeader>
                  <CardTitle class="text-sm font-mono">Article Title & Abstract</CardTitle>
                  <CardDescription>The core heading and preview summary shown in article listings.</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <Field of={form} path={["title"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Post Title *</label>
                        <input
                          {...field.props}
                          type="text"
                          value={field.input ?? ""}
                          onInput={(e) => {
                            const val = e.currentTarget.value;
                            // If user hasn't explicitly customized slug, auto sync it from title
                            if (!isSlugCustomized()) {
                              setInput(form, {
                                path: ["slug"],
                                input: slugify(val),
                              });
                            }
                          }}
                          placeholder="e.g. Modern Full-Stack NestJS & SolidStart"
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

                  <Field of={form} path={["summary"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Summary / Abstract *</label>
                        <textarea
                          {...field.props}
                          rows={3}
                          value={field.input ?? ""}
                          placeholder="Brief synopsis for card previews and meta tags..."
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

              {/* Markdown Content Editor with Live Preview */}
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">Article Body Content *</h3>
                    <p class="text-[11px] text-muted-foreground">Write your full article with headings, code blocks, and markdown syntax.</p>
                  </div>
                </div>
                <MarkdownEditor
                  value={content()}
                  onChange={(val) => {
                    setContent(val);
                    if (val.trim().length >= 20) setContentError(null);
                  }}
                  placeholder="Write your article in Markdown with headings, code blocks, and formatted text..."
                  rows={20}
                  required
                />
                {contentError() && (
                  <p class="text-[11px] font-mono text-destructive">{contentError()}</p>
                )}
              </div>
            </div>

            {/* ── Right Column: Sticky Publishing & Metadata Rail (4 cols) ── */}
            <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-0">
              {/* Publishing & Visibility Settings */}
              <Card class="border-dashed bg-card/60">
                <CardHeader>
                  <CardTitle class="text-sm font-mono">Publishing Status</CardTitle>
                  <CardDescription>Control publication state and visibility.</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-1.5">
                    <label class="text-xs font-mono font-medium text-foreground">Post Status *</label>
                    <Select
                      id="blog-status"
                      value={isDraft() ? "draft" : "published"}
                      onChange={(val) => setIsDraft(val === "draft")}
                      options={[
                        {
                          value: "published",
                          label: "Published",
                          badge: "Live",
                          description: "Visible on public portfolio feed",
                        },
                        {
                          value: "draft",
                          label: "Draft",
                          badge: "Hidden",
                          description: "Private, hidden from visitors",
                        },
                      ]}
                    />
                    <p class="text-[11px] font-mono text-muted-foreground">
                      {isDraft()
                        ? "Configured as draft: hidden from visitors."
                        : "Configured as published: visible to all visitors."}
                    </p>
                  </div>

                  <div class="pt-2 flex flex-col gap-2">
                    <Button
                      type="submit"
                      disabled={loading()}
                      class="w-full font-mono text-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>{loading() ? "Saving..." : isDraft() ? "Save as Draft" : "Publish Article"}</span>
                      <Show when={!loading()}>
                        <RiArrowsArrowRightLine class="size-3.5" />
                      </Show>
                    </Button>
                    <A href="/dashboard/blogs" class="w-full">
                      <Button type="button" variant="outline" class="w-full font-mono text-xs cursor-pointer">
                        Cancel
                      </Button>
                    </A>
                  </div>
                </CardContent>
              </Card>

              {/* Taxonomy, URL Slug & Cover Media */}
              <Card class="border-dashed bg-card/60">
                <CardHeader>
                  <CardTitle class="text-sm font-mono">URL & Media</CardTitle>
                  <CardDescription>SEO identifier and cover image.</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <Field of={form} path={["slug"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                          <label class="text-xs font-mono font-medium text-foreground">URL Slug *</label>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSlugCustomized(false);
                              generateSlugFromTitle();
                            }}
                            title="Regenerate slug from current title"
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
                            // User edited slug directly, don't auto-override unless they click Generate
                            setIsSlugCustomized(true);
                          }}
                          placeholder="modern-fullstack-nestjs-solidstart"
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

                  {/* Dropzone Image Upload */}
                  <Field of={form} path={["coverImage"]}>
                    {(field) => (
                      <ImageUploadDropzone
                        label="Cover Image"
                        description="Featured banner image for previews & social sharing"
                        value={field.input ?? ""}
                        onChange={(url) => {
                          setInput(form, {
                            path: ["coverImage"],
                            input: url,
                          });
                        }}
                      />
                    )}
                  </Field>

                  <Field of={form} path={["tagsInput"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Tags (comma-separated)</label>
                        <input
                          {...field.props}
                          type="text"
                          value={field.input ?? ""}
                          placeholder="nestjs, solidstart, typescript"
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

