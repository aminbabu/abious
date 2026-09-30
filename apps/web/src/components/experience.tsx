import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";
import { cn } from "~/lib/utils";
import dayjs from "dayjs";

const experiences = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
  return (
    <Section id="experience">
      <Paragraph class="mb-3 font-mono font-medium md:text-right">
        ./experience
      </Paragraph>
      <DecoratorUI class="mb-16 lg:mb-20">
        <Heading class="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Every Pixel Speaks
        </Heading>
      </DecoratorUI>
      <DecoratorUI class="before:-inset-y-3">
        <ul class="before:bg-secondary relative -mt-2 grid grid-cols-6 gap-y-10 py-3 before:absolute before:-inset-3 before:-z-10 sm:gap-x-6">
          {experiences.map((work) => (
            <li class="col-span-6 flex gap-x-3 sm:col-span-3 lg:col-span-2">
              <figure class="border-border bg-background aspect-square size-10 shrink-0 overflow-hidden rounded-full border shadow-sm">
                <img
                  src={work.logo}
                  alt={work.company}
                  width="56"
                  height="56"
                  class="h-full w-full object-cover object-center"
                />
              </figure>
              <div>
                <h3 class="font-bold">{work.company}</h3>
                <p class="text-sm font-medium opacity-50">
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
                        }
                      )}
                    >
                      <p class="text-sm font-medium">{position.title}</p>
                      <p class="text-sm opacity-80">
                        {dayjs(position.startDate).format("MMM DD, YYYY")} -{" "}
                        {position.endDate === "present"
                          ? "Present"
                          : dayjs(position.endDate).format("MMM DD, YYYY")}{" "}
                        (
                        <span class="font-semibold">
                          {position.endDate === "present"
                            ? dayjs().diff(dayjs(position.startDate), "month")
                            : dayjs(position.endDate).diff(
                                dayjs(position.startDate),
                                "month"
                              )}{" "}
                          months)
                        </span>
                      </p>
                      <p class="text-sm font-semibold">{position.type}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </DecoratorUI>
    </Section>
  );
}
