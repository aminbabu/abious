import { For, Show } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
import EmptyState from "~/components/ui/empty-state";
import BlogCard from "~/components/global/blog-card";
import BlogsLoader from "~/components/ui/loaders/blogs";
import type { IBlogPostItem } from "~/lib/api";

export default function BlogsList(props: {
  blogs?: IBlogPostItem[];
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
            <BlogsLoader limit={props.limit} />
          </div>
        </DecoratorUI>
      }
    >
      <Show
        when={!props.error}
        fallback={
          <EmptyState
            isError
            message={props.error?.message ?? "Error loading articles."}
          />
        }
      >
        <Show
          when={props.blogs?.length}
          fallback={<EmptyState message="No articles published yet." />}
        >
          <DecoratorUI class="-mt-3">
            <div class="bg-secondary -mx-3 p-3">
              <div class="grid grid-cols-12 gap-3">
                <For each={props.blogs}>
                  {(post) => <BlogCard post={post} />}
                </For>
              </div>
            </div>
          </DecoratorUI>
        </Show>
      </Show>
    </Show>
  );
}
