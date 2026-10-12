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
        <Button
          type="button"
          variant="outline"
          disabled={deleting()}
          onClick={handleDelete}
          class="font-mono text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 cursor-pointer gap-1.5"
        >
          <RiSystemDeleteBinLine class="size-3.5" />
          <span>{deleting() ? "Deleting..." : "Delete Case Study"}</span>
        </Button>
      }
    >
      <div class="max-w-4xl space-y-6">
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
            <Form of={form} onSubmit={handleSubmit} class="space-y-6">
              <Card class="border-dashed bg-card/60">
                <CardHeader>
                  <CardTitle class="text-sm font-mono">Project Specification</CardTitle>
                  <CardDescription>Update metadata and classification tags.</CardDescription>
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
                          <label class="text-xs font-mono font-medium text-foreground">Project Title *</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? cs().data?.title ?? ""}
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

                    <Field of={form} path={["type"]}>
                      {(field) => (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">Project Category / Type *</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? cs().data?.type ?? ""}
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

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field of={form} path={["banner"]}>
                      {(field) => (
                        <div class="space-y-1.5">
                          <label class="text-xs font-mono font-medium text-foreground">Banner Image URL</label>
                          <input
                            {...field.props}
                            type="text"
                            value={field.input ?? cs().data?.banner ?? ""}
                            class="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
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
                            class="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      )}
                    </Field>
                  </div>

                  <Field of={form} path={["stackInput"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Tech Stack (comma-separated)</label>
                        <input
                          {...field.props}
                          type="text"
                          value={field.input ?? (cs().data?.stack || []).join(", ") ?? ""}
                          class="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    )}
                  </Field>

                  <Field of={form} path={["description"]}>
                    {(field) => (
                      <div class="space-y-1.5">
                        <label class="text-xs font-mono font-medium text-foreground">Summary *</label>
                        <textarea
                          {...field.props}
                          rows={4}
                          value={field.input ?? cs().data?.description ?? ""}
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

                  <div class="pt-2">
                    <Checkbox
                      id="edit-published"
                      checked={isPublished()}
                      onChange={setIsPublished}
                      label="Published Status"
                      description="Keep this case study public and visible on your portfolio."
                    />
                  </div>
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
                  rows={16}
                  required
                />
                {bodyError() && (
                  <p class="text-[11px] font-mono text-destructive">{bodyError()}</p>
                )}
              </div>

              <div class="flex items-center justify-end gap-3">
                <A href="/dashboard/case-studies">
                  <Button type="button" variant="outline" class="font-mono text-xs cursor-pointer">
                    Cancel
                  </Button>
                </A>
                <Button
                  type="submit"
                  disabled={saving()}
                  class="font-mono text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{saving() ? "Saving Changes..." : "Save Changes"}</span>
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
