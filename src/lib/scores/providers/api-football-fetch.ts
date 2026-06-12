import { getApiFootballKey } from "@/lib/scores/providers/api-config";

export const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";

type ApiFetchOptions = {
  revalidate?: number;
};

export async function apiFootballFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<{ data: T | null; error?: string }> {
  const key = getApiFootballKey();
  if (!key) return { data: null, error: "no_key" };

  try {
    const res = await fetch(`${API_FOOTBALL_BASE}${path}`, {
      headers: { "x-apisports-key": key },
      ...(options.revalidate != null
        ? { next: { revalidate: options.revalidate } }
        : { cache: "no-store" as const }),
    });

    if (res.status === 401 || res.status === 403) {
      return { data: null, error: `auth_${res.status}` };
    }
    if (!res.ok) {
      return { data: null, error: `http_${res.status}` };
    }

    const payload = (await res.json()) as {
      response?: T;
      errors?: Record<string, string>;
    };

    if (payload.errors && Object.keys(payload.errors).length > 0) {
      return { data: null, error: JSON.stringify(payload.errors) };
    }

    return { data: (payload.response ?? null) as T | null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "fetch_failed" };
  }
}

export function fixtureIdFromMatchId(matchId: string): string | null {
  if (!matchId.startsWith("af-")) return null;
  return matchId.replace(/^af-/, "");
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );
  return results;
}
