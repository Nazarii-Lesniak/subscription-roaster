import type { TranslationMessages } from "@/components/translation-provider";

export function getRoast(
  monthlyTotal: number,
  translations: TranslationMessages["roast"],
): string {
  if (monthlyTotal < 100) {
    return translations.under100;
  }
  const band = String(
    Math.min(1000, Math.floor(monthlyTotal / 100) * 100),
  ) as keyof typeof translations.bands;
  const lines = translations.bands[band] ?? translations.bands["1000"];
  return (
    lines[Math.floor(Math.random() * lines.length)] ?? translations.under100
  );
}

export function monthlyCost(
  price: number,
  period: "monthly" | "yearly",
): number {
  return period === "yearly" ? price / 12 : price;
}
