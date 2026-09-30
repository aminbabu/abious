import { JSX, splitProps } from "solid-js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const headingVariants = cva("relative font-medium capitalize", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted",
      destructive: "text-destructive",
    },
    size: {
      default: "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl",
      sm: "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl",
      lg: "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Heading(
  props: JSX.HTMLAttributes<HTMLHeadingElement> &
    VariantProps<typeof headingVariants> & {
      asChild?: boolean;
    }
) {
  const [local, others] = splitProps(props, ["class", "variant", "size", "asChild", "children"]);

  return (
    <h2
      data-slot="heading"
      class={cn(headingVariants({ variant: local.variant, size: local.size, class: local.class }))}
      {...others}
    >
      {local.children}
    </h2>
  );
}

export { Heading, headingVariants };
