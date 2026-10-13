import { JSX } from "solid-js";
import { A } from "@solidjs/router";
import { RiArrowsArrowLeftLine, RiSystemShieldKeyholeLine } from "solid-icons/ri";
import Container from "~/components/container";
import ThemeSwitcher from "~/components/theme-switcher";

export default function AuthLayout(props: {
  title: string;
  subtitle?: string;
  icon?: (props: any) => JSX.Element;
  children: JSX.Element;
}) {
  const IconComponent = () => props.icon ? props.icon({ class: "size-6 text-primary" }) : <RiSystemShieldKeyholeLine class="size-6 text-primary" />;

  return (
    <div class="min-h-screen flex flex-col justify-between bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Top Navbar Header */}
      <header class="py-4">
        <Container>
          <div class="flex items-center justify-between">
            <A
              href="/"
              class="text-primary group relative px-1.5 font-mono text-sm font-medium inline-block select-none"
              aria-label="Amin Babu Home"
            >
              <span class="border-primary/60 group-hover:bg-border absolute inset-0 -z-10 border border-dashed bg-[image:repeating-linear-gradient(315deg,_var(--border)_0,_var(--border)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed transition-colors duration-300"></span>
              ./ab
              <svg width="5" height="5" viewBox="0 0 5 5" class="fill-primary absolute -left-0.5 -top-0.5 pointer-events-none">
                <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
              </svg>
              <svg width="5" height="5" viewBox="0 0 5 5" class="fill-primary absolute -right-0.5 -top-0.5 pointer-events-none">
                <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
              </svg>
              <svg width="5" height="5" viewBox="0 0 5 5" class="fill-primary absolute -bottom-0.5 -left-0.5 pointer-events-none">
                <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
              </svg>
              <svg width="5" height="5" viewBox="0 0 5 5" class="fill-primary absolute -bottom-0.5 -right-0.5 pointer-events-none">
                <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
              </svg>
            </A>

            <div class="flex items-center gap-3">
              <A
                href="/"
                class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                <RiArrowsArrowLeftLine class="size-3.5" />
                <span>Back to site</span>
              </A>
              <ThemeSwitcher />
            </div>
          </div>
        </Container>
      </header>

      {/* Main Form Center Area */}
      <main class="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div class="w-full max-w-md">
          <div class="text-center mb-6 flex flex-col items-center">
            <div class="mb-3.5 flex size-12 items-center justify-center rounded-xl border border-dashed border-border bg-card/80 shadow-xs backdrop-blur-xs">
              <IconComponent />
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-foreground">
              {props.title}
            </h1>
            {props.subtitle && (
              <p class="text-sm text-muted-foreground mt-1.5">
                {props.subtitle}
              </p>
            )}
          </div>
          {props.children}
        </div>
      </main>
    </div>
  );
}
