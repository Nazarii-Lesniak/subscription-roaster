import type { SearchResult } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function searchWeb(
  query: string,
  signal: AbortSignal,
): Promise<SearchResult[]> {
  const response = await fetch(
    `https://freeserp.ai/api.php?q=${encodeURIComponent(query)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("Search request failed");
  }

  const payload: unknown = await response.json();

  const candidates = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.organic)
      ? payload.organic
      : isRecord(payload) && Array.isArray(payload.results)
        ? payload.results
        : [];

  return candidates
    .flatMap((item): SearchResult[] => {
      if (!isRecord(item)) {
        return [];
      }

      const title = typeof item.title === "string" ? item.title : "";

      const description =
        typeof item.description === "string"
          ? item.description
          : typeof item.snippet === "string"
            ? item.snippet
            : "";

      const url =
        typeof item.url === "string"
          ? item.url
          : typeof item.link === "string"
            ? item.link
            : "";

      if (!title || !url) {
        return [];
      }

      try {
        const parsed = new URL(url);

        return parsed.protocol === "https:" || parsed.protocol === "http:"
          ? [{ title, description, url: parsed.href }]
          : [];
      } catch {
        return [];
      }
    })
    .slice(0, 6);
}
