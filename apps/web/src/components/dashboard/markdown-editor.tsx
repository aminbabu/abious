import { createSignal, createMemo, Show } from "solid-js";
import { marked } from "marked";
import {
  RiEditorBold,
  RiEditorItalic,
  RiEditorHeading,
  RiEditorQuoteText,
  RiEditorCodeBlock,
  RiEditorLink,
  RiEditorListUnordered,
  RiEditorListOrdered,
  RiSystemEyeLine,
  RiMediaFullscreenLine,
  RiMediaFullscreenExitLine,
} from "solid-icons/ri";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  minHeight?: string;
  label?: string;
  description?: string;
  required?: boolean;
}

export default function MarkdownEditor(props: MarkdownEditorProps) {
  const [tab, setTab] = createSignal<"write" | "split" | "preview">("write");
  const [fullscreen, setFullscreen] = createSignal<boolean>(false);
  let textareaRef: HTMLTextAreaElement | undefined;

  // Compile markdown to HTML for live preview
  const renderedHtml = createMemo(() => {
    const text = props.value || "";
    if (!text.trim()) return "<p class='text-muted-foreground italic text-xs'>Nothing to preview yet...</p>";
    try {
      return marked.parse(text, { async: false, breaks: true, gfm: true }) as string;
    } catch {
      return `<p class='text-destructive text-xs'>Failed to parse markdown.</p>`;
    }
  });

  // Calculate word and character count
  const stats = createMemo(() => {
    const text = props.value || "";
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    return { words, chars };
  });

  // Action helpers to insert markdown snippets around selection
  const insertSyntax = (prefix: string, suffix: string = "", defaultText: string = "") => {
    if (!textareaRef) return;
    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const text = props.value || "";
    const selectedText = text.substring(start, end) || defaultText;

    const before = text.substring(0, start);
    const after = text.substring(end);
    const replacement = `${prefix}${selectedText}${suffix}`;

    props.onChange(`${before}${replacement}${after}`);

    // Re-focus and set selection
    setTimeout(() => {
      if (!textareaRef) return;
      textareaRef.focus();
      textareaRef.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  return (
    <div
      class={`rounded-xl border border-dashed border-border bg-card/75 transition-all ${
        fullscreen()
          ? "fixed inset-4 z-50 flex flex-col shadow-2xl backdrop-blur-2xl bg-card/95"
          : "relative"
      }`}
    >
      {/* ── Toolbar Header ── */}
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-border/80 px-3 py-2 bg-background/50 rounded-t-xl">
        {/* Left: Quick Syntax Buttons */}
        <div class="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertSyntax("**", "**", "bold text")}
            title="Bold (**text**)"
            class="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <RiEditorBold class="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax("*", "*", "italic text")}
            title="Italic (*text*)"
            class="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <RiEditorItalic class="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax("### ", "", "Heading 3")}
            title="Heading 3 (### Heading)"
            class="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <RiEditorHeading class="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax("> ", "", "Quote text")}
            title="Blockquote (> quote)"
            class="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <RiEditorQuoteText class="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax("```typescript\n", "\n```", "// code here")}
            title="Code Block (```code```)"
            class="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <RiEditorCodeBlock class="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax("[", "](https://example.com)", "link title")}
            title="Hyperlink ([title](url))"
            class="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <RiEditorLink class="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax("- ", "", "List item")}
            title="Unordered List (- item)"
            class="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <RiEditorListUnordered class="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax("1. ", "", "Ordered item")}
            title="Numbered List (1. item)"
            class="p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <RiEditorListOrdered class="size-3.5" />
          </button>
        </div>

        {/* Right: View Mode Tabs + Fullscreen Toggle */}
        <div class="flex items-center gap-2">
          {/* View Mode Toggle Pill */}
          <div class="flex items-center rounded-lg border border-dashed border-border/80 bg-background/60 p-0.5 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setTab("write")}
              class={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                tab() === "write"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab("split")}
              class={`hidden md:inline-block px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                tab() === "split"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              class={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                tab() === "preview"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <RiSystemEyeLine class="size-3" />
              <span>Preview</span>
            </button>
          </div>

          {/* Fullscreen Expand Button */}
          <button
            type="button"
            onClick={() => setFullscreen(!fullscreen())}
            title={fullscreen() ? "Exit fullscreen" : "Enter fullscreen editor"}
            class="p-1.5 rounded-lg border border-dashed border-border/80 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer transition-colors"
          >
            <Show when={fullscreen()} fallback={<RiMediaFullscreenLine class="size-3.5" />}>
              <RiMediaFullscreenExitLine class="size-3.5" />
            </Show>
          </button>
        </div>
      </div>

      {/* ── Editor Body ── */}
      <div
        class={`grid ${
          tab() === "split" ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dashed divide-border" : "grid-cols-1"
        } ${fullscreen() ? "flex-1 overflow-hidden" : ""}`}
      >
        {/* Write Pane */}
        <Show when={tab() === "write" || tab() === "split"}>
          <div class={`flex flex-col ${fullscreen() ? "h-full" : ""}`}>
            <textarea
              ref={textareaRef}
              rows={props.rows || (fullscreen() ? 24 : 14)}
              required={props.required}
              value={props.value || ""}
              onInput={(e) => props.onChange(e.currentTarget.value)}
              placeholder={props.placeholder || "Write with Markdown..."}
              class={`w-full flex-1 resize-y bg-transparent p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 outline-none leading-relaxed selection:bg-primary/20 ${
                fullscreen() ? "h-full resize-none overflow-y-auto" : "min-h-[220px]"
              }`}
            />
          </div>
        </Show>

        {/* Live Preview Pane */}
        <Show when={tab() === "preview" || tab() === "split"}>
          <div
            class={`p-5 overflow-y-auto ${
              fullscreen() ? "h-full" : "min-h-[220px] max-h-[500px]"
            } bg-card/40`}
          >
            <div
              class="prose prose-neutral dark:prose-invert max-w-none text-xs font-sans prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-code:font-mono prose-code:text-[11px] prose-pre:bg-muted prose-pre:p-3 prose-pre:rounded-lg prose-pre:border prose-pre:border-border"
              innerHTML={renderedHtml()}
            />
          </div>
        </Show>
      </div>

      {/* ── Status Footer ── */}
      <div class="flex items-center justify-between border-t border-dashed border-border/80 px-3 py-1.5 text-[10px] font-mono text-muted-foreground/70 bg-background/40 rounded-b-xl">
        <span class="flex items-center gap-1.5">
          <span class="size-1.5 rounded-full bg-primary/60" />
          <span>Markdown GFM enabled</span>
        </span>
        <div class="flex items-center gap-3">
          <span>{stats().words} words</span>
          <span>•</span>
          <span>{stats().chars} characters</span>
        </div>
      </div>
    </div>
  );
}
