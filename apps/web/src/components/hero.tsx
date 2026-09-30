import DecoratorUI from "~/components/decorator-ui";
import CalCom from "~/components/global/calcom";
import Section from "~/components/section";
import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/global/heading";
import { Paragraph } from "~/components/ui/global/paragraph";

const skills = [
  { id: 1, name: "JavaScript", icon: "ri-javascript-line" },
  { id: 2, name: "React", icon: "ri-reactjs-line" },
  { id: 3, name: "NextJs", icon: "ri-nextjs-line" },
  { id: 4, name: "VueJS", icon: "ri-vuejs-line" },
  { id: 5, name: "Tailwind", icon: "ri-tailwind-css-line" },
  { id: 6, name: "HTML5", icon: "ri-html5-line" },
  { id: 7, name: "CSS3", icon: "ri-css3-fill" },
  { id: 8, name: "PHP", icon: "ri-php-line" },
  { id: 9, name: "NodeJS", icon: "ri-nodejs-line" },
  { id: 10, name: "WordPress", icon: "ri-wordpress-line" },
  { id: 11, name: "Database", icon: "ri-database-2-line" },
  { id: 12, name: "Bootstrap", icon: "ri-bootstrap-line" },
  { id: 13, name: "GitHub", icon: "ri-github-line" },
  { id: 14, name: "Firebase", icon: "ri-firebase-line" },
  { id: 15, name: "GitLab", icon: "ri-gitlab-line" },
  { id: 16, name: "Figma", icon: "ri-figma-line" },
];

export default function Hero() {
  return (
    <Section class="pt-20 lg:pt-20">
      <Paragraph class="mb-3 font-mono font-medium md:text-right">
        ./aminbabu
      </Paragraph>
      <DecoratorUI>
        <Heading asChild size="lg">
          <h1 class="mb-3 max-w-sm sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            Transforming Ideas into Powerful Digital Solutions
          </h1>
        </Heading>
      </DecoratorUI>
      <DecoratorUI class="mb-16 before:-bottom-3 before:border-t-0 lg:mb-20">
        <Paragraph size="lg" class="max-w-3xl">
          Expert in crafting responsive web and mobile applications using
          JavaScript, Next.js, NestJS, MERN stack, PHP, Laravel, WordPress,
          Webflow, and more — delivering seamless and high-performance user
          experiences across platforms.
        </Paragraph>
      </DecoratorUI>
      <DecoratorUI class="mb-16 flex items-center gap-3 lg:mb-20">
        <CalCom title="Discuss Your Project" size="lg" type="popup" />
        <Button
          asChild
          size="lg"
          variant="outline"
          class="cursor-pointer rounded-full"
        >
          <a href="/resume/Resume - Amin Babu.pdf" target="_blank">
            Resume
          </a>
        </Button>
      </DecoratorUI>
      <DecoratorUI class="bg-background pointer-events-none -rotate-3 before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed md:-mx-5">
        <div class="flex -translate-x-full items-center animate-marquee">
          {[
            ...skills,
            ...skills.map((skill) => ({ ...skill, id: skill.id + 100 })),
            ...skills.map((skill) => ({ ...skill, id: skill.id + 200 })),
          ].map((skill) => (
            <div
              key={skill.id}
              class="inline-flex items-center justify-center p-6 md:p-7 lg:p-8"
            >
              <i class={`${skill.icon} text-4xl lg:text-5xl leading-none`} />
            </div>
          ))}
        </div>
      </DecoratorUI>
    </Section>
  );
}
