import { marked } from "marked";
import { createMemo } from "solid-js";
import { cn } from "~/lib/utils";

export default function MarkdownRenderer(props: {
  content?: string;
  class?: string;
}) {
  const html = createMemo(() => {
    if (!props.content) return "";
    try {
      return marked.parse(props.content, { async: false }) as string;
    } catch {
      return props.content;
    }
  });

  return (
    <article
      class={cn(
        "prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-semibold prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl",
        props.class
      )}
      innerHTML={html()}
    />
  );
}
