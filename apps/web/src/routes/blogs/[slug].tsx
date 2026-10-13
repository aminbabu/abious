import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { RiFinancePriceTag3Line } from "solid-icons/ri";
import { createResource, Show } from "solid-js";
import BlogContent from "~/components/blogs/content";
import FeaturedBlogImage from "~/components/blogs/featured-image";
import RelatedBlogs from "~/components/blogs/related-blogs";
import Contact from "~/components/contact";
import DecoratorUI from "~/components/decorator-ui";
import PageHero from "~/components/global/hero";
import NotFoundState from "~/components/global/not-found-state";
import Section from "~/components/section";
import { api, type IBlogPostItem } from "~/lib/api";

export default function SingleBlogPostPage() {
  const params = useParams();

  const [post] = createResource<IBlogPostItem | null, string>(
    () => params.slug,
    async (slug) => {
      try {
        const item = await api.blogs.getBySlug(slug);
        return item as IBlogPostItem | null;
      } catch {
        return null;
      }
    },
  );

  return (
    <>
      <Show
        when={!post.loading}
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
          when={post()}
          fallback={
            <>
              <Title>Article Not Found | Amin Babu</Title>
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
              <RelatedBlogs currentSlug="" />
              <Contact />
            </>
          }
        >
          {(item) => (
            <>
              <Title>{`${item().title} | Amin Babu - Full Stack Web Developer & Tech Enthusiast`}</Title>
              <PageHero
                backLink={{
                  href: "/blogs",
                  label: "Back to all articles",
                }}
                title={item().title}
                description={item().summary}
              >
                <DecoratorUI class="before:border-t-0 pt-6 pb-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-mono text-muted-foreground mr-1">
                      Tags:
                    </span>
                    <For each={item()?.tags || []}>
                      {(tag) => (
                        <span class="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-mono text-muted-foreground border border-border/40">
                          <RiFinancePriceTag3Line class="size-3" />
                          <span>{tag}</span>
                        </span>
                      )}
                    </For>
                  </div>
                </DecoratorUI>
              </PageHero>
              <FeaturedBlogImage post={item()} />
              <BlogContent post={item()} />
              <RelatedBlogs currentSlug={item().slug} />
              <Contact />
            </>
          )}
        </Show>
      </Show>
    </>
  );
}
