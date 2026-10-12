import { createSignal, createResource, Show, For } from "solid-js";
import {
  RiDeviceSaveLine,
  RiSystemAddLine,
  RiSystemDeleteBinLine,
} from "solid-icons/ri";
import DashboardLayout from "~/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api, ISiteSettings } from "~/lib/api";

export default function SettingsAdminPage() {
  const [siteName, setSiteName] = createSignal("");
  const [siteTitle, setSiteTitle] = createSignal("");
  const [bio, setBio] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [resumeUrl, setResumeUrl] = createSignal("");
  const [calcomLink, setCalcomLink] = createSignal("");
  const [socials, setSocials] = createSignal<Array<{ id: string; title: string; url: string }>>([]);

  const [saving, setSaving] = createSignal(false);
  const [statusMessage, setStatusMessage] = createSignal<{ type: "success" | "error"; text: string } | null>(null);

  const [settings] = createResource(async () => {
    try {
      const data = await api.settings.getPublic();
      if (data) {
        setSiteName(data.siteName || "");
        setSiteTitle(data.siteTitle || "");
        setBio(data.bio || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setResumeUrl(data.resumeUrl || "");
        setCalcomLink(data.calcomLink || "");
        setSocials(data.socials || []);
      }
      return data;
    } catch {
      return null;
    }
  });

  const handleAddSocial = () => {
    setSocials([...socials(), { id: `social-${Date.now()}`, title: "New Social", url: "https://" }]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocials(socials().filter((_, i) => i !== index));
  };

  const handleSocialChange = (index: number, field: "title" | "url", val: string) => {
    const updated = [...socials()];
    updated[index][field] = val;
    setSocials(updated);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setStatusMessage(null);
    setSaving(true);

    const payload: ISiteSettings = {
      siteName: siteName(),
      siteTitle: siteTitle(),
      bio: bio(),
      email: email(),
      phone: phone(),
      resumeUrl: resumeUrl(),
      calcomLink: calcomLink(),
      socials: socials(),
    };

    try {
      await api.settings.update("public", payload);
      setStatusMessage({ type: "success", text: "Site settings updated successfully!" });
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
            class={`rounded-md border p-3 text-xs font-mono ${
              statusMessage()?.type === "success"
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
                : "border-destructive/50 bg-destructive/10 text-destructive"
            }`}
          >
            {statusMessage()?.text}
          </div>
        </Show>

        <form onSubmit={handleSubmit} class="space-y-6">
          {/* General Portfolio Info */}
          <Card class="border-dashed bg-card/60">
            <CardHeader>
              <CardTitle class="text-sm font-mono">General Profile</CardTitle>
              <CardDescription>Brand identity and hero introduction text.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-mono font-medium text-foreground">Site / Author Name</label>
                  <input
                    type="text"
                    required
                    value={siteName()}
                    onInput={(e) => setSiteName(e.currentTarget.value)}
                    class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-mono font-medium text-foreground">Site Title & SEO Headline</label>
                  <input
                    type="text"
                    required
                    value={siteTitle()}
                    onInput={(e) => setSiteTitle(e.currentTarget.value)}
                    class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-mono font-medium text-foreground">Author Bio / Summary</label>
                <textarea
                  required
                  rows={4}
                  value={bio()}
                  onInput={(e) => setBio(e.currentTarget.value)}
                  class="w-full min-h-[100px] resize-y rounded-md border border-input bg-background/50 px-3 py-2 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>
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
                <div class="space-y-1.5">
                  <label class="text-xs font-mono font-medium text-foreground">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={email()}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                    class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-mono font-medium text-foreground">Phone Number</label>
                  <input
                    type="text"
                    value={phone()}
                    onInput={(e) => setPhone(e.currentTarget.value)}
                    class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-mono font-medium text-foreground">Resume File URL</label>
                  <input
                    type="text"
                    value={resumeUrl()}
                    onInput={(e) => setResumeUrl(e.currentTarget.value)}
                    class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs font-mono font-medium text-foreground">Cal.com Event Link</label>
                  <input
                    type="text"
                    value={calcomLink()}
                    onInput={(e) => setCalcomLink(e.currentTarget.value)}
                    placeholder="e.g. aminbabu/30min"
                    class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
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
              <For each={socials()}>
                {(item, index) => (
                  <div class="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Title (e.g. GitHub)"
                      value={item.title}
                      onInput={(e) => handleSocialChange(index(), "title", e.currentTarget.value)}
                      class="w-1/3 h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={item.url}
                      onInput={(e) => handleSocialChange(index(), "url", e.currentTarget.value)}
                      class="flex-1 h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSocial(index())}
                      class="size-9 text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                    >
                      <RiSystemDeleteBinLine class="size-3.5" />
                    </Button>
                  </div>
                )}
              </For>
            </CardContent>
          </Card>

          <div class="flex justify-end">
            <Button
              type="submit"
              disabled={saving()}
              class="font-mono text-xs cursor-pointer flex items-center gap-1.5"
            >
              <RiDeviceSaveLine class="size-4" />
              <span>{saving() ? "Saving Changes..." : "Save Settings"}</span>
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
