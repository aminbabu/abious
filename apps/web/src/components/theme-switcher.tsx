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
        <i class="ri-moon-line text-lg" />
      ) : (
        <i class="ri-sun-line text-lg" />
      )}
    </Button>
  );
}
