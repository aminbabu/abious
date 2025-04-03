import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

const Brand = ({
  className,
  asChild = false,
  ...props
}: ComponentProps<"a"> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="a"
      href="/"
      className={cn("font-medium", className)}
      {...props}
    />
  );
};

export default Brand;
