import { JSX, splitProps, Show } from "solid-js";
import { RiSystemCheckLine } from "solid-icons/ri";
import { cn } from "~/lib/utils";

export interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  onChange?: (checked: boolean) => void;
  class?: string;
  label?: string | JSX.Element;
  description?: string | JSX.Element;
}

export function Checkbox(props: CheckboxProps) {
  const [local, others] = splitProps(props, [
    "id",
    "checked",
    "disabled",
    "onChange",
    "class",
    "label",
    "description",
  ]);

  return (
    <label
      class={cn(
        "group relative flex items-start gap-2.5 cursor-pointer select-none font-mono",
        local.disabled && "cursor-not-allowed opacity-50",
        local.class
      )}
    >
      <div class="relative flex items-center justify-center mt-0.5">
        <input
          type="checkbox"
          id={local.id}
          checked={local.checked}
          disabled={local.disabled}
          onChange={(e) => local.onChange?.(e.currentTarget.checked)}
          class="peer sr-only"
          {...(others as any)}
        />
        <div
          class={cn(
            "flex size-4.5 items-center justify-center rounded-md border border-dashed border-input bg-background/60 shadow-2xs transition-all",
            "peer-focus-visible:border-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring/40",
            "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground",
            "group-hover:border-primary/70"
          )}
        >
          <Show when={local.checked}>
            <RiSystemCheckLine class="size-3 stroke-2" />
          </Show>
        </div>
      </div>

      <Show when={local.label || local.description}>
        <div class="flex flex-col">
          <Show when={local.label}>
            <span class="text-xs font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
              {local.label}
            </span>
          </Show>
          <Show when={local.description}>
            <span class="text-[11px] text-muted-foreground leading-normal mt-0.5">
              {local.description}
            </span>
          </Show>
        </div>
      </Show>
    </label>
  );
}

export interface RadioOption {
  value: string;
  label: string | JSX.Element;
  description?: string | JSX.Element;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  options: RadioOption[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  class?: string;
  orientation?: "vertical" | "horizontal";
}

export function RadioGroup(props: RadioGroupProps) {
  return (
    <div
      class={cn(
        "flex gap-3 font-mono",
        props.orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
        props.class
      )}
      role="radiogroup"
    >
      {props.options.map((option) => {
        const isChecked = () => props.value === option.value;
        const isDisabled = () => props.disabled || option.disabled;

        return (
          <label
            class={cn(
              "group relative flex items-start gap-2.5 cursor-pointer select-none",
              isDisabled() && "cursor-not-allowed opacity-50"
            )}
          >
            <div class="relative flex items-center justify-center mt-0.5">
              <input
                type="radio"
                name={props.name}
                value={option.value}
                checked={isChecked()}
                disabled={isDisabled()}
                onChange={() => props.onChange?.(option.value)}
                class="peer sr-only"
              />
              <div
                class={cn(
                  "flex size-4.5 items-center justify-center rounded-full border border-dashed border-input bg-background/60 shadow-2xs transition-all",
                  "peer-focus-visible:border-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring/40",
                  "peer-checked:border-primary peer-checked:bg-primary/10",
                  "group-hover:border-primary/70"
                )}
              >
                <div
                  class={cn(
                    "size-2 rounded-full transition-transform scale-0 bg-transparent",
                    isChecked() && "scale-100 bg-primary shadow-xs"
                  )}
                />
              </div>
            </div>

            <div class="flex flex-col">
              <span class="text-xs font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
                {option.label}
              </span>
              <Show when={option.description}>
                <span class="text-[11px] text-muted-foreground leading-normal mt-0.5">
                  {option.description}
                </span>
              </Show>
            </div>
          </label>
        );
      })}
    </div>
  );
}
