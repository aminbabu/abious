import { For, Show } from "solid-js";
import DecoratorUI from "~/components/decorator-ui";
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
          <DecoratorUI>
            <div class="bg-secondary -mx-3 p-3">
              {props.error?.message ?? "Error loading articles"}
            </div>
          </DecoratorUI>
        }
      >
        <Show
          when={props.blogs?.length}
          fallback={
            <DecoratorUI>
              <div class="bg-secondary -mx-3 p-3">
                <p class="text-muted-foreground font-mono text-xs">No articles published yet.</p>
              </div>
            </DecoratorUI>
          }
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
