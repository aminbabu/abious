import { JSX, splitProps } from "solid-js";
import { cn } from "~/lib/utils";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input(props: InputProps) {
  const [local, others] = splitProps(props, ["class", "hasError", "type"]);
  return (
    <input
      type={local.type || "text"}
      class={cn(
        "flex h-9 w-full rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground shadow-xs transition-colors outline-none",
        "placeholder:text-muted-foreground",
        "focus:border-primary focus:ring-1 focus:ring-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/40",
        local.hasError
          ? "border-destructive focus:border-destructive focus:ring-destructive"
          : "border-input",
        local.class
      )}
      {...others}
    />
  );
}

export interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea(props: TextareaProps) {
  const [local, others] = splitProps(props, ["class", "hasError"]);
  return (
    <textarea
      class={cn(
        "flex min-h-[90px] w-full resize-y rounded-md border bg-background/50 px-3 py-2 text-xs text-foreground shadow-xs transition-colors outline-none leading-relaxed",
        "placeholder:text-muted-foreground",
        "focus:border-primary focus:ring-1 focus:ring-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/40",
        local.hasError
          ? "border-destructive focus:border-destructive focus:ring-destructive"
          : "border-input",
        local.class
      )}
      {...others}
    />
  );
}

export interface FormLabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FormLabel(props: FormLabelProps) {
  const [local, others] = splitProps(props, ["class", "required", "children"]);
  return (
    <label
      class={cn("text-xs font-medium text-foreground flex items-center gap-1", local.class)}
      {...others}
    >
      <span>{local.children}</span>
      {local.required && <span class="text-destructive font-bold">*</span>}
    </label>
  );
}

export interface FormDescriptionProps extends JSX.HTMLAttributes<HTMLParagraphElement> {}

export function FormDescription(props: FormDescriptionProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <p class={cn("text-[11px] text-muted-foreground leading-normal", local.class)} {...others}>
      {local.children}
    </p>
  );
}

export interface FormErrorProps extends JSX.HTMLAttributes<HTMLParagraphElement> {}

export function FormError(props: FormErrorProps) {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <p class={cn("text-[11px] text-destructive leading-normal", local.class)} {...others}>
      {local.children}
    </p>
  );
}
