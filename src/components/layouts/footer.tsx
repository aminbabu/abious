import DecoratorUI from "@/components/decorator-ui";
import Container from "@/components/layouts/container";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

const languages = [
  {
    id: 1,
    name: "Bengali",
  },
  {
    id: 2,
    name: "English",
  },
  {
    id: 3,
    name: "Hindi",
  },
];

const Footer = () => {
  return (
    <footer className="mt-auto overflow-hidden">
      <Container className="container">
        <DecoratorUI className="flex flex-col items-center justify-between gap-2 gap-x-6 py-5 before:border-b-0 before:bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] before:bg-[size:10px_10px] before:bg-fixed sm:flex-row md:px-3">
          <p className="text-sm font-medium">
            &copy; {dayjs().format("YYYY")} Design & Developed by Amin Babu
          </p>
          <ul className="flex gap-x-2">
            {languages.map((language, index) => (
              <li
                key={language.id}
                className={cn("flex items-center gap-x-2 text-sm", {
                  'before:content-["/"]': index !== 0,
                  "font-semibold before:font-normal":
                    language.name === "English",
                })}
              >
                {language.name}
              </li>
            ))}
          </ul>
        </DecoratorUI>
      </Container>
    </footer>
  );
};

export default Footer;
