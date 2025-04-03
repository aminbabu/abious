import DecoratorUI from "@/components/decorator-ui";
import CalCom from "@/components/global/calcom";
import Section from "@/components/layouts/section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";
import { ThemeProvider } from "@/context/theme";
import {
  RiBugLine,
  RiLinksLine,
  RiSlashCommands2,
  RiWindowLine,
} from "@remixicon/react";

const services = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Building high-performance, scalable websites and web applications using modern frameworks like Next.js, React, and Vue.",
    icon: RiWindowLine,
  },
  {
    id: 2,
    title: "API & Backend Development",
    description:
      "Crafting secure, scalable, and efficient APIs and backend solutions using NestJS, Node.js, PostgreSQL, MySQL, Firebase, Supabase, and Laravel.",
    icon: RiLinksLine,
  },
  {
    id: 3,
    title: "WordPress & Webflow Solutions",
    description:
      "Custom WordPress themes, plugins, and Webflow-powered websites tailored for seamless performance and design.",
    icon: RiSlashCommands2,
  },
  {
    id: 4,
    title: "Debugging & Support",
    description:
      "Identifying and resolving issues to ensure optimal performance, security, and a flawless user experience.",
    icon: RiBugLine,
  },
];

const Services = () => {
  return (
    <Section id="services">
      <Paragraph className="mb-3 font-mono font-medium md:text-right">
        ./services
      </Paragraph>
      <DecoratorUI>
        <Heading className="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Powering Your Web
        </Heading>
      </DecoratorUI>
      <DecoratorUI className="mb-16 before:-bottom-2 before:border-t-0 lg:mb-20">
        <Paragraph className="max-w-2xl">
          Building fast, scalable, and intuitive solutions—whether it&apos;s web
          development, backend APIs, WordPress, or debugging, I ensure
          performance and innovation in every project.
        </Paragraph>
      </DecoratorUI>
      <div className="before:bg-secondary relative before:absolute before:-inset-3 before:-z-10">
        <DecoratorUI className="grid grid-cols-12 gap-y-3 before:-inset-y-3 md:gap-x-3">
          {services.map((work) => (
            <Card
              key={work.id}
              className="bg-background col-span-12 md:col-span-6 lg:col-span-3"
            >
              <CardHeader>
                <work.icon className="size-12" />
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle>{work.title}</CardTitle>
                <CardDescription>{work.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </DecoratorUI>
      </div>
      <DecoratorUI className="mt-16 text-center">
        <ThemeProvider>
          <CalCom title="Let's Talk" size="lg" type="popup" />
        </ThemeProvider>
      </DecoratorUI>
    </Section>
  );
};

export default Services;
