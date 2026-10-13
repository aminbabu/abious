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
        "prose prose-neutral dark:prose-invert max-w-none font-sans text-base leading-relaxed",
        "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
        "prose-h1:text-2xl sm:prose-h1:text-3xl lg:prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4",
        "prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-dashed prose-h2:border-border",
        "prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2",
        "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-4",
        "prose-a:text-primary prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:underline",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-code:font-mono prose-code:text-[0.85em] prose-code:text-foreground prose-code:bg-muted/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-muted/40 prose-pre:border prose-pre:border-dashed prose-pre:border-border prose-pre:rounded-xl prose-pre:p-4 sm:prose-pre:p-6 prose-pre:text-foreground",
        "prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:bg-secondary/40 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-muted-foreground",
        "prose-ul:my-4 prose-ol:my-4 prose-li:my-1.5 prose-li:text-muted-foreground",
        "prose-img:rounded-xl prose-img:border prose-img:border-dashed prose-img:border-border prose-img:shadow-sm",
        "prose-hr:border-dashed prose-hr:border-border prose-hr:my-8",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        props.class
      )}
      innerHTML={html()}
    />
  );
}
