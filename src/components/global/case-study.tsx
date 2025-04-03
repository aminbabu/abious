import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ICaseStudy } from "@/interfaces/case-study";

const CaseStudy = ({ caseStudy }: { caseStudy: ICaseStudy }) => {
  return (
    <Card className="bg-background group col-span-12 md:col-span-6 lg:col-span-4">
      <CardHeader>
        <figure className="relative flex aspect-video overflow-hidden rounded-lg">
          <img
            src={caseStudy?.data?.banner}
            alt={caseStudy?.data?.title}
            width={600}
            height={200}
            className="grayscale-100 h-full w-full object-cover object-center transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        </figure>
      </CardHeader>
      <CardContent className="space-y-2">
        <CardTitle>{caseStudy?.data?.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {caseStudy?.data?.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-auto flex items-center gap-x-3">
        <Button asChild className="rounded-full">
          <a href={`/case-studies/${caseStudy?.id}`}>View Details</a>
        </Button>
        {caseStudy?.data?.liveURL && (
          <Button asChild variant="outline" className="rounded-full">
            <a href={caseStudy?.data?.liveURL} target="_blank">
              View Project
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CaseStudy;
