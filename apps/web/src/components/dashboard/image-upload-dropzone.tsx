import { createSignal, Show } from "solid-js";
import {
  RiSystemUploadCloud2Line,
  RiSystemCloseLine,
  RiMediaImageLine,
  RiEditorLinkM,
  RiSystemLoader4Line,
} from "solid-icons/ri";


import { api } from "~/lib/api";

interface ImageUploadDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  compact?: boolean;
}

export default function ImageUploadDropzone(props: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = createSignal(false);
  const [isUploading, setIsUploading] = createSignal(false);
  const [uploadError, setUploadError] = createSignal<string | null>(null);
  const [showUrlInput, setShowUrlInput] = createSignal(false);
  let fileInputRef: HTMLInputElement | undefined;

  const handleFile = async (file: File) => {
    // Basic frontend validation
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (PNG, JPG, WEBP, GIF, SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File is too large. Maximum size is 10MB.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const res = await api.upload.image(file);
      props.onChange(res.url);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const onFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      handleFile(file);
      // Reset input value so re-selecting same file triggers onChange
      target.value = "";
    }
  };

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    props.onChange("");
    setUploadError(null);
  };

  return (
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-xs font-mono font-medium text-foreground">
          {props.label || "Image"}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput())}
          class="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <RiEditorLinkM class="size-3" />
          <span>{showUrlInput() ? "Dropzone Mode" : "Paste URL"}</span>
        </button>

      </div>

      <Show when={props.description}>
        <p class="text-[11px] text-muted-foreground">{props.description}</p>
      </Show>

      {/* Manual URL Input fallback if user prefers pasting external link */}
      <Show when={showUrlInput()}>
        <div class="space-y-1.5">
          <input
            type="text"
            value={props.value || ""}
            onInput={(e) => props.onChange(e.currentTarget.value)}
            placeholder={props.placeholder || "https://images.unsplash.com/..."}
            class="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </Show>


      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        class="hidden"
        onChange={onFileSelect}
      />

      {/* Dropzone & Preview Box */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => {
          if (!isUploading() && fileInputRef) {
            fileInputRef.click();
          }
        }}
        class={`group relative flex flex-col items-center justify-center rounded-md border border-dashed transition-all cursor-pointer overflow-hidden ${
          props.compact ? "min-h-[96px] p-3" : "min-h-[120px] p-4"
        } ${
          isDragging()
            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
            : props.value
            ? "border-border/80 bg-background/40 hover:border-primary/50"
            : "border-border/80 bg-background/30 hover:bg-background/60 hover:border-foreground/40"
        }`}
      >
        <Show
          when={props.value}
          fallback={
            <div class="flex flex-col items-center text-center p-1">
              <Show
                when={isUploading()}
                fallback={
                  <>
                    <div class={`flex items-center justify-center rounded-full bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors ${
                      props.compact ? "size-8 mb-1.5" : "size-9 mb-2"
                    }`}>
                      <RiSystemUploadCloud2Line class={props.compact ? "size-4" : "size-5"} />
                    </div>
                    <p class="text-xs font-mono font-medium text-foreground">
                      Click to upload or drag & drop
                    </p>
                    <p class="mt-0.5 text-[10px] font-mono text-muted-foreground">
                      PNG, JPG, WEBP, SVG up to 10MB
                    </p>
                  </>
                }
              >
                <div class="flex flex-col items-center gap-2">
                  <RiSystemLoader4Line class="size-5 animate-spin text-primary" />
                  <p class="text-xs font-mono text-muted-foreground">Uploading image...</p>
                </div>
              </Show>
            </div>
          }
        >
          {/* Active Preview */}
          <div class="relative w-full h-full flex flex-col items-center">
            <div class={`relative w-full overflow-hidden rounded-md border border-border/50 bg-black/40 flex items-center justify-center ${
              props.compact ? "max-h-[120px]" : "max-h-[160px]"
            }`}>
              <img
                src={props.value}
                alt="Uploaded preview"
                class={`w-full h-auto object-contain transition-transform group-hover:scale-[1.01] ${
                  props.compact ? "max-h-[120px]" : "max-h-[160px]"
                }`}
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div class="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                <span class="inline-flex items-center gap-1 text-xs font-mono text-foreground bg-background/90 px-2.5 py-1 rounded shadow-xs border border-border">
                  <RiMediaImageLine class="size-3.5" />
                  Replace
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  title="Remove image"
                  class="inline-flex items-center gap-1 text-xs font-mono text-destructive bg-destructive/10 hover:bg-destructive/20 px-2.5 py-1 rounded border border-destructive/30 cursor-pointer transition-colors"
                >
                  <RiSystemCloseLine class="size-3.5" />
                  Remove
                </button>

              </div>
            </div>

            <div class="mt-2 flex w-full items-center justify-between px-1 text-[11px] font-mono text-muted-foreground">
              <span class="truncate max-w-[200px]" title={props.value}>
                {props.value?.split("/").pop()}
              </span>
              <button

                type="button"
                onClick={handleClear}
                class="text-destructive hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </Show>
      </div>

      <Show when={uploadError()}>
        <p class="text-[11px] font-mono text-destructive">{uploadError()}</p>
      </Show>
    </div>
  );
}
