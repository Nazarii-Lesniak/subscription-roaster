"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Theme } from "@/lib/types";

const Context = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("subscription-roaster:theme");
    if (stored === "light" || stored === "dark" || stored === "system") {
      setTheme(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    window.localStorage.setItem("subscription-roaster:theme", theme);

    const root = document.documentElement;

    root.classList.toggle(
      "dark",
      theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches),
    );

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const sync = () => {
      if (theme === "system") {
        root.classList.toggle("dark", media.matches);
      }
    };

    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, [hydrated, theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useTheme() {
  const value = useContext(Context);

  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return value;
}
