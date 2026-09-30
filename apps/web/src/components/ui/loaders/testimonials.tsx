import { Skeleton } from "~/components/ui/skeleton";

export default function TestimonialsLoader() {
  return (
    <div class="flex gap-x-3 overflow-hidden">
      {Array.from({ length: 3 }).map(() => (
        <Skeleton class="h-72 shrink-0 grow basis-4/5 rounded-xl bg-border sm:h-64 lg:h-72 lg:basis-2/5" />
      ))}
    </div>
  );
}
