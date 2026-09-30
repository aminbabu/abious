import { JSX, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

function Skeleton(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="skeleton"
      class={cn("bg-accent animate-pulse rounded-md", local.class)}
      {...others}
    />
  );
}

export { Skeleton };
