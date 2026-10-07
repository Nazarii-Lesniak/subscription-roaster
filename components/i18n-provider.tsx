"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Language } from "@/lib/types";

const copy = {
  en: {
    kicker: "YOUR MONEY, RECURRING",
    title: "Your subscriptions are",
    accent: "getting roasted.",
    subtitle:
      "Every little monthly charge adds up. Let’s see what your subscriptions are really costing you.",
    search: "Find a subscription",
    searchHint: "Search for a service to get started",
    name: "Subscription name",
    price: "Price",
    category: "Category",
    period: "Billing period",
    monthly: "Monthly",
    yearly: "Yearly",
    add: "Add subscription",
    save: "Save changes",
    edit: "Edit",
    delete: "Delete",
    clear: "Clear all",
    roast: "Roast my subscriptions",
    empty: "Nothing to roast. Yet.",
    emptyHint: "Add your first subscription above and we’ll do the math.",
    total: "Monthly spend",
    yearlyTotal: "Yearly projection",
    count: "subscriptions tracked",
    theme: "Theme",
    language: "Language",
    system: "System",
    light: "Light",
    dark: "Dark",
    found: "Search results",
    cancel: "Cancel",
    deleteConfirm: "Delete this subscription?",
    clearConfirm: "Clear every subscription? This cannot be undone.",
    noResults: "No results found. Try another name.",
    select: "Choose category",
    chooseResult: "Select a result to fill the name and website",
    roastIntro: "The verdict is in",
    errors: {
      name: "Enter at least 2 characters",
      price: "Price must be greater than 0",
    },
  },
  uk: {
    kicker: "ТВОЇ ГРОШІ, ЩОМІСЯЦЯ",
    title: "Твої підписки",
    accent: "отримають прочухана.",
    subtitle:
      "Кожна невелика щомісячна оплата накопичується. Подивімося, скільки насправді коштують твої підписки.",
    search: "Знайди підписку",
    searchHint: "Знайди сервіс, щоб почати",
    name: "Назва підписки",
    price: "Ціна",
    category: "Категорія",
    period: "Період оплати",
    monthly: "Щомісяця",
    yearly: "Щороку",
    add: "Додати підписку",
    save: "Зберегти зміни",
    edit: "Змінити",
    delete: "Видалити",
    clear: "Очистити все",
    roast: "Оцінити мої підписки",
    empty: "Поки нічого смажити.",
    emptyHint: "Додай першу підписку вище — ми все порахуємо.",
    total: "Витрати на місяць",
    yearlyTotal: "Прогноз на рік",
    count: "підписок додано",
    theme: "Тема",
    language: "Мова",
    system: "Системна",
    light: "Світла",
    dark: "Темна",
    found: "Результати пошуку",
    cancel: "Скасувати",
    deleteConfirm: "Видалити цю підписку?",
    clearConfirm: "Очистити всі підписки? Цю дію не можна скасувати.",
    noResults: "Нічого не знайдено. Спробуй іншу назву.",
    select: "Обери категорію",
    chooseResult: "Обери результат, щоб додати назву й сайт",
    roastIntro: "Вердикт винесено",
    errors: {
      name: "Введи щонайменше 2 символи",
      price: "Ціна має бути більшою за 0",
    },
  },
} as const;

type Copy = (typeof copy)[Language];

const I18nContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: Copy;
} | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo(
    () => ({ language, setLanguage, t: copy[language] }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);

  if (!value) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return value;
}
