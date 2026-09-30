import { JSX } from "solid-js";
import { cn } from "~/lib/utils";

export default function Container(props: { class?: string; children?: JSX.Element }) {
  return (
    <div class={cn("mx-auto max-w-7xl px-3", props.class)}>
      {props.children}
    </div>
  );
}
