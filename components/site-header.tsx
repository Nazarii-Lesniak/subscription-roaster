"use client";

import { Flame, Languages, Monitor, Moon, Sun } from "lucide-react";
import { CustomDropdown } from "@/components/custom-dropdown";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "@/components/translation-provider";
import type { Language, Theme } from "@/lib/types";

type Props = { onGetStarted: () => void };

export function SiteHeader({ onGetStarted }: Props) {
  const { language, setLanguage, t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const themeIcon =
    theme === "light" ? (
      <Sun size={15} />
    ) : theme === "dark" ? (
      <Moon size={15} />
    ) : (
      <Monitor size={15} />
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-17 w-[calc(100%-20px)] max-w-305 items-center justify-between sm:h-20.5 sm:w-[calc(100%-56px)] 2xl:max-w-345">
        <a
          href="#top"
          className="group inline-flex shrink-0 items-center gap-2 rounded-lg text-[10px] font-extrabold tracking-[.105em] text-text transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:gap-2.5 sm:text-xs"
          aria-label={t.brand.home}
        >
          <span className="grid size-7.25 place-items-center rounded-[9px] border border-accent/25 bg-accent/10 text-accent transition-[transform,background-color] duration-200 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-accent/20">
            <Flame size={18} fill="currentColor" />
          </span>
          <span className="sm:hidden">{t.brand.short}</span>
          <span className="hidden sm:inline">{t.brand.name}</span>
        </a>
        <nav
          className="flex shrink-0 items-center gap-0.5 sm:gap-3"
          aria-label={t.header.preferences}
        >
          <CustomDropdown<Theme>
            label={t.header.theme}
            value={theme}
            onChange={setTheme}
            leadingIcon={themeIcon}
            hideIconOnMobile
            compact
            className="w-24 sm:w-33"
            options={[
              { value: "system", label: t.themes.system },
              { value: "light", label: t.themes.light },
              { value: "dark", label: t.themes.dark },
            ]}
          />
          <span
            className="hidden h-5 w-px bg-border sm:block"
            aria-hidden="true"
          />
          <CustomDropdown<Language>
            label={t.header.language}
            value={language}
            onChange={setLanguage}
            leadingIcon={<Languages size={15} />}
            hideIconOnMobile
            compact
            className="w-13 sm:w-18.5"
            options={[
              { value: "en", label: t.header.englishCode },
              { value: "uk", label: t.header.ukrainianCode },
            ]}
          />
          <button
            type="button"
            className="group ml-0 inline-flex min-h-9 items-center gap-1 rounded-lg bg-accent px-1.5 text-[9px] font-bold text-accent-ink shadow-sm shadow-accent/10 transition-[transform,filter,box-shadow] duration-150 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-md hover:shadow-accent/20 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:ml-1 sm:gap-1.5 sm:px-3 sm:text-xs"
            onClick={onGetStarted}
          >
            {t.header.getStarted}
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
