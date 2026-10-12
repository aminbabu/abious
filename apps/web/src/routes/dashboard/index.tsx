import { onMount } from "solid-js";
import { authClient } from "~/lib/auth-client";

export default function DashboardIndex() {
  onMount(async () => {
    try {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        window.location.replace("/dashboard/overview");
      } else {
        window.location.replace("/auth/login");
      }
    } catch {
      window.location.replace("/auth/login");
    }
  });

  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-mono text-xs text-muted-foreground">
      <div class="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
      <span>Checking session...</span>
    </div>
  );
}
