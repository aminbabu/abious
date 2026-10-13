import { JSX, createSignal, splitProps, Show } from "solid-js";
import { cn } from "~/lib/utils";

export interface ImageProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: JSX.Element;
  fallbackSrc?: string;
  class?: string;
}

export default function Image(props: ImageProps) {
  const [local, others] = splitProps(props, [
    "class",
    "fallback",
    "fallbackSrc",
    "src",
    "alt",
    "loading",
    "decoding",
    "onError",
  ]);

  const [hasError, setHasError] = createSignal(false);
  const [currentSrc, setCurrentSrc] = createSignal(local.src);

  const handleError = (e: Event) => {
    if (local.fallbackSrc && currentSrc() !== local.fallbackSrc) {
      setCurrentSrc(local.fallbackSrc);
      return;
    }
    setHasError(true);
    if (typeof local.onError === "function") {
      (local.onError as (e: Event) => void)(e);
    }
  };

  return (
    <Show
      when={!hasError()}
      fallback={
        local.fallback ?? (
          <div
            class={cn(
              "flex h-full w-full items-center justify-center bg-muted/40 font-mono text-xs text-muted-foreground",
              local.class
            )}
            role="img"
            aria-label={local.alt ?? "Image placeholder"}
          >
            <span>{local.alt || "./image"}</span>
          </div>
        )
      }
    >
      <img
        src={currentSrc() ?? local.src}
        alt={local.alt ?? ""}
        loading={local.loading ?? "lazy"}
        decoding={local.decoding ?? "async"}
        onError={handleError}
        class={cn(local.class)}
        {...others}
      />
    </Show>
  );
}

export { Image };
