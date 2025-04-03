import DecoratorUI from "@/components/decorator-ui";
import CaseStudy from "@/components/global/case-study";
import CaseStudiesLoader from "@/components/ui/loaders/case-studies";
import type { ICaseStudy } from "@/interfaces/case-study";
import type { IError } from "@/interfaces/error";

const CaseStudiesList = ({
  caseStudies,
  isLoading,
  error,
  limit,
}: {
  caseStudies: ICaseStudy[];
  isLoading: boolean;
  error: IError | null;
  limit?: string;
}) => {
  let content = null;

  if (isLoading) {
    content = (
      <DecoratorUI>
        <div className="bg-secondary -mx-3 p-3">
          <CaseStudiesLoader limit={limit} />
        </div>
      </DecoratorUI>
    );
  }

  if (!isLoading && error) {
    content = (
      <DecoratorUI>
        <div className="bg-secondary -mx-3 p-3">{error.message}</div>
      </DecoratorUI>
    );
  }

  if (!isLoading && !error && !caseStudies?.length) {
    content = (
      <DecoratorUI>
        <div className="bg-secondary -mx-3 p-3">
          <p className="text-muted-foreground">No case studies found.</p>
        </div>
      </DecoratorUI>
    );
  }

  if (!isLoading && !error && caseStudies?.length) {
    content = (
      <DecoratorUI className="-mt-3">
        <div className="bg-secondary -mx-3 p-3">
          <div className="grid grid-cols-12 gap-3">
            {caseStudies?.map((caseStudy) => (
              <CaseStudy caseStudy={caseStudy} key={caseStudy.id} />
            ))}
          </div>
        </div>
      </DecoratorUI>
    );
  }

  return content;
};

export default CaseStudiesList;
