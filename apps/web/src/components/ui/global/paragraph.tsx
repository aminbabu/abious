import { JSX, splitProps } from "solid-js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const paragraphVariants = cva("font-normal", {
  variants: {
    variant: {
      default: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted",
      destructive: "text-destructive",
    },
    size: {
      default: "text-base",
      xs: "text-xs",
      sm: "text-sm",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Paragraph(
  props: JSX.HTMLAttributes<HTMLParagraphElement> &
    VariantProps<typeof paragraphVariants> & {
      asChild?: boolean;
    }
) {
  const [local, others] = splitProps(props, ["class", "variant", "size", "asChild", "children"]);

  return (
    <p
      data-slot="p"
      class={cn(paragraphVariants({ variant: local.variant, size: local.size, class: local.class }))}
      {...others}
    >
      {local.children}
    </p>
  );
}

export { Paragraph, paragraphVariants };
