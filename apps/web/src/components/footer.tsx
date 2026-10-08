import dayjs from "dayjs";
import Container from "~/components/container";
import DecoratorUI from "~/components/decorator-ui";
import { cn } from "~/lib/utils";

const languages = [
  { id: 1, name: "Bengali" },
  { id: 2, name: "English" },
  { id: 3, name: "Hindi" },
];

export default function Footer() {
  return (
    <footer class="overflow-hidden relative z-0">
      <Container>
        <div class="border-border md:border-x md:border-dashed">
          <DecoratorUI class="flex flex-col items-center justify-between gap-2 gap-x-6 py-5 before:border-b-0 before:bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:bg-fixed sm:flex-row md:px-3">
            <p class="text-sm text-muted-foreground">
              &copy; {dayjs().format("YYYY")} Design & Developed by{" "}
              <span class="font-medium text-foreground">Amin Babu</span>
            </p>
            <ul class="flex gap-x-2 text-muted-foreground">
              {languages.map((language, index) => (
                <li
                  class={cn("flex items-center gap-x-2 text-sm", {
                    'before:content-["/"] before:text-muted-foreground/50':
                      index !== 0,
                    "font-semibold text-foreground before:font-normal":
                      language.name === "English",
                  })}
                >
                  {language.name}
                </li>
              ))}
            </ul>
          </DecoratorUI>
        </div>
      </Container>
    </footer>
  );
}
