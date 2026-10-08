import { Show } from "solid-js";
import { RiSystemExternalLinkLine } from "solid-icons/ri";
import CalCom from "~/components/global/calcom";
import MarkdownRenderer from "~/components/global/markdown-renderer";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";

export interface ICaseStudyDetail {
  id: string;
  slug?: string;
  data: {
    title: string;
    description: string;
    banner: string;
    type?: string;
    liveURL?: string;
    stack?: string[];
    createdAt?: string;
  };
  body: string;
}

export default function CaseStudyContent(props: { caseStudy?: ICaseStudyDetail }) {
  const item = () => props.caseStudy;

  return (
    <Section class="space-y-10 py-0 lg:py-0">
      <MarkdownRenderer content={item()?.body} />
      <div class="flex flex-wrap items-center gap-3">
        <Show when={item()?.data?.liveURL}>
          <Button
            as="a"
            href={item()?.data?.liveURL}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            variant="outline"
            class="rounded-full"
          >
            Visit Project
            <RiSystemExternalLinkLine class="ml-1.5 size-4" />
          </Button>
        </Show>

        <CalCom type="popup" title="Let's Talk" />
      </div>
    </Section>
  );
}
