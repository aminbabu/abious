import { JSX } from "solid-js";
import { cn } from "~/lib/utils";

interface DecoratorUIProps {
  class?: string;
  children?: JSX.Element;
}

export default function DecoratorUI(props: DecoratorUIProps) {
  return (
    <div
      class={cn(
        "relative z-0 before:absolute before:inset-y-0 before:left-[-100vw] before:-z-10 before:w-[200vw] before:border-y before:border-dashed before:border-border before:pointer-events-none",
        props.class,
      )}
    >
      {props.children}
    </div>
  );
}
