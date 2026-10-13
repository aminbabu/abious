import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function BlogsLoader(props: { limit?: string }) {
  const count = () => (props.limit ? Number(props.limit) : 6);

  return (
    <div class="grid grid-cols-12 gap-3">
      {Array.from({ length: count() }).map(() => (
        <Card class="col-span-12 bg-card/60 border-dashed md:col-span-6 lg:col-span-4 flex flex-col justify-between">
          <div>
            <CardHeader>
              <Skeleton class="aspect-video w-full rounded-lg bg-border" />
            </CardHeader>
            <CardContent class="space-y-2">
              <Skeleton class="h-6 w-3/4 rounded bg-border" />
              <div class="space-y-1">
                <Skeleton class="h-4 w-full rounded bg-border" />
                <Skeleton class="h-4 w-2/3 rounded bg-border" />
              </div>
            </CardContent>
          </div>
          <CardFooter class="mt-auto flex items-center gap-x-2.5 pt-4">
            <Skeleton class="h-9 w-28 rounded-full bg-border" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
