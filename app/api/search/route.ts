import { NextResponse } from "next/server";

type SearchResult = { title: string; description: string; url: string };
type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function normalizeResults(payload: unknown): SearchResult[] {
  const candidates = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.organic)
      ? payload.organic
      : isRecord(payload) && Array.isArray(payload.results)
        ? payload.results
        : [];

  return candidates
    .flatMap((candidate): SearchResult[] => {
      if (!isRecord(candidate)) {
        return [];
      }
      const title =
        typeof candidate.title === "string" ? candidate.title.trim() : "";
      const description =
        typeof candidate.description === "string"
          ? candidate.description
          : typeof candidate.snippet === "string"
            ? candidate.snippet
            : "";
      const rawUrl =
        typeof candidate.url === "string"
          ? candidate.url
          : typeof candidate.link === "string"
            ? candidate.link
            : "";
      if (!title || !rawUrl) {
        return [];
      }
      try {
        const url = new URL(rawUrl);
        return url.protocol === "http:" || url.protocol === "https:"
          ? [{ title, description, url: url.href }]
          : [];
      } catch {
        return [];
      }
    })
    .slice(0, 6);
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must contain at least 2 characters." },
      { status: 400 },
    );
  }
  if (query.length > 120) {
    return NextResponse.json({ error: "Query is too long." }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `https://freeserp.ai/api.php?q=${encodeURIComponent(query)}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      },
    );
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Search provider returned an error." },
        { status: 502 },
      );
    }
    const payload: unknown = await upstream.json();
    return NextResponse.json(normalizeResults(payload), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Search provider is unavailable." },
      { status: 502 },
    );
  }
}
