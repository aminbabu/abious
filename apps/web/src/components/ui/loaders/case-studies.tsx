import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function CaseStudiesLoader(props: { limit?: string }) {
  const count = () => (props.limit ? Number(props.limit) : 3);

  return (
    <div class="grid grid-cols-12 gap-3">
      {Array.from({ length: count() }).map(() => (
        <Card class="col-span-12 bg-background md:col-span-6 lg:col-span-4">
          <CardHeader>
            <Skeleton class="aspect-video w-full rounded-lg bg-border" />
          </CardHeader>
          <CardContent class="space-y-2">
            <Skeleton class="h-8 w-1/2 rounded bg-border" />
            <div class="space-y-1">
              <Skeleton class="h-5 w-full rounded bg-border" />
              <Skeleton class="h-5 w-3/4 rounded bg-border" />
            </div>
          </CardContent>
          <CardFooter class="mt-auto flex items-center gap-x-3">
            <Skeleton class="h-10 w-28 rounded-full bg-border" />
            <Skeleton class="h-10 w-28 rounded-full bg-border" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
