import CalCom from "@/components/global/calcom";
import Container from "@/components/layouts/container";
import ThemeSwitcher from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Brand from "@/components/ui/global/brand";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeProvider } from "@/context/theme";
import { RiGithubLine, RiLinkedinLine, RiTextWrap } from "@remixicon/react";

const navigationItems = [
  {
    id: 1,
    title: "Services",
    href: "/#services",
  },
  {
    id: 2,
    title: "Case Studies",
    href: "/#caseStudies",
  },
  {
    id: 3,
    title: "Experience",
    href: "/#experience",
  },
  {
    id: 4,
    title: "Testimonials",
    href: "/#testimonials",
  },
  {
    id: 5,
    title: "Contact",
    href: "/#contact",
  },
];

const socialItems = [
  {
    id: 1,
    title: "Github",
    href: "https://github.com/aminbabu",
    icon: RiGithubLine,
  },
  {
    id: 2,
    title: "Linkedin",
    href: "https://www.linkedin.com/in/aminbabu",
    icon: RiLinkedinLine,
  },
];

const Header = () => {
  return (
    <ThemeProvider>
      <header className="border-border bg-background/10 fixed inset-x-0 top-0 z-50 border-b border-dashed backdrop-blur-3xl">
        <Container className="container">
          <div className="md:border-x-border flex items-center justify-between gap-x-4 py-3 md:border-x md:border-dashed md:px-4 lg:gap-x-6">
            <Brand className="text-primary group relative hidden px-1.5 font-mono text-sm md:block">
              <span className="border-primary/60 group-hover:bg-border absolute inset-0 -z-10 border border-dashed bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed transition-colors duration-300"></span>
              ./ab
              <svg
                width="5"
                height="5"
                viewBox="0 0 5 5"
                className="fill-primary absolute -left-0.5 -top-0.5"
              >
                <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
              </svg>
              <svg
                width="5"
                height="5"
                viewBox="0 0 5 5"
                className="fill-primary absolute -right-0.5 -top-0.5"
              >
                <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
              </svg>
              <svg
                width="5"
                height="5"
                viewBox="0 0 5 5"
                className="fill-primary absolute -bottom-0.5 -left-0.5"
              >
                <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
              </svg>
              <svg
                width="5"
                height="5"
                viewBox="0 0 5 5"
                className="fill-primary absolute -bottom-0.5 -right-0.5"
              >
                <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
              </svg>
            </Brand>
            <ul className="mr-auto hidden items-center gap-x-3.5 md:flex lg:gap-x-5">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="hover:text-foreground/75 text-sm transition-colors duration-300"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
            <Sheet>
              <SheetTrigger className="cursor-pointer md:hidden">
                <RiTextWrap />
              </SheetTrigger>
              <SheetContent side="bottom" className="border-dashed">
                <SheetHeader>
                  <SheetTitle asChild>
                    <Brand className="text-primary group relative px-1.5 font-mono text-sm self-start">
                      <span className="border-primary/60 group-hover:bg-border absolute inset-0 -z-10 border border-dashed bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed transition-colors duration-300"></span>
                      ./ab
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        className="fill-primary absolute -left-0.5 -top-0.5"
                      >
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                      </svg>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        className="fill-primary absolute -right-0.5 -top-0.5"
                      >
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                      </svg>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        className="fill-primary absolute -bottom-0.5 -left-0.5"
                      >
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                      </svg>
                      <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        className="fill-primary absolute -bottom-0.5 -right-0.5"
                      >
                        <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
                      </svg>
                    </Brand>
                  </SheetTitle>
                </SheetHeader>
                <ul className="flex flex-col gap-y-3 px-4">
                  {navigationItems.map((item) => (
                    <li key={item.id}>
                      <SheetClose asChild>
                        <a
                          href={item.href}
                          className="hover:text-foreground/75 text-sm transition-colors duration-300"
                        >
                          {item.title}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <SheetFooter>
                  <ul className="flex items-center gap-x-3">
                    {socialItems.map((item) => (
                      <li key={item.id}>
                        <SheetClose asChild>
                          <Button variant="ghost" size="icon">
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <item.icon className="size-5" />
                            </a>
                          </Button>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <ul className="ml-auto flex items-center gap-x-1">
              {socialItems.map((item) => (
                <li key={item.id} className="hidden md:block">
                  <Button variant="ghost" size="icon">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <item.icon className="size-5" />
                    </a>
                  </Button>
                </li>
              ))}
              <li>
                <ThemeSwitcher />
              </li>
              <li>
                <CalCom type="popup" />
              </li>
            </ul>
          </div>
        </Container>
      </header>
    </ThemeProvider>
  );
};

export default Header;
