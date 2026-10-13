import {
  RiSystemCheckLine,
  RiSystemShareLine,
} from "solid-icons/ri";
import { Show, createSignal } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import CalCom from "~/components/global/calcom";
import MarkdownRenderer from "~/components/global/markdown-renderer";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
import type { IBlogPostItem } from "~/lib/api";

export default function BlogContent(props: { post?: IBlogPostItem }) {
  const item = () => props.post;
  const [copied, setCopied] = createSignal(false);

  const copyUrl = async () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  return (
    <Section class="space-y-10 py-0 lg:py-0">
      {/* Markdown Body */}
      <MarkdownRenderer content={item()?.content} />

      <div class="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          class="rounded-full cursor-pointer"
          onClick={copyUrl}
        >
          <Show
            when={copied()}
            fallback={
              <>
                <span>Share Article</span>
                <RiSystemShareLine class="ml-1.5 size-4" />
              </>
            }
          >
            <span class="text-primary">Link Copied!</span>
            <RiSystemCheckLine class="ml-1.5 size-4 text-primary" />
          </Show>
        </Button>

        <CalCom type="popup" title="Let's Talk" />
      </div>
    </Section>
  );
}
