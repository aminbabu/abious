import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CaseStudiesLoader = ({ limit }: { limit?: string }) => {
  return (
    <div className="grid grid-cols-12 gap-3">
      {Array.from({ length: limit ? Number(limit) : 3 }).map((_, index) => (
        <Card
          key={index}
          className="bg-background col-span-12 md:col-span-6 lg:col-span-4"
        >
          <CardHeader>
            <Skeleton className="aspect-video rounded-lg w-full bg-border" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="w-1/2 h-8 rounded bg-border" />
            <div className="space-y-1">
              <Skeleton className="w-full h-5 rounded bg-border" />
              <Skeleton className="w-3/4 h-5 rounded bg-border" />
            </div>
          </CardContent>
          <CardFooter className="mt-auto flex items-center gap-x-3">
            <Skeleton className="w-28 h-10 rounded-full bg-border" />
            <Skeleton className="w-28 h-10 rounded-full bg-border" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CaseStudiesLoader;
