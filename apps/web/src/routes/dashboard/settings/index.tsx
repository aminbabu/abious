import { createSignal, createResource, Show, For, createEffect } from "solid-js";
import * as v from "valibot";
import { createForm, Form, Field, setInput } from "@formisch/solid";
import {
  RiDeviceSaveLine,
  RiSystemAddLine,
  RiSystemDeleteBinLine,
  RiSystemCheckLine,
  RiSystemAlertLine,
  RiEditorLink,
} from "solid-icons/ri";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api, ISiteSettings } from "~/lib/api";

const SocialItemSchema = v.object({
  id: v.string(),
  title: v.pipe(
    v.string("Social title is required"),
    v.nonEmpty("Title required")
  ),
  url: v.pipe(
    v.string("Social URL is required"),
    v.nonEmpty("URL required"),
    v.url("Must be a valid URL")
  ),
});

const SiteSettingsSchema = v.object({
  siteName: v.pipe(
    v.string("Site name is required"),
    v.nonEmpty("Please enter author or site name"),
    v.minLength(2, "Name must be at least 2 characters")
  ),
  siteTitle: v.pipe(
    v.string("Site title is required"),
    v.nonEmpty("Please enter site title / SEO headline"),
    v.minLength(3, "Title must be at least 3 characters")
  ),
  bio: v.pipe(
    v.string("Bio is required"),
    v.nonEmpty("Please enter an author bio or summary"),
    v.minLength(10, "Bio should be at least 10 characters")
  ),
  email: v.pipe(
    v.string("Contact email is required"),
    v.nonEmpty("Please enter contact email"),
    v.email("Please enter a valid email address")
  ),
  phone: v.optional(v.string()),
  resumeUrl: v.optional(v.string()),
  calcomLink: v.optional(v.string()),
});

type SiteSettingsFormInput = v.InferOutput<typeof SiteSettingsSchema>;

