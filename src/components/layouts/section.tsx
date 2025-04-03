import Container from "@/components/layouts/container";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const Section = ({ className, children, ...props }: ComponentProps<"div">) => {
  return (
    <section className="overflow-hidden" {...props}>
      <Container>
        <div
          className={cn(
            "md:border-x-border py-12 md:border-x md:border-dashed md:px-3 lg:py-16",
            className
          )}
        >
          {children}
        </div>
      </Container>
    </section>
  );
};

export default Section;
