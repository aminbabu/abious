import { Splide } from "@splidejs/splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import dayjs from "dayjs";
import { onCleanup, onMount } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import { cn } from "~/lib/utils";

const experiences = [
  {
    id: 1,
    positions: [
      {
        id: 1,
        title: "Junior Engineer",
        startDate: "2025-11-03",
        endDate: "present",
        type: "Full-time",
      },
    ],
    company: "JB Connect Ltd",
    location: "Banani, Dhaka",
    logo: "/images/experience/jbc.svg",
  },
  {
    id: 2,
    positions: [
      {
        id: 1,
        title: "MERN-Stack Developer",
        startDate: "2023-08-01",
        endDate: "present",
        type: "Freelance",
      },
    ],
    company: "7x",
    location: "Tukwila, Washington",
    logo: "/images/experience/7x.png",
  },
  {
    id: 3,
    positions: [
      {
        id: 1,
        title: "Web Developer",
        startDate: "2023-07-01",
        endDate: "2024-11-30",
        type: "Full-time",
      },
    ],
    company: "Notionhive",
    location: "Uttara, Dhaka",
    logo: "/images/experience/notionhive.png",
  },
  {
    id: 4,
    positions: [
      {
        id: 1,
        title: "Web Designer",
        startDate: "2022-03-01",
        endDate: "2022-06-30",
        type: "Full-time",
      },
    ],
    company: "Expert IT Solution",
    location: "Kallianpur, Dhaka",
    logo: "/images/experience/expert.png",
  },
];

export default function Experience() {
  let splideEl: HTMLDivElement | undefined;
  let splideInstance: Splide | null = null;

  const initSplide = () => {
    if (splideEl && !splideInstance && experiences.length) {
      splideInstance = new Splide(splideEl, {
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
    <Section id="experience">
      <Paragraph class="mb-3 font-mono text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground/80 md:text-right">
        ./experience
      </Paragraph>
      <DecoratorUI class="mb-16 lg:mb-20">
        <Heading class="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Every Pixel Speaks
        </Heading>
      </DecoratorUI>

      <div
        ref={(el) => {
          splideEl = el;
          initSplide();
        }}
        class="splide -mt-3"
        aria-label="Experience"
      >
        <DecoratorUI class="py-px before:bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:bg-fixed">
          <div class="-mx-3 bg-secondary px-6 py-6 md:px-8 md:py-8">
            <div class="splide__track">
              <ul class="splide__list">
                {experiences.map((work) => (
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
                        {work.positions.map((position, index) => (
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
    </Section>
  );
}
