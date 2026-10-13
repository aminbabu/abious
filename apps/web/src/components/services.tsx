import { Splide } from "@splidejs/splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import { createResource, Show, createEffect, onCleanup } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import CalCom from "~/components/global/calcom";
import Section from "~/components/section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import ServicesLoader from "~/components/ui/loaders/services";
import { api, type IServiceItem } from "~/lib/api";
import { SERVICE_ICONS_MAP } from "~/components/dashboard/icon-picker";
import { RiBusinessWindowLine } from "solid-icons/ri";

function getServiceIcon(iconName: string) {
  return SERVICE_ICONS_MAP[iconName] || RiBusinessWindowLine;
}

export default function Services() {
  const [data] = createResource<IServiceItem[]>(() => api.services.list());

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
          gap: "1rem",
        },
        1024: {
          perPage: 3,
          gap: "1rem",
        },
        1280: {
          perPage: 4,
          gap: "1rem",
        },
      },
    });
    splideInstance.mount({ AutoScroll });
  });

  onCleanup(() => {
    destroySplide();
  });

  return (
    <Section id="services">
      <Paragraph class="mb-3 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        ./services
      </Paragraph>
      <DecoratorUI>
        <Heading class="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Powering Your Web
        </Heading>
      </DecoratorUI>
      <DecoratorUI class="mb-16 before:-bottom-2 before:border-t-0 lg:mb-20">
        <Paragraph class="max-w-2xl text-muted-foreground text-base sm:text-lg">
          {"Building fast, scalable, and intuitive solutions—whether it's web development, backend APIs, WordPress, or debugging, I ensure performance and innovation in every project."}
        </Paragraph>
      </DecoratorUI>

      <Show
        when={!data.loading}
        fallback={
          <DecoratorUI class="py-px before:bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:bg-fixed">
            <div class="-mx-3 bg-secondary p-3">
              <ServicesLoader count={4} />
            </div>
          </DecoratorUI>
        }
      >
        <Show
          when={!data.error && data()?.length}
          fallback={
            <DecoratorUI class="py-px before:bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:bg-fixed">
              <div class="-mx-3 bg-secondary p-6 text-center text-muted-foreground">
                <p>{data.error ? "Failed to load services." : "No services available."}</p>
              </div>
            </DecoratorUI>
          }
        >
          <div
            ref={splideEl}
            class="splide -mt-3"
            aria-label="Services"
          >
            <DecoratorUI class="py-px before:bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:bg-fixed">
              <div class="-mx-3 bg-secondary p-3">
                <div class="splide__track">
                  <ul class="splide__list">
                    {data()?.map((work) => {
                      const IconComponent = getServiceIcon(work.icon);
                      return (
                        <li class="splide__slide flex h-full py-2">
                          <Card class="flex h-full w-full flex-col justify-between bg-background transition-all duration-300 hover:border-foreground/30 hover:shadow-md">
                            <div>
                              <CardHeader>
                                <IconComponent class="size-9 text-primary transition-transform duration-300 group-hover:scale-110" />
                              </CardHeader>
                              <CardContent class="space-y-2">
                                <CardTitle class="text-foreground text-lg">
                                  {work.title}
                                </CardTitle>
                                <CardDescription class="text-muted-foreground leading-normal">
                                  {work.description}
                                </CardDescription>
                              </CardContent>
                            </div>
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

      <DecoratorUI class="mt-16 text-center">
        <CalCom title="Let's Talk" size="lg" type="popup" />
      </DecoratorUI>
    </Section>
  );
}
