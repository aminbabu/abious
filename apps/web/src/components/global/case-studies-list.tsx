import { For, Show } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import CaseStudy, { type ICaseStudy } from "~/components/global/case-study";
import CaseStudiesLoader from "~/components/ui/loaders/case-studies";

export default function CaseStudiesList(props: {
  caseStudies?: ICaseStudy[];
  isLoading: boolean;
  error?: any;
  limit?: string;
}) {
  return (
    <Show
      when={!props.isLoading}
      fallback={
        <DecoratorUI>
          <div class="bg-secondary -mx-3 p-3">
            <CaseStudiesLoader limit={props.limit} />
          </div>
        </DecoratorUI>
      }
    >
      <Show
        when={!props.error}
        fallback={
          <DecoratorUI>
            <div class="bg-secondary -mx-3 p-3">{props.error?.message ?? "Error loading case studies"}</div>
          </DecoratorUI>
        }
      >
        <Show
          when={props.caseStudies?.length}
          fallback={
            <DecoratorUI>
              <div class="bg-secondary -mx-3 p-3">
                <p class="text-muted-foreground">No case studies found.</p>
              </div>
            </DecoratorUI>
          }
        >
          <DecoratorUI class="-mt-3">
            <div class="bg-secondary -mx-3 p-3">
              <div class="grid grid-cols-12 gap-3">
                <For each={props.caseStudies}>
                  {(caseStudy) => <CaseStudy caseStudy={caseStudy} />}
                </For>
              </div>
            </div>
          </DecoratorUI>
        </Show>
      </Show>
    </Show>
  );
}
