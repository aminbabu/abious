import { Show } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import Section from "~/components/section";
import Image from "~/components/ui/image";
import type { IBlogPostItem } from "~/lib/api";
import { cn } from "~/lib/utils";

export default function FeaturedBlogImage(props: {
  post?: IBlogPostItem;
  class?: string;
}) {
  return (
    <Show when={props.post?.coverImage}>
      <Section class={cn("pt-0 lg:pt-0", props.class)}>
        <DecoratorUI class="bg-secondary p-3 md:-mx-3">
          <figure class="aspect-video overflow-hidden rounded-xl grayscale-100 transition duration-500 hover:grayscale-0">
            <Image
              src={props.post?.coverImage}
              alt={props.post?.title}
              width="1200"
              height="630"
              class="h-full w-full object-cover object-center"
            />
          </figure>
        </DecoratorUI>
      </Section>
    </Show>
  );
}
