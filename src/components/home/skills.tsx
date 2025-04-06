import DecoratorUI from "@/components/decorator-ui";
import Section from "@/components/layouts/section";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/global/heading";
import { Paragraph } from "@/components/ui/global/paragraph";

const skillCategories = [
  {
    id: 1,
    title: "Front-end",
    skills: [
      {
        id: 1,
        name: "HTML5",
      },
      {
        id: 2,
        name: "CSS3",
      },
      {
        id: 3,
        name: "Bootstrap",
      },
      {
        id: 4,
        name: "JQuery",
      },
      {
        id: 5,
        name: "Tailwind CSS",
      },
      {
        id: 6,
        name: "JavaScript ES6+",
      },
      {
        id: 7,
        name: "TypeScript",
      },
      {
        id: 8,
        name: "ReactJS",
      },
      {
        id: 9,
        name: "NextJS",
      },
      {
        id: 10,
        name: "VueJS",
      },
      {
        id: 11,
        name: "SolidJS",
      },
    ],
  },
  {
    id: 2,
    title: "Back-end",
    skills: [
      {
        id: 1,
        name: "NodeJS",
      },
      {
        id: 2,
        name: "ExpressJS",
      },
      {
        id: 3,
        name: "NestJS",
      },
      {
        id: 3,
        name: "PHP",
      },
      {
        id: 4,
        name: "Laravel",
      },
      {
        id: 5,
        name: "Python",
      },
      {
        id: 6,
        name: "Django",
      },
    ],
  },
  {
    id: 3,
    title: "Databases",
    skills: [
      {
        id: 1,
        name: "MySQL/MariaDB",
      },
      {
        id: 2,
        name: "PostgreSQL",
      },
      {
        id: 3,
        name: "MongoDB",
      },
      {
        id: 5,
        name: "Firebase",
      },
    ],
  },
  {
    id: 4,
    title: "CMS",
    skills: [
      {
        id: 1,
        name: "WordPress",
      },
      {
        id: 2,
        name: "Webflow",
      },
    ],
  },
  {
    id: 5,
    title: "Tools",
    skills: [
      {
        id: 1,
        name: "Git",
      },
      {
        id: 2,
        name: "GitHub",
      },
      {
        id: 3,
        name: "GitLab",
      },
      {
        id: 4,
        name: "Bitbucket",
      },
      {
        id: 5,
        name: "NPM",
      },
      {
        id: 6,
        name: "Yarn",
      },
      {
        id: 7,
        name: "PNPM",
      },
      {
        id: 8,
        name: "Composer",
      },
      {
        id: 9,
        name: "Webpack",
      },
      {
        id: 10,
        name: "Vite",
      },
      {
        id: 11,
        name: "Babel",
      },
      {
        id: 12,
        name: "ESLint",
      },
      {
        id: 13,
        name: "Prettier",
      },
      {
        id: 14,
        name: "Websockets",
      },
    ],
  },
  {
    id: 6,
    title: "Others",
    skills: [
      {
        id: 1,
        name: "Linux",
      },
      {
        id: 2,
        name: "SEO Best Practices",
      },
      {
        id: 3,
        name: "Accessibility",
      },
      {
        id: 4,
        name: "Debugging",
      },
      {
        id: 5,
        name: "Cross-Browser Support",
      },
      {
        id: 6,
        name: "Responsive Design",
      },
      {
        id: 7,
        name: "Web Performance Optimization",
      },
      {
        id: 8,
        name: "ChatGPT",
      },
      {
        id: 9,
        name: "Grok",
      },
      {
        id: 10,
        name: "Postman",
      },
    ],
  },
];

const Skills = () => {
  return (
    <Section id="services">
      <Paragraph className="mb-3 font-mono font-medium md:text-right">
        ./skills
      </Paragraph>
      <DecoratorUI>
        <Heading className="mb-2 max-w-sm sm:max-w-2xl lg:max-w-3xl">
          Tools of My Trade. Skills That Ship.
        </Heading>
      </DecoratorUI>
      <DecoratorUI className="mb-16 before:-bottom-2 before:border-t-0 lg:mb-20">
        <Paragraph className="max-w-2xl">
          From crafting sleek user interfaces to building fast, scalable
          backends—these are the technologies I use to turn ideas into smooth,
          functional, and user-friendly web experiences. I don't just write
          code—I solve problems and build with purpose.
        </Paragraph>
      </DecoratorUI>
      <div className="before:bg-secondary relative before:absolute before:-inset-3 before:-z-10">
        <DecoratorUI className="space-y-6 before:-inset-y-3 p-3">
          {skillCategories?.map((category) => (
            <div key={category?.id} className="space-y-3">
              <Heading
                asChild
                className="col-span-12 text-base sm:text-base lg:text-lg xl:text-xl font-bold"
              >
                <h3>{category.title}</h3>
              </Heading>
              <div className="flex flex-wrap gap-3">
                {category?.skills?.map((skill) => (
                  <Badge key={skill?.id} variant="default">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </DecoratorUI>
      </div>
    </Section>
  );
};

export default Skills;
