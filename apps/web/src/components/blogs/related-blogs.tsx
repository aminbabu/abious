import { createResource, onCleanup, Show, For, createEffect } from "solid-js";
import { Splide } from "@splidejs/splide";
import DecoratorUI from "~/components/decorator-ui";
import BlogCard from "~/components/global/blog-card";
import Section from "~/components/section";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import BlogsLoader from "~/components/ui/loaders/blogs";
import { api, type IBlogPostItem } from "~/lib/api";

export default function RelatedBlogs(props: { currentSlug: string }) {
  const [data] = createResource(async () => {
    try {
      const list = await api.blogs.list();
      return (list || []).filter((b) => b.slug !== props.currentSlug);
    } catch {
      return [];
    }
  });

  let splideEl: HTMLDivElement | undefined;
  let splideInstance: Splide | null = null;

  const destroySplide = () => {
    if (splideInstance) {
      try {
        splideInstance.destroy();
      } catch {
        // ignore
      }
      splideInstance = null;
    }
  };

  createEffect(() => {
    const items = data();
    if (!splideEl || !items?.length) {
      destroySplide();
      return;
    }

    destroySplide();

    const track = splideEl.querySelector(".splide__track");
    const list = splideEl.querySelector(".splide__list");
    if (!track || !list) return;

    splideInstance = new Splide(splideEl, {
      type: "slide",
      perPage: 1,
      gap: "0.75rem",
      arrows: false,
      pagination: true,
      mediaQuery: "min",
      breakpoints: {
        768: {
          perPage: 2,
        },
        1024: {
          perPage: 3,
        },
      },
    });
    splideInstance.mount();
  });

  onCleanup(() => {
    destroySplide();
  });

  return (
    <Section>
      <Paragraph class="mb-3 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        ./related articles
      </Paragraph>
      <DecoratorUI class="mb-16 lg:mb-20">
        <Heading class="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Continue Exploring Insights & Architecture
        </Heading>
      </DecoratorUI>

      <Show
        when={!data.loading}
        fallback={
          <DecoratorUI class="-mt-5">
            <div class="bg-secondary -mx-3 p-3">
              <BlogsLoader limit="3" />
            </div>
          </DecoratorUI>
        }
      >
        <Show
          when={!data.error}
          fallback={
            <DecoratorUI class="-mt-5">
              <div class="bg-secondary -mx-3 p-3">
                {data.error?.message ?? "Error loading related articles"}
              </div>
            </DecoratorUI>
          }
        >
          <Show
            when={data()?.length}
            fallback={
              <DecoratorUI class="-mt-5">
                <div class="bg-secondary -mx-3 p-3">
                  <p class="text-xs font-mono text-muted-foreground">
                    No other articles published yet.
                  </p>
                </div>
              </DecoratorUI>
            }
          >
            <div
              ref={splideEl}
              class="splide -mt-5"
              aria-label="Related Blog Posts"
            >
              <DecoratorUI class="before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed py-px">
                <div class="-mx-3 bg-secondary px-3">
                  <div class="splide__track">
                    <ul class="splide__list">
                      <For each={data()}>
                        {(post: IBlogPostItem) => (
                          <li class="splide__slide py-3">
                            <BlogCard post={post} />
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                </div>
              </DecoratorUI>
            </div>
          </Show>
        </Show>
      </Show>
    </Section>
  );
}
