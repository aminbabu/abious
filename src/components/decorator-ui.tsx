import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const DecoratorUI = ({ className, children }: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "before:border-y-border relative before:absolute before:inset-y-0 before:-left-[100vw] before:-z-10 before:w-[200vw] before:border-y before:border-dashed",
        className
      )}
    >
      {children}
    </div>
  );
};

export default DecoratorUI;
