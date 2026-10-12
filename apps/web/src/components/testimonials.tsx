import { createResource, onMount, onCleanup, Show, createEffect } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import TestimonialsLoader from "~/components/ui/loaders/testimonials";
import { Splide } from "@splidejs/splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import { api, type ITestimonialItem } from "~/lib/api";

export type ITestimonial = ITestimonialItem;

export default function Testimonials() {
  const [data] = createResource<ITestimonialItem[]>(() => api.testimonials.list());
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
      type: "loop",
      perPage: 1,
      gap: "0.75rem",
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
        },
      },
    });
    splideInstance.mount({ AutoScroll });
  });

  onCleanup(() => {
    destroySplide();
  });


  return (
    <Section id="testimonials">
      <Paragraph class="mb-3 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        ./testimonials
      </Paragraph>
      <DecoratorUI class="mb-16 lg:mb-20">
        <Heading class="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Words That Matter, Trust That Counts
        </Heading>
      </DecoratorUI>

      <Show
        when={!data.loading}
        fallback={
          <DecoratorUI class="-mt-5 before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed">
            <div class="-mx-3 bg-secondary p-3">
              <TestimonialsLoader />
            </div>
          </DecoratorUI>
        }
      >
        <Show
          when={!data.error}
          fallback={
            <DecoratorUI class="-mt-5 before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed">
              <div class="-mx-3 bg-secondary p-3">{data.error?.message}</div>
            </DecoratorUI>
          }
        >
          <Show
            when={data()?.length}
            fallback={
              <DecoratorUI class="-mt-5 before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed">
                <div class="-mx-3 bg-secondary p-3">
                  <p class="text-muted-foreground">No testimonials found.</p>
                </div>
              </DecoratorUI>
            }
          >
            <div
              ref={splideEl}
              class="splide -mt-3"
              aria-label="Testimonials"
            >

              <DecoratorUI class="py-px before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed">
                <div class="-mx-3 bg-secondary px-3">
                  <div class="splide__track">
                    <ul class="splide__list">
                      {data()?.map((testimonial) => {
                        const name = testimonial.name || testimonial.data?.name || "";
                        const role = testimonial.role || testimonial.data?.role || "";
                        const company = testimonial.company || testimonial.data?.company || "";
                        const avatar = testimonial.avatar || testimonial.data?.avatar || "/images/testimonials/default.png";

                        return (
                          <li class="splide__slide py-3">
                            <Card class="h-full">
                              <CardContent class="flex h-full flex-col gap-6">
                                <CardDescription>
                                  <p class="text-base sm:text-lg leading-relaxed text-foreground/85 font-normal">
                                    &ldquo;{testimonial.body?.trim()}&rdquo;
                                  </p>
                                </CardDescription>
                                <div class="mt-auto flex items-center gap-4">
                                  <figure class="border-border block aspect-square size-14 shrink-0 overflow-hidden rounded-full border shadow-sm">
                                    <img
                                      src={avatar}
                                      alt={name}
                                      width="100"
                                      height="100"
                                      class="h-full w-full object-cover object-center"
                                    />
                                  </figure>
                                  <div>
                                    <CardTitle class="text-base sm:text-lg font-semibold text-foreground">
                                      {name}
                                    </CardTitle>
                                    <p class="text-muted-foreground text-xs sm:text-sm">
                                      {role}
                                    </p>
                                    <p class="text-muted-foreground/75 text-xs">
                                      {company}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </li>
                        );
                      })}
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
