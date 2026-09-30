import { JSX } from "solid-js";
import Container from "~/components/container";
import { cn } from "~/lib/utils";

interface SectionProps {
  id?: string;
  class?: string;
  children?: JSX.Element;
}

export default function Section(props: SectionProps) {
  return (
    <section id={props.id} class="overflow-hidden">
      <Container>
        <div
          class={cn(
            "py-12 md:border-x md:border-dashed md:border-border md:px-3 lg:py-16",
            props.class
          )}
        >
          {props.children}
        </div>
      </Container>
    </section>
  );
}
