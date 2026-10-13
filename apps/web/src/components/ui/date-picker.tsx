import {
  createSignal,
  createMemo,
  onMount,
  onCleanup,
  For,
  Show,
  splitProps,
} from "solid-js";
import dayjs from "dayjs";
import {
  RiBusinessCalendar2Line,
  RiArrowsArrowLeftSLine,
  RiArrowsArrowRightSLine,
  RiArrowsArrowDownSLine,
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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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
  // 'days' | 'month' | 'year'
  const [viewMode, setViewMode] = createSignal<"days" | "month" | "year">("days");

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
      setViewMode("days");
    }
  };

  // Close on Escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setViewMode("days");
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
      setViewDate(initialViewDate());
      setViewMode("days");

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
    if (viewMode() === "days") {
      setViewDate(viewDate().subtract(1, "month"));
    } else if (viewMode() === "year") {
      setViewDate(viewDate().subtract(12, "year"));
    }
  };

  const handleNextMonth = (e: MouseEvent) => {
    e.stopPropagation();
    if (viewMode() === "days") {
      setViewDate(viewDate().add(1, "month"));
    } else if (viewMode() === "year") {
      setViewDate(viewDate().add(12, "year"));
    }
  };

  const handleSelectDay = (day: CalendarDay) => {
    if (day.isDisabled || local.disabled) return;
    local.onChange?.(day.dateString);
    setIsOpen(false);
    setViewMode("days");
  };

  const handleSelectMonth = (monthIndex: number) => {
    setViewDate(viewDate().month(monthIndex));
    setViewMode("days");
  };

  const handleSelectYear = (year: number) => {
    setViewDate(viewDate().year(year));
    setViewMode("month");
  };

  const handleSelectPresent = (e: MouseEvent) => {
    e.stopPropagation();
    local.onChange?.("Present");
    setIsOpen(false);
    setViewMode("days");
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
    setViewMode("days");
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

    const startDate = startOfMonth.startOf("week");
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

  // 12-year window for year selector
  const yearRange = createMemo<number[]>(() => {
    const currentYear = viewDate().year();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years: number[] = [];
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }
    return years;
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

      {/* Trigger Button - sleek shadcn Popover trigger */}
      <button
        id={local.id}
        type="button"
        disabled={local.disabled}
        onClick={toggleOpen}
        class={cn(
          "w-full h-9 flex items-center justify-between rounded-md border bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none transition-all cursor-pointer",
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

        <div class="flex items-center gap-1.5 shrink-0">
          <Show when={local.clearable && local.value && !local.disabled}>
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              class="size-4.5 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Clear date"
            >
              <RiSystemCloseLine class="size-3" />
            </span>
          </Show>
          <RiArrowsArrowDownSLine
            class={cn(
              "size-3.5 text-muted-foreground transition-transform duration-150",
              isOpen() && "rotate-180 text-foreground"
            )}
          />
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
          {/* Header Month / Year Navigation & Quick Selectors */}
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-border/40">
            <button
              type="button"
              onClick={handlePrevMonth}
              class="size-7 inline-flex items-center justify-center rounded-md border border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={viewMode() === "year" ? "Previous 12 years" : "Previous month"}
            >
              <RiArrowsArrowLeftSLine class="size-4" />
            </button>

            {/* Month & Year Select Buttons */}
            <div class="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode(viewMode() === "month" ? "days" : "month")}
                class={cn(
                  "px-2 py-1 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1",
                  viewMode() === "month"
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-foreground hover:bg-secondary border border-transparent hover:border-border/40"
                )}
                title="Select month"
              >
                <span>{viewDate().format("MMMM")}</span>
                <RiArrowsArrowDownSLine class={cn("size-3 text-muted-foreground", viewMode() === "month" && "rotate-180 text-primary")} />
              </button>

              <button
                type="button"
                onClick={() => setViewMode(viewMode() === "year" ? "days" : "year")}
                class={cn(
                  "px-2 py-1 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer flex items-center gap-1",
                  viewMode() === "year"
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-foreground hover:bg-secondary border border-transparent hover:border-border/40"
                )}
                title="Select year"
              >
                <span>{viewDate().format("YYYY")}</span>
                <RiArrowsArrowDownSLine class={cn("size-3 text-muted-foreground", viewMode() === "year" && "rotate-180 text-primary")} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              class="size-7 inline-flex items-center justify-center rounded-md border border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={viewMode() === "year" ? "Next 12 years" : "Next month"}
            >
              <RiArrowsArrowRightSLine class="size-4" />
            </button>
          </div>

          {/* VIEW: Month Selection Grid */}
          <Show when={viewMode() === "month"}>
            <div class="grid grid-cols-3 gap-1.5 py-1">
              <For each={MONTHS}>
                {(month, idx) => {
                  const isCurrent = () => viewDate().month() === idx();
                  return (
                    <button
                      type="button"
                      onClick={() => handleSelectMonth(idx())}
                      class={cn(
                        "h-8 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer text-center",
                        isCurrent()
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {month.slice(0, 3)}
                    </button>
                  );
                }}
              </For>
            </div>
          </Show>

          {/* VIEW: Year Selection Grid */}
          <Show when={viewMode() === "year"}>
            <div class="grid grid-cols-3 gap-1.5 py-1">
              <For each={yearRange()}>
                {(year) => {
                  const isCurrent = () => viewDate().year() === year;
                  const isThisYear = () => dayjs().year() === year;
                  return (
                    <button
                      type="button"
                      onClick={() => handleSelectYear(year)}
                      class={cn(
                        "h-8 rounded-md text-xs font-mono transition-colors cursor-pointer text-center",
                        isCurrent() && "bg-primary text-primary-foreground font-semibold shadow-xs",
                        !isCurrent() && isThisYear() && "border border-primary/50 text-primary font-semibold",
                        !isCurrent() && !isThisYear() && "text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {year}
                    </button>
                  );
                }}
              </For>
            </div>
          </Show>

          {/* VIEW: Days Calendar Grid */}
          <Show when={viewMode() === "days"}>
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
          </Show>

          {/* Bottom Actions: Improved Buttons (Today, Present, Clear) */}
          <div class="flex items-center justify-between pt-2.5 mt-2.5 border-t border-border/40 text-xs font-mono">
            <button
              type="button"
              onClick={handleQuickToday}
              class="h-7 px-2.5 rounded-md border border-border/60 hover:bg-secondary text-foreground hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1 font-medium shadow-2xs"
            >
              Today
            </button>

            <div class="flex items-center gap-1.5">
              <Show when={local.allowPresent}>
                <button
                  type="button"
                  onClick={handleSelectPresent}
                  class={cn(
                    "h-7 px-2.5 rounded-md border transition-colors cursor-pointer font-medium text-xs shadow-2xs inline-flex items-center gap-1",
                    isPresent()
                      ? "border-primary bg-primary text-primary-foreground font-semibold"
                      : "border-border/60 bg-background/50 hover:bg-secondary text-foreground hover:border-primary/50"
                  )}
                >
                  <Show when={isPresent()}>
                    <RiSystemCheckLine class="size-3" />
                  </Show>
                  Present
                </button>
              </Show>

              <Show when={local.value}>
                <button
                  type="button"
                  onClick={handleClear}
                  class="h-7 px-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer text-xs"
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
