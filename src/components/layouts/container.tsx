import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const Container = ({ className, children }: ComponentProps<"div">) => {
  return (
    <div className={cn("mx-auto max-w-7xl px-3", className)}>{children}</div>
  );
};

export default Container;
