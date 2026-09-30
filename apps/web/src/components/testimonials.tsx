import { createResource, onMount, onCleanup, Show } from "solid-js";
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

export interface ITestimonial {
  id: string;
  data: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  body: string;
}

async function fetchTestimonials(): Promise<ITestimonial[]> {
  try {
    const res = await fetch("https://api.abious.ddev.site/api/testimonials");
    if (!res.ok) throw new Error("Failed to fetch testimonials");
    return await res.json();
  } catch (e) {
    return [
      {
        id: "graham-brookins",
        data: {
          name: "Graham Brookins",
          role: "Client & Founder",
          company: "Brookins Consulting",
          avatar: "/images/testimonials/graham.png",
        },
        body: "Amin delivered incredible engineering quality under tight deadlines. His ability to understand our business vision and translate it into high-performance web applications was exceptional.",
      },
      {
        id: "mohammad-kais-rayhan",
        data: {
          name: "Mohammad Kais Rayhan",
          role: "Head of Engineering",
          company: "Notionhive",
          avatar: "/images/testimonials/kais.png",
        },
        body: "Working alongside Amin is effortless. He brings strong architectural discipline, pristine front-end execution, and an uncompromising eye for user experience.",
      },
    ];
  }
}

export default function Testimonials() {
  const [data] = createResource(fetchTestimonials);
  let splideEl: HTMLDivElement | undefined;
  let splideInstance: Splide | null = null;

  const initSplide = () => {
    if (splideEl && !splideInstance && data()?.length) {
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
    <Section id="testimonials">
      <Paragraph class="mb-3 font-mono font-medium md:text-right">
        ./testimonials
      </Paragraph>
      <DecoratorUI class="mb-16 lg:mb-20">
        <Heading class="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
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
              ref={(el) => {
                splideEl = el;
                initSplide();
              }}
              class="splide -mt-3"
              aria-label="Testimonials"
            >
              <DecoratorUI class="py-px before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed">
                <div class="-mx-3 bg-secondary px-3">
                  <div class="splide__track">
                    <ul class="splide__list">
                      {data()?.map((testimonial) => (
                        <li class="splide__slide py-3">
                          <Card class="h-full">
                            <CardContent class="flex h-full flex-col gap-6">
                              <CardDescription>
                                <p class="text-lg leading-relaxed text-foreground/90">
                                  {testimonial.body}
                                </p>
                              </CardDescription>
                              <div class="mt-auto flex items-center gap-4">
                                <figure class="border-border block aspect-square size-16 overflow-hidden rounded-full border shadow">
                                  <img
                                    src={testimonial.data.avatar}
                                    alt={testimonial.data.name}
                                    width="100"
                                    height="100"
                                    class="h-full w-full object-cover object-center"
                                  />
                                </figure>
                                <div>
                                  <CardTitle class="text-lg font-semibold">
                                    {testimonial.data.name}
                                  </CardTitle>
                                  <CardDescription class="text-muted-foreground text-sm">
                                    {testimonial.data.role}
                                  </CardDescription>
                                  <CardDescription class="text-muted-foreground text-sm">
                                    {testimonial.data.company}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </li>
                      ))}
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
