import type { SearchResult } from "./types";

export async function searchWeb(
  query: string,
  signal: AbortSignal,
): Promise<SearchResult[]> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    signal,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Search request failed");
  }
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Search response has an invalid shape");
  }
  return payload.filter(
    (item): item is SearchResult =>
      typeof item === "object" &&
      item !== null &&
      "title" in item &&
      typeof item.title === "string" &&
      "description" in item &&
      typeof item.description === "string" &&
      "url" in item &&
      typeof item.url === "string",
  );
}
