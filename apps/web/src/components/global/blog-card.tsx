import { RiArrowsArrowRightLine } from "solid-icons/ri";
import Image from "~/components/ui/image";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { IBlogPostItem } from "~/lib/api";

export default function BlogCard(props: { post: IBlogPostItem; class?: string }) {
  const item = () => props.post;

  return (
    <Card class={cn("bg-card/60 border-dashed backdrop-blur-xs group col-span-12 md:col-span-6 lg:col-span-4 transition-all duration-200 hover:border-primary/60 hover:shadow-md flex flex-col justify-between", props.class)}>
      <div>
        <CardHeader>
          <figure class="relative flex aspect-video overflow-hidden rounded-lg border border-dashed border-border/80 bg-muted/30">
            {item()?.coverImage ? (
              <Image
                src={item().coverImage}
                alt={item().title}
                width="600"
                height="200"
                class="grayscale-100 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
              />
            ) : (
              <div class="flex h-full w-full items-center justify-center bg-secondary/50 font-mono text-xs text-muted-foreground">
                ./abious/blog
              </div>
            )}
          </figure>
        </CardHeader>
        <CardContent class="space-y-2">
          <CardTitle class="text-foreground text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
            {item()?.title}
          </CardTitle>
          <CardDescription class="line-clamp-2 text-muted-foreground leading-normal text-xs sm:text-sm">
            {item()?.summary}
          </CardDescription>
        </CardContent>
      </div>
      <CardFooter class="mt-auto flex items-center gap-x-2.5 pt-4">
        <Button
          href={`/blogs/${item()?.slug}`}
          class="rounded-full text-xs font-medium cursor-pointer"
        >
          Read Article
          <RiArrowsArrowRightLine class="ml-1.5 size-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
