import { createResource, onMount, onCleanup, Show, For, createEffect } from "solid-js";
import { Splide } from "@splidejs/splide";
import DecoratorUI from "~/components/decorator-ui";
import CaseStudy, { type ICaseStudy } from "~/components/global/case-study";
import Section from "~/components/section";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import CaseStudiesLoader from "~/components/ui/loaders/case-studies";
import { api } from "~/lib/api";

export default function RelatedCaseStudies(props: { id: string; type?: string }) {
  const [data] = createResource(
    () => ({ id: props.id, type: props.type }),
    async (params) => {
      try {
        const res = await api.caseStudies.related(params.id, params.type);
        return res as unknown as ICaseStudy[];
      } catch {
        return [];
      }
    }
  );


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

  const mountSplideOnElement = (el: HTMLDivElement | undefined) => {
    splideEl = el;
    if (!el) {
      destroySplide();
      return;
    }

    const track = el.querySelector(".splide__track");
    const list = el.querySelector(".splide__list");
    if (!track || !list) return;

    if (!splideInstance) {
      splideInstance = new Splide(el, {
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
    }
  };

  onCleanup(() => {
    destroySplide();
  });



  return (
    <Section>
      <Paragraph class="mb-3 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        ./related projects
      </Paragraph>
      <DecoratorUI class="mb-16 lg:mb-20">
        <Heading class="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Discover More Groundbreaking Projects
        </Heading>
      </DecoratorUI>

      <Show
        when={!data.loading}
        fallback={
          <DecoratorUI class="-mt-5">
            <div class="bg-secondary -mx-3 p-3">
              <CaseStudiesLoader />
            </div>
          </DecoratorUI>
        }
      >
        <Show
          when={!data.error}
          fallback={
            <DecoratorUI class="-mt-5">
              <div class="bg-secondary -mx-3 p-3">
                {data.error?.message ?? "Error loading related case studies"}
              </div>
            </DecoratorUI>
          }
        >
          <Show
            when={data()?.length}
            fallback={
              <DecoratorUI class="-mt-5">
                <div class="bg-secondary -mx-3 p-3">
                  <p class="text-muted-foreground">No related case studies found.</p>
                </div>
              </DecoratorUI>
            }
          >
            <div
              ref={mountSplideOnElement}
              class="splide -mt-5"
              aria-label="Related Case Studies"
            >

              <DecoratorUI class="before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed py-px">
                <div class="-mx-3 bg-secondary px-3">
                  <div class="splide__track">
                    <ul class="splide__list">
                      <For each={data()}>
                        {(caseStudy) => (
                          <li class="splide__slide py-3">
                            <CaseStudy caseStudy={caseStudy} />
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
