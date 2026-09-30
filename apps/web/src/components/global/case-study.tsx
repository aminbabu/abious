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
    <Card class="bg-background group col-span-12 md:col-span-6 lg:col-span-4">
      <CardHeader>
        <figure class="relative flex aspect-video overflow-hidden rounded-lg">
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
        <CardTitle>{item()?.data?.title}</CardTitle>
        <CardDescription class="line-clamp-2">
          {item()?.data?.description}
        </CardDescription>
      </CardContent>
      <CardFooter class="mt-auto flex items-center gap-x-3">
        <Button asChild class="rounded-full">
          <a href={`/case-studies/${item()?.id}`}>View Details</a>
        </Button>
        {item()?.data?.liveURL && (
          <Button asChild variant="outline" class="rounded-full">
            <a href={item()?.data?.liveURL} target="_blank" rel="noopener noreferrer">
              View Project
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
