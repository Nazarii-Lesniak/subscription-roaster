export const categories = [
  "Streaming",
  "Software",
  "Music",
  "Gaming",
  "Productivity",
  "Other",
] as const;

export type Category = (typeof categories)[number];
export type Period = "monthly" | "yearly";

export type Subscription = {
  id: string;
  name: string;
  price: number;
  period: Period;
  category: Category;
  url?: string;
  logoUrl?: string;
  createdAt: string;
};

export type SearchResult = { title: string; description: string; url: string };
export type Theme = "system" | "light" | "dark";
export type Language = "en" | "uk";
