import { JSX, splitProps } from "solid-js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 rounded-md px-6 text-sm [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9 [&_svg:not([class*='size-'])]:size-4.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  as?: string | ((props: any) => JSX.Element);
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["class", "variant", "size", "as", "asChild", "children", "href", "target", "rel"]);

  // If href is passed or children is a single anchor in asChild mode, render as <a> or respect component
  if (local.href) {
    return (
      <a
        href={local.href}
        target={local.target}
        rel={local.rel}
        data-slot="button"
        class={cn(buttonVariants({ variant: local.variant, size: local.size }), local.class)}
        {...(others as any)}
      >
        {local.children}
      </a>
    );
  }

  return (
    <button
      data-slot="button"
      class={cn(buttonVariants({ variant: local.variant, size: local.size }), local.class)}
      {...others}
    >
      {local.children}
    </button>
  );
}

export { Button, buttonVariants };
