import DecoratorUI from "@/components/decorator-ui";
import Section from "@/components/layouts/section";
import type { ICaseStudy } from "@/interfaces/case-study";
import { cn } from "@/lib/utils";

const FeaturedImage = ({
  caseStudy,
  className,
}: {
  caseStudy: ICaseStudy;
  className?: string;
}) => {
  return (
    <Section className={cn("pt-0 lg:pt-0", className)}>
      <DecoratorUI className="bg-secondary p-3 md:-mx-3">
        <figure className="overflow-hidden rounded-xl aspect-video grayscale-100 hover:grayscale-0 transition duration-500">
          <img
            src={caseStudy?.data?.banner}
            alt={caseStudy?.data?.title}
            width={1200}
            height={630}
            className="object-cover object-center w-full h-full"
          />
        </figure>
      </DecoratorUI>
    </Section>
  );
};

export default FeaturedImage;
