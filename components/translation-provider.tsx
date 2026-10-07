"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Language } from "@/lib/types";
import en from "@/locales/en.json";
import uk from "@/locales/uk.json";

export type TranslationMessages = typeof en;
type TranslationContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationMessages;
  format: (template: string, values: Record<string, string>) => string;
};
const dictionaries: Record<Language, TranslationMessages> = { en, uk };
const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(
      "subscription-roaster:language",
    );
    if (storedLanguage === "en" || storedLanguage === "uk") {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("subscription-roaster:language", language);
    document.documentElement.lang = language;
    document.title = dictionaries[language].meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", dictionaries[language].meta.description);
  }, [language]);

  const format = useCallback(
    (template: string, values: Record<string, string>) =>
      template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? ""),
    [],
  );
  const value = useMemo(
    () => ({ language, setLanguage, t: dictionaries[language], format }),
    [format, language],
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const value = useContext(TranslationContext);
  if (!value) {
    throw new Error("useTranslation must be used inside TranslationProvider");
  }
  return value;
}
