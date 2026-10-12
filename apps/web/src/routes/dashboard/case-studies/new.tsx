import { createSignal, Show } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import * as v from "valibot";
import { createForm, Form, Field } from "@formisch/solid";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import MarkdownEditor from "~/components/dashboard/markdown-editor";
import { RiArrowsArrowLeftLine, RiArrowsArrowRightLine } from "solid-icons/ri";
import { api } from "~/lib/api";

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
    >
      <div class="max-w-4xl space-y-6">
        <A
          href="/dashboard/case-studies"
          class="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <RiArrowsArrowLeftLine class="size-3.5" />
          <span>Back to all case studies</span>
        </A>

        <Form of={form} onSubmit={handleSubmit} class="space-y-6">
          <Card class="border-dashed bg-card/60">
            <CardHeader>
              <CardTitle class="text-sm font-mono">Project Specification</CardTitle>
              <CardDescription>Enter project title, identifier, and description.</CardDescription>
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
                        value={field.input ?? ""}
                        placeholder="e.g. Fintech Mobile Platform"
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

                <Field of={form} path={["id"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono font-medium text-foreground">Slug ID *</label>
                      <input
                        {...field.props}
                        type="text"
                        value={field.input ?? ""}
                        placeholder="fintech-mobile-platform"
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
                <Field of={form} path={["type"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono font-medium text-foreground">Project Category / Type *</label>
                      <input
                        {...field.props}
                        type="text"
                        value={field.input ?? ""}
                        placeholder="e.g. Web App, Mobile, Open Source"
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

                <Field of={form} path={["liveUrl"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono font-medium text-foreground">Live Deployment URL (optional)</label>
                      <input
                        {...field.props}
                        type="url"
                        value={field.input ?? ""}
                        placeholder="https://..."
                        class="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
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
                        value={field.input ?? ""}
                        placeholder="https://images.unsplash.com/..."
                        class="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
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
                        class="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
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
                      rows={4}
                      value={field.input ?? ""}
                      placeholder="Summary for preview card..."
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
                  id="published"
                  checked={isPublished()}
                  onChange={setIsPublished}
                  label="Publish Immediately"
                  description="Feature this case study publicly on the portfolio immediately upon saving."
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
              disabled={loading()}
              class="font-mono text-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>{loading() ? "Saving Case Study..." : "Create Case Study"}</span>
              <Show when={!loading()}>
                <RiArrowsArrowRightLine class="size-3.5" />
              </Show>
            </Button>
          </div>
        </Form>
      </div>
    </DashboardLayout>
  );
}
