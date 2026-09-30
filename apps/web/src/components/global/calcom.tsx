import { onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import { useTheme } from "~/context/theme";
import { cn } from "~/lib/utils";

export default function CalCom(props: {
  title?: string;
  size?: "default" | "sm" | "lg" | "icon";
  type?: "default" | "popup";
  class?: string;
}) {
  const { theme } = useTheme();

  onMount(() => {
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initLoaded"]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    const w = window as any;
    if (w.Cal) {
      w.Cal("init", "30min", { origin: "https://cal.com" });
      w.Cal.ns["30min"]("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#171717" },
          dark: { "cal-brand": "#fafafa" },
        },
        theme: theme(),
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    }
  });

  return (
    <Button
      data-cal-namespace="30min"
      data-cal-link="aminbabu/30min"
      data-cal-config='{"layout":"month_view"}'
      size={props.size ?? "default"}
      class={cn("cursor-pointer rounded-full", props.class)}
    >
      {props.title ?? "Book a Call!"}
    </Button>
  );
}
