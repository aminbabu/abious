import { createSignal, createResource, Show } from "solid-js";
import { useParams, useNavigate, A } from "@solidjs/router";
import * as v from "valibot";
import { createForm, Form, Field } from "@formisch/solid";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import MarkdownEditor from "~/components/dashboard/markdown-editor";
import {
  RiArrowsArrowLeftLine,
  RiArrowsArrowRightLine,
  RiSystemDeleteBinLine,
} from "solid-icons/ri";
import { api } from "~/lib/api";

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
  content: v.pipe(
    v.string("Content is required"),
    v.nonEmpty("Please write article content in Markdown"),
    v.minLength(20, "Content must be at least 20 characters")
  ),
});

export default function EditBlogPostPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [content, setContent] = createSignal("");
  const [contentError, setContentError] = createSignal<string | null>(null);
  const [isDraft, setIsDraft] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const form = createForm({
    schema: BlogPostSchema,
  });

  const [post] = createResource(async () => {
    try {
      const all = await api.blogs.getAllAdmin();
      const item = all.find((p) => p.id === params.id || p.slug === params.id);
      if (item) {
        setContent(item.content);
        setIsDraft(!!item.isDraft);
        return item;
      }
      return null;
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load post.");
      return null;
    }
  });

  const handleSubmit = async (values: v.InferOutput<typeof BlogPostSchema>) => {
    if (!content().trim() || content().trim().length < 20) {
      setContentError("Content must be at least 20 characters long");
      return;
    }
    setContentError(null);
    setErrorMessage(null);
    setSaving(true);

    try {
      const tags = (values.tagsInput || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await api.blogs.update(params.id, {
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
      setErrorMessage(err.message || "Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  const [deleting, setDeleting] = createSignal(false);

  const handleDelete = async () => {
    const item = post();
    if (!item) return;
    if (!confirm(`Permanently delete "${item.title}"?`)) return;
    setDeleting(true);
    try {
      await api.blogs.delete(item.id);
      navigate("/dashboard/blogs");
    } catch (err: any) {
      alert(err.message || "Failed to delete post.");
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title="Edit Blog Article"
      description={`Editing: ${params.id}`}
      actions={
        <Button
          type="button"
          variant="outline"
          disabled={deleting()}
          onClick={handleDelete}
          class="font-mono text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 cursor-pointer gap-1.5"
        >
          <RiSystemDeleteBinLine class="size-3.5" />
          <span>{deleting() ? "Deleting..." : "Delete Post"}</span>
        </Button>
      }
    >
      <div class="max-w-4xl space-y-6">
        <A
          href="/dashboard/blogs"
          class="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <RiArrowsArrowLeftLine class="size-3.5" />
          <span>Back to all posts</span>
        </A>

        <Show
          when={post()}
          fallback={
            <div class="py-12 text-center text-xs font-mono text-muted-foreground">
              Loading article data...
            </div>
          }
        >
          {(item) => (
            <Form
              of={form}
              onSubmit={handleSubmit}
              class="space-y-6"
            >
              <Card class="border-dashed bg-card/60">
                <CardHeader>
                  <CardTitle class="text-sm font-mono">Article Details</CardTitle>
                  <CardDescription>Update title, slug, and publication status.</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <Show when={errorMessage()}>
                    <div class="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                      {errorMessage()}
                    </div>
                  </Show>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field of={form} path={["title"]}>
                      {(field) => (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">Post Title *</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? item().title ?? ""}
                            class={`w-full rounded-md border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                              field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                            }`}
                          />
                          {field.errors && (
                            <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                          )}
                        </div>
                      )}
                    </Field>

                    <Field of={form} path={["slug"]}>
                      {(field) => (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">URL Slug *</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? item().slug ?? ""}
                            class={`w-full rounded-md border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
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

                  <Field of={form} path={["summary"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Summary / Abstract *</label>
                        <textarea
                          {...field.props}
                          rows={4}
                          value={field.input ?? item().summary ?? ""}
                          class={`w-full min-h-[96px] resize-y rounded-md border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${
                            field.errors ? "border-destructive focus:border-destructive focus:ring-destructive" : "border-input"
                          }`}
                        />
                        {field.errors && (
                          <p class="text-[11px] font-mono text-destructive">{field.errors[0]}</p>
                        )}
                      </div>
                    )}
                  </Field>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field of={form} path={["coverImage"]}>
                      {(field) => (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">Cover Image URL</label>
                          <input
                            {...field.props}
                            type="url"
                            value={field.input ?? item().coverImage ?? ""}
                            class="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      )}
                    </Field>

                    <Field of={form} path={["tagsInput"]}>
                      {(field) => (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">Tags (comma-separated)</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? (item().tags || []).join(", ") ?? ""}
                            class="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      )}
                    </Field>
                  </div>

                  <div class="pt-2">
                    <Checkbox
                      id="edit-draft"
                      checked={isDraft()}
                      onChange={setIsDraft}
                      label="Draft Status"
                      description="When checked, this article remains hidden as a draft. Uncheck to make it public."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Markdown Content Editor with Live Preview */}
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">Article Content *</h3>
                    <p class="text-[11px] text-muted-foreground">Full markdown editing with split-view and real-time rendered preview.</p>
                  </div>
                </div>
                <MarkdownEditor
                  value={content()}
                  onChange={(val) => {
                    setContent(val);
                    if (val.trim().length >= 20) setContentError(null);
                  }}
                  placeholder="Write your article in Markdown with headings, code blocks, and formatted text..."
                  rows={16}
                  required
                />
                {contentError() && (
                  <p class="text-[11px] font-mono text-destructive">{contentError()}</p>
                )}
              </div>

              <div class="flex items-center justify-end gap-3">
                <A href="/dashboard/blogs">
                  <Button type="button" variant="outline" class="font-mono text-xs cursor-pointer">
                    Cancel
                  </Button>
                </A>
                <Button
                  type="submit"
                  disabled={saving()}
                  class="font-mono text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{saving() ? "Saving changes..." : "Save Changes"}</span>
                  <Show when={!saving()}>
                    <RiArrowsArrowRightLine class="size-3.5" />
                  </Show>
                </Button>
              </div>
            </Form>
          )}
        </Show>
      </div>
    </DashboardLayout>
  );
}
