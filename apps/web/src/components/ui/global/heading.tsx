import { JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const headingVariants = cva("relative font-medium capitalize text-primary", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
    },
    size: {
      default: "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl",
      sm: "text-2xl sm:text-3xl lg:text-4xl",
      lg: "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface HeadingProps
  extends JSX.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  asChild?: boolean;
}

function Heading(props: HeadingProps) {
  const [local, others] = splitProps(props, ["class", "variant", "size", "as", "asChild", "children"]);
  const Tag = local.as || (local.size === "lg" ? "h1" : "h2");

  return (
    <Dynamic
      component={Tag}
      data-slot="heading"
      class={cn(headingVariants({ variant: local.variant, size: local.size, class: local.class }))}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
}

export { Heading, headingVariants };
