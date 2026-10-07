"use client";
import {
  ChevronDown,
  Flame,
  Languages,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import type { Theme } from "@/lib/types";
import { useI18n } from "./i18n-provider";
import { useTheme } from "./theme-provider";

type Props = { onGetStarted: () => void };

export function SiteHeader({ onGetStarted }: Props) {
  const { t, language, setLanguage } = useI18n();
  const { theme, setTheme } = useTheme();

  const choices: { id: Theme; label: string; Icon: typeof Sun }[] = [
    { id: "system", label: t.system, Icon: Monitor },
    { id: "light", label: t.light, Icon: Sun },
    { id: "dark", label: t.dark, Icon: Moon },
  ];

  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="Subscription Roaster home">
        <span className="brand-mark">
          <Flame size={18} fill="currentColor" />
        </span>
        <span>
          SUBSCRIPTION<span className="brand-muted">ROASTER</span>
        </span>
      </a>
      <nav className="header-actions" aria-label="Preferences">
        <label className="sr-only" htmlFor="theme-select">
          {t.theme}
        </label>
        <div className="header-select">
          <Sun className="header-select-icon" size={15} />
          <select
            id="theme-select"
            value={theme}
            onChange={(event) => setTheme(event.currentTarget.value as Theme)}
            aria-label={t.theme}
          >
            {choices.map(({ id, label }) => (
              <option value={id} key={id}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown size={13} />
        </div>
        <span className="header-divider" aria-hidden="true" />
        <Languages size={15} className="language-icon" aria-hidden="true" />
        <div className="header-select language-select">
          <label className="sr-only" htmlFor="language-select">
            {t.language}
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(event) =>
              setLanguage(event.currentTarget.value as "en" | "uk")
            }
            aria-label={t.language}
          >
            <option value="en">EN</option>
            <option value="uk">UA</option>
          </select>
          <ChevronDown size={13} />
        </div>
        <button
          type="button"
          className="button button-primary header-cta"
          onClick={onGetStarted}
        >
          Get started <span aria-hidden="true">↗</span>
        </button>
      </nav>
    </header>
  );
}
