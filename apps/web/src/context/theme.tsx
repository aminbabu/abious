import { createSignal, onMount, createContext, useContext, JSX } from "solid-js";

interface ThemeContextProps {
  theme: () => string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>();

export function ThemeProvider(props: { children: JSX.Element }) {
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  };

  const [theme, setTheme] = createSignal<string>(getInitialTheme());

  onMount(() => {
    applyTheme(theme());
  });

  const applyTheme = (t: string) => {
    document.body.classList.remove(t === "dark" ? "light" : "dark");
    document.body.classList.add(t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", t);
  };

  const toggleTheme = () => {
    const next = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: () => "light",
      toggleTheme: () => {},
    };
  }
  return ctx;
}
