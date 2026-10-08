import { JSX, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

function Card(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      data-slot="card"
      class={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}

function CardHeader(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      data-slot="card-header"
      class={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
}

function CardTitle(props: JSX.HTMLAttributes<HTMLHeadingElement>) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <h3
      data-slot="card-title"
      class={cn("leading-none font-semibold text-trim", local.class)}
      {...others}
    >
      {local.children}
    </h3>
  );
}

function CardDescription(props: JSX.HTMLAttributes<HTMLParagraphElement>) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <p
      data-slot="card-description"
      class={cn("text-muted-foreground text-sm", local.class)}
      {...others}
    >
      {local.children}
    </p>
  );
}

function CardContent(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      data-slot="card-content"
      class={cn("px-6", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
}

function CardFooter(props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      data-slot="card-footer"
      class={cn("flex items-center px-6 [.border-t]:pt-6", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
