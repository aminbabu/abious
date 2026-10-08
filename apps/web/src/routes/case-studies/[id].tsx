import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import PageHero from "~/components/global/hero";
import FeaturedImage from "~/components/case-studies/featured-image";
import CaseStudyContent, { type ICaseStudyDetail } from "~/components/case-studies/content";
import RelatedCaseStudies from "~/components/case-studies/related-case-studies";
import Contact from "~/components/contact";
import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";

async function fetchCaseStudy(id: string): Promise<ICaseStudyDetail | null> {
  try {
    const res = await fetch(`https://api.abious.ddev.site/api/case-studies/${id}`);
    if (!res.ok) throw new Error("Failed to fetch case study");
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default function SingleCaseStudyPage() {
  const params = useParams();
  const [caseStudy] = createResource(() => params.id, fetchCaseStudy);

  return (
    <main>
      <Show
        when={!caseStudy.loading}
        fallback={
          <Section class="pt-28 lg:pt-32">
            <DecoratorUI>
              <div class="h-10 w-2/3 animate-pulse rounded bg-border mb-3" />
            </DecoratorUI>
            <DecoratorUI class="before:-bottom-3 before:border-t-0">
              <div class="h-6 w-full max-w-2xl animate-pulse rounded bg-border" />
            </DecoratorUI>
          </Section>
        }
      >
        <Show
          when={caseStudy()}
          fallback={
            <Section class="pt-28 lg:pt-32">
              <Title>Case Study Not Found | Amin Babu</Title>
              <DecoratorUI>
                <h1 class="text-3xl font-bold">Case Study Not Found</h1>
              </DecoratorUI>
              <DecoratorUI class="mt-4">
                <p class="text-muted-foreground">The requested case study could not be found.</p>
              </DecoratorUI>
            </Section>
          }
        >
          {(item) => (
            <>
              <Title>{`${item().data.title} | Amin Babu - Full Stack Web Developer & Tech Enthusiast`}</Title>
              <PageHero
                title={item().data.title}
                description={item().data.description}
              />
              <FeaturedImage caseStudy={item()} />
              <CaseStudyContent caseStudy={item()} />
              <RelatedCaseStudies id={item().id} type={item().data.type} />
              <Contact />
            </>
          )}
        </Show>
      </Show>
    </main>
  );
}
