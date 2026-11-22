import DecoratorUI from "~/components/decorator-ui";
import { cn } from "~/lib/utils";

interface EmptyStateProps {
  message: string;
  isError?: boolean;
  class?: string;
}

export default function EmptyState(props: EmptyStateProps) {
  return (
    <DecoratorUI
      class={cn(
        "py-px before:bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:bg-fixed",
        props.class,
      )}
    >
      <div class="-mx-3 bg-secondary px-6 py-10 text-center">
        <p
          class={cn(
            "font-mono text-sm",
            props.isError ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {props.message}
        </p>
      </div>
    </DecoratorUI>
  );
}
