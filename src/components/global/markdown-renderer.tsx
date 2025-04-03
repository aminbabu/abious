import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const MarkdownRenderer = ({
  className,
  content = "",
}: {
  className?: string;
  content: string | undefined;
}) => {
  return (
    <article className={cn("prose dark:prose-invert max-w-none", className)}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
