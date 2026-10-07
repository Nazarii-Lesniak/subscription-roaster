import type { Subscription } from "./types";

const STORAGE_KEY = "subscription-roaster:v1";

export function readSubscriptions(): Subscription[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is Subscription =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "name" in item &&
        "price" in item,
    );
  } catch {
    return [];
  }
}

export function writeSubscriptions(items: Subscription[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function makeLogoUrl(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");

    return hostname ? `https://logo.clearbit.com/${hostname}` : undefined;
  } catch {
    return undefined;
  }
}
