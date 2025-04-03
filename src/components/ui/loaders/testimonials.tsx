import { Skeleton } from "@/components/ui/skeleton";

const TestimonialsLoader = () => {
  return (
    <div className="flex gap-x-3 overflow-hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-72 sm:h-64 lg:h-72 shrink-0 basis-4/5 lg:basis-2/5 rounded-xl bg-border grow
        "
        />
      ))}
    </div>
  );
};

export default TestimonialsLoader;
