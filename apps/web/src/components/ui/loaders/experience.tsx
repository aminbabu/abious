import { Skeleton } from "~/components/ui/skeleton";

export default function ExperienceLoader() {
  return (
    <div class="flex gap-x-6 overflow-hidden py-2">
      {Array.from({ length: 3 }).map(() => (
        <div class="flex min-w-[280px] sm:min-w-[320px] gap-x-3 rounded-lg p-2">
          <Skeleton class="size-10 shrink-0 rounded-full bg-border" />
          <div class="flex-1 space-y-3">
            <Skeleton class="h-5 w-3/4 rounded bg-border" />
            <Skeleton class="h-4 w-1/2 rounded bg-border" />
            <div class="mt-4 space-y-2">
              <Skeleton class="h-4 w-5/6 rounded bg-border" />
              <Skeleton class="h-3 w-2/3 rounded bg-border" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
