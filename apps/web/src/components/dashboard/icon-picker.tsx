import { createSignal, createMemo, For, Show } from "solid-js";
import {
  RiBusinessWindowLine,
  RiBusinessLinksLine,
  RiEditorSlashCommands,
  RiDevelopmentBugLine,
  RiDeviceServerLine,
  RiDesignPencilLine,
  RiDevelopmentCodeSSlashLine,
  RiDevelopmentCodeLine,
  RiDevelopmentCodeBoxLine,
  RiDevelopmentTerminalBoxLine,
  RiDevelopmentHtml5Line,
  RiDevelopmentCss3Line,
  RiDevelopmentGitBranchLine,
  RiDevelopmentGitCommitLine,
  RiDeviceDatabase2Line,
  RiDeviceCpuLine,
  RiDeviceSmartphoneLine,
  RiDeviceComputerLine,
  RiDeviceMacbookLine,
  RiDesignLayoutGridLine,
  RiDesignLayoutMasonryLine,
  RiDesignMagicLine,
  RiDesignCompasses2Line,
  RiDesignPaletteLine,
  RiSystemSettings4Line,
  RiSystemSearchLine,
  RiSystemShieldCheckLine,
  RiSystemCheckLine,
  RiSystemCloseLine,
  RiArrowsArrowDownSLine,
  RiDeviceRouterLine,
  RiBusinessCloudLine,
  RiCommunicationChatSmile2Line,
} from "solid-icons/ri";


export interface IconOption {
  name: string;
  label: string;
  category: "Web & Dev" | "Design & UI" | "Backend & Cloud" | "Tools & Hardware";
  icon: any;
}

export const AVAILABLE_SERVICE_ICONS: IconOption[] = [
  // Web & Dev
  { name: "RiBusinessWindowLine", label: "Web Window / Frontend", category: "Web & Dev", icon: RiBusinessWindowLine },
  { name: "RiDevelopmentCodeSSlashLine", label: "Code Slashes / Web Dev", category: "Web & Dev", icon: RiDevelopmentCodeSSlashLine },
  { name: "RiDevelopmentCodeLine", label: "Clean Code", category: "Web & Dev", icon: RiDevelopmentCodeLine },
  { name: "RiDevelopmentCodeBoxLine", label: "Code Box / Frameworks", category: "Web & Dev", icon: RiDevelopmentCodeBoxLine },
  { name: "RiDevelopmentTerminalBoxLine", label: "Terminal / CLI", category: "Web & Dev", icon: RiDevelopmentTerminalBoxLine },
  { name: "RiDevelopmentHtml5Line", label: "HTML5 / Markup", category: "Web & Dev", icon: RiDevelopmentHtml5Line },
  { name: "RiDevelopmentCss3Line", label: "CSS3 / Styling", category: "Web & Dev", icon: RiDevelopmentCss3Line },
  { name: "RiEditorSlashCommands", label: "CMS / WordPress / Slash Commands", category: "Web & Dev", icon: RiEditorSlashCommands },
  { name: "RiDevelopmentBugLine", label: "Bug Fixing & QA", category: "Web & Dev", icon: RiDevelopmentBugLine },
  { name: "RiBusinessLinksLine", label: "API & Integrations", category: "Web & Dev", icon: RiBusinessLinksLine },
  { name: "RiDevelopmentGitBranchLine", label: "Git & Version Control", category: "Web & Dev", icon: RiDevelopmentGitBranchLine },
  { name: "RiDevelopmentGitCommitLine", label: "DevOps & CI/CD", category: "Web & Dev", icon: RiDevelopmentGitCommitLine },

  // Design & UI
  { name: "RiDesignPencilLine", label: "UI/UX & Wireframing", category: "Design & UI", icon: RiDesignPencilLine },
  { name: "RiDesignPaletteLine", label: "Visual & Brand Design", category: "Design & UI", icon: RiDesignPaletteLine },
  { name: "RiDesignLayoutGridLine", label: "Grid Layout & Systems", category: "Design & UI", icon: RiDesignLayoutGridLine },
  { name: "RiDesignLayoutMasonryLine", label: "Responsive Dashboards", category: "Design & UI", icon: RiDesignLayoutMasonryLine },
  { name: "RiDesignCompasses2Line", label: "Product Architecture", category: "Design & UI", icon: RiDesignCompasses2Line },
  { name: "RiDesignMagicLine", label: "AI & Innovation", category: "Design & UI", icon: RiDesignMagicLine },


  // Backend & Cloud
  { name: "RiDeviceServerLine", label: "Cloud Server & Microservices", category: "Backend & Cloud", icon: RiDeviceServerLine },
  { name: "RiDeviceDatabase2Line", label: "PostgreSQL & Database", category: "Backend & Cloud", icon: RiDeviceDatabase2Line },
  { name: "RiBusinessCloudLine", label: "Cloud Architecture (GCP/AWS)", category: "Backend & Cloud", icon: RiBusinessCloudLine },
  { name: "RiDeviceRouterLine", label: "Networking & Gateway", category: "Backend & Cloud", icon: RiDeviceRouterLine },
  { name: "RiSystemShieldCheckLine", label: "Security & Auditing", category: "Backend & Cloud", icon: RiSystemShieldCheckLine },

  // Hardware & Devices
  { name: "RiDeviceSmartphoneLine", label: "Mobile Apps (iOS/Android)", category: "Tools & Hardware", icon: RiDeviceSmartphoneLine },
  { name: "RiDeviceComputerLine", label: "Desktop Software", category: "Tools & Hardware", icon: RiDeviceComputerLine },
  { name: "RiDeviceMacbookLine", label: "SaaS Platforms", category: "Tools & Hardware", icon: RiDeviceMacbookLine },
  { name: "RiDeviceCpuLine", label: "Performance Tuning", category: "Tools & Hardware", icon: RiDeviceCpuLine },
  { name: "RiSystemSettings4Line", label: "Maintenance & Config", category: "Tools & Hardware", icon: RiSystemSettings4Line },
  { name: "RiCommunicationChatSmile2Line", label: "Consulting & Mentorship", category: "Tools & Hardware", icon: RiCommunicationChatSmile2Line },
];

