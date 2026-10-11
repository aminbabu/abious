import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export default function ServicesLoader(props: { count?: number }) {
  const total = () => props.count ?? 4;

  return (
    <div class="grid grid-cols-12 gap-y-3 before:-inset-y-3 md:gap-x-3">
      {Array.from({ length: total() }).map(() => (
        <Card class="col-span-12 bg-background md:col-span-6 lg:col-span-3">
          <CardHeader>
            <Skeleton class="size-9 rounded-md bg-border" />
          </CardHeader>
          <CardContent class="space-y-2">
            <Skeleton class="h-6 w-3/4 rounded bg-border" />
            <Skeleton class="h-4 w-full rounded bg-border" />
            <Skeleton class="h-4 w-5/6 rounded bg-border" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
