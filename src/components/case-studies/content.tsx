import CalCom from "@/components/global/calcom";
import MarkdownRenderer from "@/components/global/markdown-renderer";
import Section from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/context/theme";
import type { ICaseStudy } from "@/interfaces/case-study";

const CaseStudyContent = ({ caseStudy }: { caseStudy: ICaseStudy }) => {
  return (
    <Section className="space-y-10 py-0 lg:py-0">
      <MarkdownRenderer content={caseStudy?.body} />
      <div className="flex items-center gap-x-3">
        {caseStudy?.liveURL && (
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href={caseStudy?.liveURL} target="_blank">
              Visit Project
            </a>
          </Button>
        )}

        <ThemeProvider>
          <CalCom type="popup" title="Let's Talk" />
        </ThemeProvider>
      </div>
    </Section>
  );
};

export default CaseStudyContent;