export default function SettingsAdminPage() {
  const [socials, setSocials] = createSignal<Array<{ id: string; title: string; url: string }>>([]);
  const [saving, setSaving] = createSignal(false);
  const [statusMessage, setStatusMessage] = createSignal<{ type: "success" | "error"; text: string } | null>(null);

  const form = createForm({
    schema: SiteSettingsSchema,
    initialValues: {
      siteName: "",
      siteTitle: "",
      bio: "",
      email: "",
      phone: "",
      resumeUrl: "",
      calcomLink: "",
    },
  });

  const [settings, { refetch }] = createResource(async () => {
    try {
      const data = await api.settings.getPublic();
      if (data) {
        setInput(form, { path: ["siteName"], input: data.siteName || "" });
        setInput(form, { path: ["siteTitle"], input: data.siteTitle || "" });
        setInput(form, { path: ["bio"], input: data.bio || "" });
        setInput(form, { path: ["email"], input: data.email || "" });
        setInput(form, { path: ["phone"], input: data.phone || "" });
        setInput(form, { path: ["resumeUrl"], input: data.resumeUrl || "" });
        setInput(form, { path: ["calcomLink"], input: data.calcomLink || "" });
        setSocials(Array.isArray(data.socials) ? data.socials : []);
      }
      return data;
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to load site settings." });
      return null;
    }
  });

  const handleAddSocial = () => {
    setSocials([
      ...socials(),
      { id: `social-${Date.now()}`, title: "", url: "https://" },
    ]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocials(socials().filter((_, i) => i !== index));
  };

  const handleSocialChange = (index: number, field: "title" | "url", val: string) => {
    const updated = [...socials()];
    updated[index] = { ...updated[index], [field]: val };
    setSocials(updated);
  };

  const handleSubmit = async (values: SiteSettingsFormInput) => {
    setStatusMessage(null);
    setSaving(true);

    // Validate social items
    const invalidSocial = socials().find((s) => !s.title.trim() || !s.url.trim());
    if (invalidSocial) {
      setStatusMessage({
        type: "error",
        text: "Please provide both title and valid URL for all social platform links.",
      });
      setSaving(false);
      return;
    }

    const payload: ISiteSettings = {
      siteName: values.siteName.trim(),
      siteTitle: values.siteTitle.trim(),
      bio: values.bio.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || "",
      resumeUrl: values.resumeUrl?.trim() || "",
      calcomLink: values.calcomLink?.trim() || "",
      socials: socials().map((s) => ({
        id: s.id || `social-${Date.now()}`,
        title: s.title.trim(),
        url: s.url.trim(),
      })),
    };

    try {
      await api.settings.update("public", payload);
      setStatusMessage({ type: "success", text: "Site settings updated successfully!" });
      refetch();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to update settings." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Site Settings"
      description="Configure public metadata, bio, contact credentials, and Cal.com URL"
    >
      <div class="max-w-4xl space-y-6">
        <Show when={statusMessage()}>
          <div
            class={`flex items-center gap-2 rounded-md border p-3 text-xs font-mono shadow-xs ${
              statusMessage()?.type === "success"
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
                : "border-destructive/50 bg-destructive/10 text-destructive"
            }`}
          >
            <Show
              when={statusMessage()?.type === "success"}
              fallback={<RiSystemAlertLine class="size-4 shrink-0" />}
            >
              <RiSystemCheckLine class="size-4 shrink-0" />
            </Show>
            <span>{statusMessage()?.text}</span>
          </div>
        </Show>

        <Form of={form} onSubmit={handleSubmit} class="space-y-6">
          {/* General Portfolio Info */}
          <Card class="border-dashed bg-card/60">
            <CardHeader>
              <CardTitle class="text-sm font-mono">General Profile</CardTitle>
              <CardDescription>Brand identity and hero introduction text.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field of={form} path={["siteName"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono font-medium text-foreground">
                        Site / Author Name *
                      </label>
                      <input
                        {...field.props}
                        type="text"
                        value={field.input ?? settings()?.siteName ?? ""}
                        placeholder="Amin Babu"
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

                <Field of={form} path={["siteTitle"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono font-medium text-foreground">
                        Site Title & SEO Headline *
                      </label>
                      <input
                        {...field.props}
                        type="text"
                        value={field.input ?? settings()?.siteTitle ?? ""}
                        placeholder="Full Stack Web Developer & Tech Enthusiast"
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

              <Field of={form} path={["bio"]}>
                {(field) => (
                  <div class="space-y-1.5">
                    <label class="text-xs font-mono font-medium text-foreground">
                      Author Bio / Summary *
                    </label>
                    <textarea
                      {...field.props}
                      rows={4}
                      value={field.input ?? settings()?.bio ?? ""}
                      placeholder="Expert in crafting responsive web applications..."
                      class={`w-full min-h-[100px] resize-y rounded-md border bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed ${
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

          {/* Contact & Integrations */}
          <Card class="border-dashed bg-card/60">
            <CardHeader>
              <CardTitle class="text-sm font-mono">Contact & Integrations</CardTitle>
              <CardDescription>Inquiry routing, resume path, and Cal.com schedule link.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field of={form} path={["email"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono font-medium text-foreground">
                        Contact Email *
                      </label>
                      <input
                        {...field.props}
                        type="email"
                        value={field.input ?? settings()?.email ?? ""}
                        placeholder="amin.babu.bd@gmail.com"
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

                <Field of={form} path={["phone"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono font-medium text-foreground">
                        Phone Number
                      </label>
                      <input
                        {...field.props}
                        type="text"
                        value={field.input ?? settings()?.phone ?? ""}
                        placeholder="+8801621990178"
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

                <Field of={form} path={["resumeUrl"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono font-medium text-foreground">
                        Resume File URL
                      </label>
                      <input
                        {...field.props}
                        type="text"
                        value={field.input ?? settings()?.resumeUrl ?? ""}
                        placeholder="/resume/Resume - Amin Babu.pdf"
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

                <Field of={form} path={["calcomLink"]}>
                  {(field) => (
                    <div class="space-y-1.5">
                      <label class="text-xs font-mono font-medium text-foreground">
                        Cal.com Event Link
                      </label>
                      <input
                        {...field.props}
                        type="text"
                        value={field.input ?? settings()?.calcomLink ?? ""}
                        placeholder="e.g. aminbabu/30min"
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
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card class="border-dashed bg-card/60">
            <CardHeader class="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle class="text-sm font-mono">Social Platforms</CardTitle>
                <CardDescription>Links shown across the header, footer, and mobile drawer.</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSocial}
                class="font-mono text-xs cursor-pointer flex items-center gap-1"
              >
                <RiSystemAddLine class="size-3.5" />
                <span>Add Social</span>
              </Button>
            </CardHeader>
            <CardContent class="space-y-3">
              <Show
                when={socials().length > 0}
                fallback={
                  <div class="p-4 text-center border border-dashed border-border/60 rounded-md text-xs font-mono text-muted-foreground">
                    No social links configured. Click "Add Social" above to add one.
                  </div>
                }
              >
                <For each={socials()}>
                  {(item, index) => (
                    <div class="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Platform (e.g. GitHub)"
                        value={item.title}
                        onInput={(e) => handleSocialChange(index(), "title", e.currentTarget.value)}
                        class="w-1/3 h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <div class="relative flex-1">
                        <RiEditorLink class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                        <input
                          type="url"
                          placeholder="https://..."
                          value={item.url}
                          onInput={(e) => handleSocialChange(index(), "url", e.currentTarget.value)}
                          class="w-full h-9 rounded-md border border-input bg-background/50 pl-8 pr-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSocial(index())}
                        class="size-9 text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                        title="Remove social link"
                      >
                        <RiSystemDeleteBinLine class="size-3.5" />
                      </Button>
                    </div>
                  )}
                </For>
              </Show>
            </CardContent>
          </Card>

          <div class="flex items-center justify-between pt-2">
            <p class="text-[11px] font-mono text-muted-foreground">
              * Required fields. Changes immediately apply to public portfolio routes.
            </p>
            <Button
              type="submit"
              disabled={saving()}
              class="font-mono text-xs cursor-pointer flex items-center gap-1.5"
            >
              <RiDeviceSaveLine class="size-4" />
              <span>{saving() ? "Saving Changes..." : "Save Settings"}</span>
            </Button>
          </div>
        </Form>
      </div>
    </DashboardLayout>
  );
}
