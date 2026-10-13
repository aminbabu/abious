import { createSignal, For, JSX, onCleanup, onMount, Show, splitProps } from "solid-js";
import { RiArrowsArrowDownSLine, RiSystemCheckLine } from "solid-icons/ri";
import { cn } from "~/lib/utils";

export interface SelectOption {
  value: string;
  label: string | JSX.Element;
  description?: string;
  badge?: string;
  icon?: (props: { class?: string }) => JSX.Element;
  disabled?: boolean;
}

export interface SelectProps {
  id?: string;
  name?: string;
  value?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  buttonClass?: string;
  popoverClass?: string;
  size?: "default" | "sm";
  align?: "start" | "end" | "auto";
}

export function Select(props: SelectProps) {
  const [local, others] = splitProps(props, [
    "id",
    "name",
    "value",
    "options",
    "onChange",
    "placeholder",
    "disabled",
    "class",
    "buttonClass",
    "popoverClass",
    "size",
    "align",
  ]);

  const [isOpen, setIsOpen] = createSignal(false);
  const [computedAlign, setComputedAlign] = createSignal<"start" | "end">("start");
  let containerRef: HTMLDivElement | undefined;

  const selectedOption = () =>
    local.options.find((opt) => opt.value === local.value);

  // Close when clicking outside
  const handleDocumentClick = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  // Close on Escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  onMount(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("mousedown", handleDocumentClick);
      document.addEventListener("keydown", handleKeyDown);
    }
  });

  onCleanup(() => {
    if (typeof window !== "undefined") {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    }
  });

  const handleSelect = (option: SelectOption) => {
    if (option.disabled || local.disabled) return;
    local.onChange?.(option.value);
    setIsOpen(false);
  };

  const isSmall = () => local.size === "sm";

  const toggleOpen = () => {
    if (local.disabled) return;
    const next = !isOpen();
    if (next) {
      if (local.align === "end") {
        setComputedAlign("end");
      } else if (local.align === "start") {
        setComputedAlign("start");
      } else {
        // "auto" or default: check if close to right viewport edge
        if (containerRef && typeof window !== "undefined") {
          const rect = containerRef.getBoundingClientRect();
          const popoverMinW = 140; // minimum expected menu width
          if (rect.left + popoverMinW > window.innerWidth - 16) {
            setComputedAlign("end");
          } else {
            setComputedAlign("start");
          }
        } else {
          setComputedAlign("start");
        }
      }
    }
    setIsOpen(next);
  };

  return (
    <div
      ref={containerRef}
      class={cn("relative select-none", local.class)}
      {...others}
    >
      {/* Hidden input for form serialization if name is provided */}
      <Show when={local.name}>
        <input type="hidden" name={local.name} value={local.value || ""} />
      </Show>

      {/* Trigger Button */}
      <button
        id={local.id}
        type="button"
        disabled={local.disabled}
        onClick={toggleOpen}
        class={cn(
          "w-full flex items-center justify-between rounded-md border border-input bg-background/50 px-3 text-xs text-foreground shadow-xs outline-none transition-all",
          "hover:bg-background/80 hover:border-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isSmall() ? "h-8 py-1 text-[11px]" : "h-9 py-2",
          isOpen() && "border-primary ring-1 ring-primary/30",
          local.buttonClass
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen()}
      >
        <div class="flex items-center gap-2 min-w-0 truncate">
          <Show
            when={selectedOption()}
            fallback={
              <span class="text-muted-foreground truncate">
                {local.placeholder || "Select option..."}
              </span>
            }
          >
            {(() => {
              const opt = selectedOption()!;
              const IconComp = opt.icon;
              return (
                <div class="flex items-center gap-1.5 truncate">
                  {IconComp && <IconComp class="size-3.5 shrink-0 text-primary" />}
                  <span class="truncate font-medium">{opt.label}</span>
                  {opt.badge && (
                    <span class="ml-1 rounded bg-secondary px-1 py-0.2 text-[9px] text-muted-foreground font-mono">
                      {opt.badge}
                    </span>
                  )}
                </div>
              );
            })()}
          </Show>
        </div>
        <RiArrowsArrowDownSLine
          class={cn(
            "size-3.5 text-muted-foreground shrink-0 transition-transform duration-150",
            isOpen() && "rotate-180 text-foreground"
          )}
        />
      </button>

      {/* Popover Menu */}
      <Show when={isOpen()}>
        <div
          class={cn(
            "absolute top-full mt-1.5 z-50 overflow-hidden rounded-md border border-dashed border-border/80 bg-popover/95 p-1 shadow-md backdrop-blur-md",
            computedAlign() === "end" ? "right-0 min-w-full" : "left-0 min-w-full",
            // If the trigger itself is very small (like pagination w-18), ensure dropdown doesn't feel squished or overflow viewport
            isSmall() ? "min-w-[5.5rem]" : "min-w-[8rem]",
            "animate-in fade-in-50 zoom-in-95 duration-100",
            local.popoverClass
          )}
          role="listbox"
        >
          <div class="max-h-60 overflow-y-auto py-0.5 space-y-0.5">
            <For each={local.options}>
              {(option) => {
                const isSelected = () => local.value === option.value;
                const IconComp = option.icon;

                return (
                  <button
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={isSelected()}
                    class={cn(
                      "relative flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-xs outline-none transition-colors text-left cursor-pointer",
                      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      isSelected() && "bg-primary/10 text-primary font-medium",
                      option.disabled && "cursor-not-allowed opacity-50",
                      isSmall() && "py-1 text-[11px]"
                    )}
                  >
                    <div class="flex items-center gap-2 min-w-0 pr-2">
                      {IconComp && <IconComp class="size-3.5 shrink-0 text-muted-foreground" />}
                      <div class="truncate">
                        <span class="truncate block">{option.label}</span>
                        {option.description && (
                          <span class="text-[10px] text-muted-foreground block truncate">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <Show when={isSelected()}>
                      <RiSystemCheckLine class="size-3.5 shrink-0 text-primary stroke-2" />
                    </Show>
                  </button>
                );
              }}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default Select;
