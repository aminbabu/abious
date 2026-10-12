import { Splide } from "@splidejs/splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import dayjs from "dayjs";
import { createResource, onCleanup, onMount, Show, createEffect } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import ExperienceLoader from "~/components/ui/loaders/experience";
import { api, type IExperienceItem } from "~/lib/api";
import { cn } from "~/lib/utils";

export default function Experience() {
  const [data] = createResource<IExperienceItem[]>(() => api.experience.list());

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

    // Ensure the track and list elements exist in DOM before mounting
    const track = el.querySelector(".splide__track");
    const list = el.querySelector(".splide__list");
    if (!track || !list) return;

    if (!splideInstance) {
      splideInstance = new Splide(el, {
        type: "loop",
        perPage: 1,
        gap: "1.5rem",
        arrows: false,
        pagination: false,
        padding: {
          right: "15%",
        },
        autoScroll: { speed: 0.125 },
        mediaQuery: "min",
        breakpoints: {
          768: {
            perPage: 2,
            gap: "2rem",
          },
          1024: {
            perPage: 3,
            gap: "2rem",
          },
        },
      });
      splideInstance.mount({ AutoScroll });
    }
  };

  onCleanup(() => {
    destroySplide();
  });


  return (
    <Section id="experience">
      <Paragraph class="mb-3 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        ./experiences
      </Paragraph>
      <DecoratorUI class="mb-16 lg:mb-20">
        <Heading class="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Every Pixel Speaks
        </Heading>
      </DecoratorUI>

      <Show
        when={!data.loading}
        fallback={
          <DecoratorUI class="py-px before:bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:bg-fixed">
            <div class="-mx-3 bg-secondary p-3">
              <ExperienceLoader />
            </div>
          </DecoratorUI>
        }
      >
        <Show
          when={!data.error && data()?.length}
          fallback={
            <DecoratorUI class="py-px before:bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:bg-fixed">
              <div class="-mx-3 bg-secondary p-6 text-center text-muted-foreground">
                <p>{data.error ? "Failed to load experiences." : "No experience entries found."}</p>
              </div>
            </DecoratorUI>
          }
        >
          <div
            ref={mountSplideOnElement}
            class="splide -mt-3"
            aria-label="Experiences"
          >

            <DecoratorUI class="py-px before:bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:bg-fixed">
              <div class="-mx-3 bg-secondary p-3">
                <div class="splide__track">
                  <ul class="splide__list">
                    {data()?.map((work) => (
                      <li class="splide__slide flex gap-x-3 py-2">
                        <figure class="border-border bg-background aspect-square size-10 shrink-0 overflow-hidden rounded-full border shadow-sm">
                          <img
                            src={work.logo}
                            alt={work.company}
                            width="56"
                            height="56"
                            class="h-full w-full object-cover object-center"
                          />
                        </figure>
                        <div class="min-w-0 flex-1">
                          <h3 class="font-bold text-foreground">{work.company}</h3>
                          <p class="text-xs sm:text-sm font-medium text-muted-foreground">
                            {work.location}
                          </p>
                          <ul class="mt-4 space-y-4">
                            {work.positions?.map((position, index) => (
                              <li
                                class={cn(
                                  "before:border-foreground/25 relative before:pointer-events-none before:absolute before:bottom-full before:right-full before:-z-10 before:h-10 before:w-6 before:-translate-x-2 before:translate-y-3 before:rounded-bl-xl before:border before:border-r-0 before:border-t-0 before:border-dashed",
                                  {
                                    "before:border-foreground":
                                      position.endDate === "present",
                                    "before:h-24": index === 1,
                                  },
                                )}
                              >
                                <p class="text-sm font-semibold text-foreground">
                                  {position.title}
                                </p>
                                <p class="text-xs sm:text-sm text-muted-foreground">
                                  {dayjs(position.startDate).format("MMM DD, YYYY")}{" "}
                                  -{" "}
                                  {position.endDate === "present"
                                    ? "Present"
                                    : dayjs(position.endDate).format(
                                        "MMM DD, YYYY",
                                      )}{" "}
                                  (
                                  <span class="font-medium text-foreground/80">
                                    {position.endDate === "present"
                                      ? dayjs().diff(
                                          dayjs(position.startDate),
                                          "month",
                                        )
                                      : dayjs(position.endDate).diff(
                                          dayjs(position.startDate),
                                          "month",
                                        )}{" "}
                                    months)
                                  </span>
                                </p>
                                <p class="text-xs font-semibold text-foreground/70 uppercase tracking-wider mt-0.5">
                                  {position.type}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DecoratorUI>
          </div>
        </Show>
      </Show>
    </Section>
  );
}

