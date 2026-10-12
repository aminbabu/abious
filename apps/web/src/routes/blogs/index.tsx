import { createResource, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import {
  RiDocumentArticleLine,
  RiDeviceRssLine,
  RiArrowsArrowRightLine,
  RiSystemExternalLinkLine,
} from "solid-icons/ri";
import PageHero from "~/components/global/hero";
import Section from "~/components/section";
import DecoratorUI from "~/components/decorator-ui";
import Contact from "~/components/contact";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/lib/api";

export default function BlogsPage() {
  const [posts] = createResource(async () => {
    try {
      const data = await api.blogs.list();
      return data || [];
    } catch {
      return [];
    }
  });

  return (
    <>
      <Title>Technical Writing & Architecture | Amin Babu</Title>

      <PageHero
        title="Technical Writing & Architecture"
        description="Articles on modern full-stack web development, NestJS, SolidJS, cloud architecture, and engineering principles."
      >
        <div class="mt-4 flex items-center gap-3">
          <span class="rounded bg-primary/10 px-2.5 py-1 text-xs font-mono text-primary font-semibold uppercase tracking-wider">
            Articles & Insights
          </span>
          <a
            href="https://api.abious.ddev.site/api/blogs/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <RiDeviceRssLine class="size-3.5" />
            <span>RSS Feed</span>
            <RiSystemExternalLinkLine class="size-3" />
          </a>
        </div>
      </PageHero>

      <Section class="py-12 lg:py-16">
        <Show
          when={posts() && posts()!.length > 0}
          fallback={
            <DecoratorUI>
              <div class="py-16 text-center text-xs font-mono text-muted-foreground border border-dashed border-border rounded-xl bg-card/40">
                <RiDocumentArticleLine class="size-8 mx-auto mb-2 text-muted-foreground/60" />
                No articles published yet. Check back soon!
              </div>
            </DecoratorUI>
          }
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <For each={posts()}>
              {(post) => (
                <A href={`/blogs/${post.slug}`} class="group block h-full">
                  <Card class="h-full border-dashed bg-card/60 backdrop-blur-xs transition-all duration-200 hover:border-primary/60 hover:shadow-md">
                    <CardContent class="p-6 flex flex-col justify-between h-full space-y-4">
                      <div class="space-y-2.5">
                        <div class="flex items-center justify-between text-xs font-mono text-muted-foreground">
                          <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}</span>
                          <span class="inline-flex items-center gap-1 text-primary font-medium group-hover:underline">
                            <span>Read article</span>
                            <RiArrowsArrowRightLine class="size-3.5" />
                          </span>
                        </div>

                        <h2 class="text-lg font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>

                        <p class="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      <div class="flex flex-wrap gap-1.5 pt-2">
                        <For each={post.tags || []}>
                          {(tag) => (
                            <span class="rounded bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                              #{tag}
                            </span>
                          )}
                        </For>
                      </div>
                    </CardContent>
                  </Card>
                </A>
              )}
            </For>
          </div>
        </Show>
      </Section>

      <Contact />
    </>
  );
}
