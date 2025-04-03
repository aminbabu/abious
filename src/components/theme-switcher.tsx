import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme";
import { RiMoonLine, RiSunLine } from "@remixicon/react";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="cursor-pointer"
    >
      {theme === "dark" ? <RiMoonLine /> : <RiSunLine />}
    </Button>
  );
};

export default ThemeSwitcher;
