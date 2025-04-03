import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme";
import { cn } from "@/lib/utils";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const CalCom = ({
  title = "Book a Call!",
  size = "default",
  type = "default",
  className,
}: {
  title?: string;
  size?: "default" | "sm" | "lg" | "icon";
  type?: "default" | "popup";
  className?: string;
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#171717" },
          dark: { "cal-brand": "#fafafa" },
        },
        theme: theme,
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [theme]);

  return type === "popup" ? (
    <Button
      data-cal-namespace="30min"
      data-cal-link="aminbabu/30min"
      data-cal-config='{"layout":"month_view"}'
      size={size}
      className={cn("cursor-pointer rounded-full", className)}
    >
      {title}
    </Button>
  ) : (
    <Cal
      namespace="30min"
      calLink="aminbabu/30min"
      config={{ layout: "month_view" }}
      className={cn("h-full w-full", className)}
    />
  );
};

export default CalCom;
