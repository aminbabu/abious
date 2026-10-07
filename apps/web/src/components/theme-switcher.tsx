import { RiWeatherMoonLine, RiWeatherSunLine } from "solid-icons/ri";
import { Button } from "~/components/ui/button";
import { useTheme } from "~/context/theme";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      class="cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme() === "dark" ? (
        <RiWeatherMoonLine class="size-5" />
      ) : (
        <RiWeatherSunLine class="size-5" />
      )}
    </Button>
  );
}
