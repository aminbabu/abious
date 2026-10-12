import { createResource, Show, For } from "solid-js";
import { useParams, A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { marked } from "marked";
import {
  RiArrowsArrowLeftLine,
  RiSystemTimeLine,
  RiFinancePriceTag3Line,
} from "solid-icons/ri";
import Section from "~/components/section";
import DecoratorUI from "~/components/decorator-ui";
import Contact from "~/components/contact";
import NotFoundState from "~/components/global/not-found-state";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/lib/api";

export default function BlogPostPage() {
  const params = useParams();

  const [post] = createResource(async () => {
    try {
      return await api.blogs.getBySlug(params.slug);
    } catch {
      return null;
    }
  });

  return (
    <>
      <Show
        when={post()}
        fallback={
          <NotFoundState
            badge="./blogs/404"
            code="404"
            title="Blog Post Not Found"
            description={`The article with slug "${params.slug}" could not be located or has been archived.`}
            primaryAction={{
              label: "Browse All Articles",
              href: "/blogs",
            }}
            secondaryAction={{
              label: "Return Home",
              href: "/",
            }}
          />
        }
      >
        {(item) => (
          <>
            <Title>{`${item().title} | Amin Babu`}</Title>

            <Section class="pt-28 lg:pt-32 pb-6">
              <DecoratorUI>
                <A
                  href="/blogs"
                  class="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                  <RiArrowsArrowLeftLine class="size-3.5" />
                  <span>Back to all articles</span>
                </A>
              </DecoratorUI>

              <DecoratorUI>
                <div class="space-y-4 max-w-4xl">
                  <div class="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                    <span class="rounded bg-primary/10 px-2 py-0.5 text-primary font-semibold uppercase tracking-wider text-[11px]">
                      Engineering
                    </span>
                    <span class="flex items-center gap-1">
                      <RiSystemTimeLine class="size-3.5" />
                      <span>{item().createdAt ? new Date(item().createdAt).toLocaleDateString() : ""}</span>
                    </span>
                  </div>

                  <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono tracking-tight text-foreground leading-tight">
                    {item().title}
                  </h1>

                  <p class="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {item().summary}
                  </p>

                  <div class="flex flex-wrap gap-2 pt-2">
                    <For each={item().tags || []}>
                      {(tag) => (
                        <span class="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-mono text-muted-foreground">
                          <RiFinancePriceTag3Line class="size-3" />
                          <span>{tag}</span>
                        </span>
                      )}
                    </For>
                  </div>
                </div>
              </DecoratorUI>
            </Section>

            <Section class="py-8 lg:py-12">
              <Card class="border-dashed bg-card/60 backdrop-blur-xs">
                <CardContent class="p-6 sm:p-10 lg:p-12">
                  <div
                    class="prose prose-invert prose-emerald max-w-none font-sans text-sm sm:text-base leading-relaxed prose-headings:font-mono prose-pre:bg-secondary/40 prose-pre:border prose-pre:border-dashed prose-pre:border-border"
                    innerHTML={marked.parse(item().content || "") as string}
                  />
                </CardContent>
              </Card>
            </Section>

            <Contact />
          </>
        )}
      </Show>
    </>
  );
}
