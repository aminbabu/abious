import DecoratorUI from "@/components/decorator-ui";
import CalCom from "@/components/global/calcom";
import Section from "@/components/layouts/section";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";
import { ThemeProvider } from "@/context/theme";
import {
  RiBootstrapLine,
  RiCss3Fill,
  RiDatabase2Line,
  RiFigmaLine,
  RiFirebaseLine,
  RiGithubLine,
  RiGitlabLine,
  RiHtml5Line,
  RiJavascriptLine,
  RiNextjsLine,
  RiNodejsLine,
  RiPhpLine,
  RiReactjsLine,
  RiTailwindCssLine,
  RiVuejsLine,
  RiWordpressLine,
} from "@remixicon/react";

const skills = [
  {
    id: 1,
    name: "JavaScript",
    icon: RiJavascriptLine,
  },
  {
    id: 2,
    name: "React",
    icon: RiReactjsLine,
  },
  {
    id: 3,
    name: "NextJs",
    icon: RiNextjsLine,
  },
  {
    id: 4,
    name: "VueJS",
    icon: RiVuejsLine,
  },
  {
    id: 5,
    name: "Tailwind",
    icon: RiTailwindCssLine,
  },
  {
    id: 6,
    name: "HTML5",
    icon: RiHtml5Line,
  },
  {
    id: 7,
    name: "CSS3",
    icon: RiCss3Fill,
  },
  {
    id: 8,
    name: "PHP",
    icon: RiPhpLine,
  },
  {
    id: 9,
    name: "NodeJS",
    icon: RiNodejsLine,
  },
  {
    id: 10,
    name: "WordPress",
    icon: RiWordpressLine,
  },
  {
    id: 11,
    name: "Database",
    icon: RiDatabase2Line,
  },
  {
    id: 12,
    name: "Bootstrap",
    icon: RiBootstrapLine,
  },
  {
    id: 13,
    name: "GitHub",
    icon: RiGithubLine,
  },
  {
    id: 14,
    name: "Firebase",
    icon: RiFirebaseLine,
  },
  {
    id: 15,
    name: "GitLab",
    icon: RiGitlabLine,
  },
  {
    id: 16,
    name: "Figma",
    icon: RiFigmaLine,
  },
];

const Hero = () => {
  return (
    <Section className="pt-20 lg:pt-20">
      <Paragraph className="mb-3 font-mono font-medium md:text-right">
        ./aminbabu
      </Paragraph>
      <DecoratorUI>
        <Heading asChild size="lg">
          <h1 className="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            Transforming Ideas into Powerful Digital Solutions
          </h1>
        </Heading>
      </DecoratorUI>
      <DecoratorUI className="mb-16 before:-bottom-3 before:border-t-0 lg:mb-20">
        <Paragraph size="lg" className="max-w-3xl">
          Expert in crafting responsive web and mobile applications using
          JavaScript, Next.js, NestJS, MERN stack, PHP, Laravel, WordPress,
          Webflow, and more — delivering seamless and high-performance user
          experiences across platforms.
        </Paragraph>
      </DecoratorUI>
      <DecoratorUI className="mb-16 flex items-center gap-3 lg:mb-20">
        <ThemeProvider>
          <CalCom title="Discuss Your Project" size="lg" type="popup" />
        </ThemeProvider>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="cursor-pointer rounded-full"
        >
          <a href="/resume/Resume - Amin Babu.pdf" target="_blank">
            Resume
          </a>
        </Button>
      </DecoratorUI>
      <DecoratorUI className="bg-background pointer-events-none -rotate-3 before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed md:-mx-5">
        <div className="flex -translate-x-full items-center animate-marquee">
          {[
            ...skills,
            ...skills.map((skill) => ({ ...skill, id: skill.id + 100 })),
            ...skills.map((skill) => ({ ...skill, id: skill.id + 200 })),
          ].map((skill) => (
            <div
              key={skill.id}
              className="inline-flex items-center justify-center p-6 md:p-7 lg:p-8"
            >
              <skill.icon className="size-10 lg:size-12" />
            </div>
          ))}
        </div>
      </DecoratorUI>
    </Section>
  );
};

export default Hero;
