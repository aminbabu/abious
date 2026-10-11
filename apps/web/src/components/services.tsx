import { createResource, Show } from "solid-js";
import {
  RiBusinessLinksLine,
  RiBusinessWindowLine,
  RiDevelopmentBugLine,
  RiEditorSlashCommands,
  RiDeviceServerLine,
  RiDesignPencilLine,
  RiDevelopmentCodeSSlashLine,
} from "solid-icons/ri";
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

const iconMap: Record<string, any> = {
  RiBusinessWindowLine,
  RiBusinessLinksLine,
  RiEditorSlashCommands,
  RiDevelopmentBugLine,
  RiDeviceServerLine,
  RiDesignPencilLine,
  RiDevelopmentCodeSSlashLine,
};

function getServiceIcon(iconName: string) {
  return iconMap[iconName] || RiBusinessWindowLine;
}

export default function Services() {
  const [data] = createResource<IServiceItem[]>(() => api.services.list());

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
          Building fast, scalable, and intuitive solutions—whether it&apos;s web
          development, backend APIs, WordPress, or debugging, I ensure
          performance and innovation in every project.
        </Paragraph>
      </DecoratorUI>

      <div class="relative z-0 before:absolute before:-inset-3 before:-z-10 before:bg-secondary">
        <Show
          when={!data.loading}
          fallback={
            <DecoratorUI class="before:-inset-y-3">
              <ServicesLoader count={4} />
            </DecoratorUI>
          }
        >
          <Show
            when={!data.error && data()?.length}
            fallback={
              <DecoratorUI class="py-6 text-center text-muted-foreground before:-inset-y-3">
                <p>{data.error ? "Failed to load services." : "No services available."}</p>
              </DecoratorUI>
            }
          >
            <DecoratorUI class="grid grid-cols-12 gap-y-3 before:-inset-y-3 md:gap-x-3">
              {data()?.map((work) => {
                const IconComponent = getServiceIcon(work.icon);
                return (
                  <Card class="col-span-12 bg-background md:col-span-6 lg:col-span-3 transition-all duration-300 hover:border-foreground/30 hover:shadow-md">
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
                  </Card>
                );
              })}
            </DecoratorUI>
          </Show>
        </Show>
      </div>

      <DecoratorUI class="mt-16 text-center">
        <CalCom title="Let's Talk" size="lg" type="popup" />
      </DecoratorUI>
    </Section>
  );
}

