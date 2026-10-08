import { createResource, onMount, onCleanup, Show, For } from "solid-js";
import { Splide } from "@splidejs/splide";
import DecoratorUI from "~/components/decorator-ui";
import CaseStudy, { type ICaseStudy } from "~/components/global/case-study";
import Section from "~/components/section";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import CaseStudiesLoader from "~/components/ui/loaders/case-studies";

async function fetchRelatedCaseStudies(id: string, type?: string): Promise<ICaseStudy[]> {
  try {
    const encodedType = encodeURIComponent(type || "");
    const res = await fetch(`https://api.abious.ddev.site/api/case-studies/${id}/${encodedType}/related`);
    if (!res.ok) throw new Error("Failed to fetch related case studies");
    return await res.json();
  } catch (e) {
    return [];
  }
}

export default function RelatedCaseStudies(props: { id: string; type?: string }) {
  const [data] = createResource(
    () => ({ id: props.id, type: props.type }),
    (params) => fetchRelatedCaseStudies(params.id, params.type)
  );

  let splideEl: HTMLDivElement | undefined;
  let splideInstance: Splide | null = null;

  const initSplide = () => {
    if (splideEl && !splideInstance && data() && data()!.length > 0) {
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
    }
  };

  onMount(() => {
    setTimeout(initSplide, 100);
  });

  onCleanup(() => {
    if (splideInstance) {
      splideInstance.destroy();
      splideInstance = null;
    }
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
              ref={(el) => {
                splideEl = el;
                initSplide();
              }}
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
