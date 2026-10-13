import { createSignal, createMemo, onMount, onCleanup, For, Show, splitProps, JSX } from "solid-js";
import dayjs from "dayjs";
import {
  RiBusinessCalendar2Line,
  RiArrowsArrowLeftSLine,
  RiArrowsArrowRightSLine,
  RiSystemCloseLine,
  RiSystemCheckLine,
} from "solid-icons/ri";
import { cn } from "~/lib/utils";

export interface DatePickerProps {
  id?: string;
  name?: string;
  value?: string; // "YYYY-MM-DD" or ISO string or empty/undefined
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: string; // "YYYY-MM-DD"
  maxDate?: string; // "YYYY-MM-DD"
  class?: string;
  buttonClass?: string;
  popoverClass?: string;
  hasError?: boolean;
  clearable?: boolean;
  allowPresent?: boolean; // For employment end dates where "Present" is an option
  align?: "start" | "end" | "auto";
}

interface CalendarDay {
  date: dayjs.Dayjs;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  dateString: string;
}

export function DatePicker(props: DatePickerProps) {
  const [local, others] = splitProps(props, [
    "id",
    "name",
    "value",
    "onChange",
    "placeholder",
    "disabled",
    "minDate",
    "maxDate",
    "class",
    "buttonClass",
    "popoverClass",
    "hasError",
    "clearable",
    "allowPresent",
    "align",
  ]);

  const [isOpen, setIsOpen] = createSignal(false);
  const [computedAlign, setComputedAlign] = createSignal<"start" | "end">("start");
  let containerRef: HTMLDivElement | undefined;

  // Track the view month/year in the calendar
  const initialViewDate = () => {
    if (local.value && local.value.toLowerCase() !== "present") {
      const parsed = dayjs(local.value);
      if (parsed.isValid()) return parsed;
    }
    return dayjs();
  };

  const [viewDate, setViewDate] = createSignal<dayjs.Dayjs>(initialViewDate());

  // Keep viewDate updated if value changes externally while closed
  const isPresent = () => local.value?.toLowerCase() === "present";

  const selectedDayjs = () => {
    if (!local.value || isPresent()) return null;
    const d = dayjs(local.value);
    return d.isValid() ? d : null;
  };

  const displayLabel = () => {
    if (!local.value) return "";
    if (isPresent()) return "Present";
    const d = selectedDayjs();
    return d ? d.format("MMM DD, YYYY") : local.value;
  };

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

  const toggleOpen = () => {
    if (local.disabled) return;
    const next = !isOpen();
    if (next) {
      // Sync viewDate to selected or today
      setViewDate(initialViewDate());

      if (local.align === "end") {
        setComputedAlign("end");
      } else if (local.align === "start") {
        setComputedAlign("start");
      } else {
        if (containerRef && typeof window !== "undefined") {
          const rect = containerRef.getBoundingClientRect();
          const popoverMinW = 280;
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

  const handlePrevMonth = (e: MouseEvent) => {
    e.stopPropagation();
    setViewDate(viewDate().subtract(1, "month"));
  };

  const handleNextMonth = (e: MouseEvent) => {
    e.stopPropagation();
    setViewDate(viewDate().add(1, "month"));
  };

  const handleSelectDay = (day: CalendarDay) => {
    if (day.isDisabled || local.disabled) return;
    local.onChange?.(day.dateString);
    setIsOpen(false);
  };

  const handleSelectPresent = (e: MouseEvent) => {
    e.stopPropagation();
    local.onChange?.("Present");
    setIsOpen(false);
  };

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    local.onChange?.("");
  };

  const handleQuickToday = (e: MouseEvent) => {
    e.stopPropagation();
    const todayStr = dayjs().format("YYYY-MM-DD");
    local.onChange?.(todayStr);
    setViewDate(dayjs());
    setIsOpen(false);
  };

  // Calendar days grid computation: 7 columns x 5-6 rows
  const daysInGrid = createMemo<CalendarDay[]>(() => {
    const currentView = viewDate();
    const startOfMonth = currentView.startOf("month");
    const endOfMonth = currentView.endOf("month");
    const todayStr = dayjs().format("YYYY-MM-DD");
    const selected = selectedDayjs()?.format("YYYY-MM-DD");

    const min = local.minDate ? dayjs(local.minDate) : null;
    const max = local.maxDate ? dayjs(local.maxDate) : null;

    // Start of the calendar grid (Sunday of the week of the 1st)
    const startDate = startOfMonth.startOf("week");
    // End of the calendar grid (Saturday of the week of the last day)
    const endDate = endOfMonth.endOf("week");

    const days: CalendarDay[] = [];
    let curr = startDate;

    while (curr.isBefore(endDate) || curr.isSame(endDate, "day")) {
      const currStr = curr.format("YYYY-MM-DD");
      const isCurrentMonth = curr.month() === currentView.month();
      let isDisabled = false;

      if (min && curr.isBefore(min, "day")) isDisabled = true;
      if (max && curr.isAfter(max, "day")) isDisabled = true;

      days.push({
        date: curr,
        isCurrentMonth,
        isToday: currStr === todayStr,
        isSelected: !!selected && currStr === selected,
        isDisabled,
        dateString: currStr,
      });

      curr = curr.add(1, "day");
    }

    return days;
  });

  const weekDayHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div
      ref={containerRef}
      class={cn("relative select-none", local.class)}
      {...others}
    >
      {/* Hidden input for HTML form support */}
      <Show when={local.name}>
        <input type="hidden" name={local.name} value={local.value || ""} />
      </Show>

      {/* Trigger Button - styled like shadcn Popover trigger */}
      <button
        id={local.id}
        type="button"
        disabled={local.disabled}
        onClick={toggleOpen}
        class={cn(
          "w-full h-9 flex items-center justify-between rounded-md border bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none transition-all",
          "hover:bg-background/80 hover:border-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          local.hasError
            ? "border-destructive focus:border-destructive focus:ring-destructive"
            : "border-input",
          isOpen() && "border-primary ring-1 ring-primary/30",
          local.buttonClass
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen()}
      >
        <div class="flex items-center gap-2 min-w-0 truncate">
          <RiBusinessCalendar2Line class="size-3.5 text-muted-foreground shrink-0" />
          <Show
            when={displayLabel()}
            fallback={
              <span class="text-muted-foreground truncate font-normal">
                {local.placeholder || "Pick a date"}
              </span>
            }
          >
            <span class="truncate font-medium text-foreground">{displayLabel()}</span>
          </Show>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <Show when={local.clearable && local.value && !local.disabled}>
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              class="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Clear date"
            >
              <RiSystemCloseLine class="size-3" />
            </span>
          </Show>
        </div>
      </button>

      {/* Calendar Popover */}
      <Show when={isOpen()}>
        <div
          class={cn(
            "absolute top-full mt-1.5 z-50 w-72 rounded-md border border-dashed border-border/80 bg-popover/95 p-3 shadow-lg backdrop-blur-md",
            computedAlign() === "end" ? "right-0" : "left-0",
            "animate-in fade-in-50 zoom-in-95 duration-100",
            local.popoverClass
          )}
          role="dialog"
          aria-label="Calendar date picker"
        >
          {/* Header Month / Year Navigation */}
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-border/40">
            <button
              type="button"
              onClick={handlePrevMonth}
              class="size-7 inline-flex items-center justify-center rounded-md border border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Previous month"
            >
              <RiArrowsArrowLeftSLine class="size-4" />
            </button>

            <span class="text-xs font-mono font-semibold text-foreground tracking-wide">
              {viewDate().format("MMMM YYYY")}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              class="size-7 inline-flex items-center justify-center rounded-md border border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Next month"
            >
              <RiArrowsArrowRightSLine class="size-4" />
            </button>
          </div>

          {/* Weekday Header Row */}
          <div class="grid grid-cols-7 gap-1 text-center mb-1">
            <For each={weekDayHeaders}>
              {(day) => (
                <div class="h-6 flex items-center justify-center text-[10px] font-mono font-medium text-muted-foreground">
                  {day}
                </div>
              )}
            </For>
          </div>

          {/* Days Grid */}
          <div class="grid grid-cols-7 gap-1">
            <For each={daysInGrid()}>
              {(day) => (
                <button
                  type="button"
                  disabled={day.isDisabled}
                  onClick={() => handleSelectDay(day)}
                  class={cn(
                    "size-8 flex items-center justify-center rounded-md text-xs font-mono transition-colors cursor-pointer select-none",
                    !day.isCurrentMonth && "text-muted-foreground/35",
                    day.isCurrentMonth && !day.isSelected && "text-foreground hover:bg-accent hover:text-accent-foreground",
                    day.isToday && !day.isSelected && "border border-primary/50 text-primary font-semibold",
                    day.isSelected && "bg-primary text-primary-foreground font-semibold shadow-xs",
                    day.isDisabled && "opacity-25 cursor-not-allowed hover:bg-transparent text-muted-foreground"
                  )}
                >
                  {day.date.date()}
                </button>
              )}
            </For>
          </div>

          {/* Bottom Actions: Quick presets like 'Today', 'Present', 'Clear' */}
          <div class="flex items-center justify-between pt-2.5 mt-2.5 border-t border-border/40 text-[11px] font-mono">
            <button
              type="button"
              onClick={handleQuickToday}
              class="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Today
            </button>

            <div class="flex items-center gap-2">
              <Show when={local.allowPresent}>
                <button
                  type="button"
                  onClick={handleSelectPresent}
                  class={cn(
                    "px-2 py-0.5 rounded border transition-colors cursor-pointer font-medium",
                    isPresent()
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  Present
                </button>
              </Show>

              <Show when={local.value}>
                <button
                  type="button"
                  onClick={handleClear}
                  class="text-destructive/80 hover:text-destructive transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default DatePicker;