export const SERVICE_ICONS_MAP: Record<string, any> = Object.fromEntries(
  AVAILABLE_SERVICE_ICONS.map((item) => [item.name, item.icon])
);

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export default function IconPicker(props: IconPickerProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [activeCategory, setActiveCategory] = createSignal<string>("All");

  const categories = ["All", "Web & Dev", "Design & UI", "Backend & Cloud", "Tools & Hardware"];

  const filteredIcons = createMemo(() => {
    const q = search().toLowerCase().trim();
    const cat = activeCategory();

    return AVAILABLE_SERVICE_ICONS.filter((item) => {
      const matchesCat = cat === "All" || item.category === cat;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  });

  const selectedOption = createMemo(() => {
    return AVAILABLE_SERVICE_ICONS.find((item) => item.name === props.value) || {
      name: props.value || "RiBusinessWindowLine",
      label: props.value || "Default Window",
      category: "Web & Dev",
      icon: SERVICE_ICONS_MAP[props.value] || RiBusinessWindowLine,
    };
  });

  return (
    <div class="space-y-1.5 relative">
      <label class="text-xs font-mono font-medium text-foreground flex items-center justify-between">
        <span>{props.label || "Service Icon"}</span>
        <span class="text-[10px] text-muted-foreground font-mono">
          {props.value || "Default"}
        </span>
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen())}
        class="w-full h-9 flex items-center justify-between rounded-md border border-input bg-background/50 px-3 text-xs font-mono text-foreground shadow-xs outline-none hover:bg-background/80 hover:border-foreground/30 transition-all cursor-pointer"
      >
        <div class="flex items-center gap-2 min-w-0">
          <div class="flex size-5 items-center justify-center rounded bg-primary/10 text-primary shrink-0 border border-primary/20">
            {(() => {
              const IconComp = selectedOption().icon;
              return <IconComp class="size-3.5" />;
            })()}
          </div>
          <div class="text-left truncate">
            <span class="font-medium truncate">{selectedOption().label}</span>
          </div>
        </div>
        <RiArrowsArrowDownSLine
          class={`size-3.5 text-muted-foreground shrink-0 transition-transform ${
            isOpen() ? "rotate-180 text-foreground" : ""
          }`}
        />
      </button>


      {/* Popover Dropdown Picker */}
      <Show when={isOpen()}>
        {/* Backdrop for click outside */}
        <div
          class="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />

        <div class="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-dashed border-border/80 bg-background/95 p-3 shadow-xl backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Bar */}
          <div class="relative mb-2.5">
            <RiSystemSearchLine class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              placeholder="Search icons (e.g. database, code, mobile)..."
              class="w-full rounded-md border border-input bg-background/80 pl-8 pr-7 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              autofocus
            />
            <Show when={search()}>
              <button
                type="button"
                onClick={() => setSearch("")}
                class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <RiSystemCloseLine class="size-3.5" />
              </button>
            </Show>
          </div>

          {/* Category Tabs */}
          <div class="flex flex-wrap gap-1 mb-2.5 pb-2 border-b border-border/50">
            <For each={categories}>
              {(cat) => (
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  class={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    activeCategory() === cat
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              )}
            </For>
          </div>

          {/* Icon Grid */}
          <div class="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[220px] overflow-y-auto pr-1">
            <For each={filteredIcons()}>
              {(item) => {
                const IconComp = item.icon;
                const isSelected = props.value === item.name;

                return (
                  <button
                    type="button"
                    onClick={() => {
                      props.onChange(item.name);
                      setIsOpen(false);
                    }}
                    title={`${item.label} (${item.name})`}
                    class={`group relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer text-center ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                        : "border-border/60 bg-card/40 text-muted-foreground hover:border-foreground/30 hover:bg-card hover:text-foreground"
                    }`}
                  >
                    <IconComp class="size-5 transition-transform group-hover:scale-110" />
                    <span class="mt-1 text-[9px] font-mono leading-tight truncate w-full">
                      {item.label.split(" ")[0]}
                    </span>
                    <Show when={isSelected}>
                      <span class="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
                    </Show>
                  </button>
                );
              }}
            </For>
          </div>

          <Show when={filteredIcons().length === 0}>
            <div class="py-6 text-center text-xs font-mono text-muted-foreground">
              No matching icons found for "{search()}".
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}
