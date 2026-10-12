import { RiArrowsArrowRightLine, RiSystemExternalLinkLine } from "solid-icons/ri";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export interface ICaseStudy {
  id: string;
  data: {
    title: string;
    description: string;
    banner: string;
    type?: string;
    liveURL?: string;
    stack?: string[];
  };
}

export default function CaseStudy(props: { caseStudy: ICaseStudy }) {
  const item = () => props.caseStudy;

  return (
    <Card class="bg-card/60 border-dashed backdrop-blur-xs group col-span-12 md:col-span-6 lg:col-span-4 transition-all duration-200 hover:border-primary/60 hover:shadow-md flex flex-col justify-between">
      <div>
        <CardHeader>
          <figure class="relative flex aspect-video overflow-hidden rounded-lg border border-dashed border-border/80">
            <img
              src={item()?.data?.banner}
              alt={item()?.data?.title}
              width="600"
              height="200"
              class="grayscale-100 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
            />
          </figure>
        </CardHeader>
        <CardContent class="space-y-2">
          <CardTitle class="text-foreground text-lg font-mono font-bold group-hover:text-primary transition-colors">{item()?.data?.title}</CardTitle>
          <CardDescription class="line-clamp-2 text-muted-foreground leading-normal text-xs sm:text-sm">
            {item()?.data?.description}
          </CardDescription>
        </CardContent>
      </div>
      <CardFooter class="mt-auto flex items-center gap-x-2.5 pt-4">
        <Button href={`/case-studies/${item()?.id}`} class="rounded-full text-xs font-mono font-medium cursor-pointer">
          View Details
          <RiArrowsArrowRightLine class="ml-1.5 size-3.5" />
        </Button>
        {item()?.data?.liveURL && (
          <Button
            variant="outline"
            href={item()?.data?.liveURL}
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full text-xs font-mono font-medium cursor-pointer"
          >
            Live Site
            <RiSystemExternalLinkLine class="ml-1.5 size-3.5" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
