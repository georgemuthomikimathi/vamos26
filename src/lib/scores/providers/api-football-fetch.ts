import {
  getApiFootballKey,
  getApiFootballAuthMode,
  type ApiFootballAuthMode,
} from "@/lib/scores/providers/api-config";

export const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";

type ApiFetchOptions = {
  revalidate?: number;
  authMode?: ApiFootballAuthMode;
  /** When true, only use authMode — no fallback (for key verification) */
  strictAuth?: boolean;
};

function buildHeaders(key: string, mode: ApiFootballAuthMode): HeadersInit {
  if (mode === "rapidapi") {
    return {
      "x-rapidapi-key": key,
      "x-rapidapi-host": "v3.football.api-sports.io",
    };
  }
  return { "x-apisports-key": key };
}

function isMissingKeyError(error?: string): boolean {
  if (!error) return false;
  return /missing application key|no_key|auth_401|auth_403/i.test(error);
}

export async function apiFootballFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<{ data: T | null; error?: string; authMode?: ApiFootballAuthMode }> {
  const key = getApiFootballKey();
  if (!key) return { data: null, error: "no_key" };

  const preferred = options.authMode ?? getApiFootballAuthMode();
  const modes: ApiFootballAuthMode[] = options.strictAuth
    ? [preferred]
    : preferred === "rapidapi"
      ? ["rapidapi", "direct"]
      : ["direct", "rapidapi"];

  let lastError: string | undefined;

  for (const mode of modes) {
    try {
      const res = await fetch(`${API_FOOTBALL_BASE}${path}`, {
        headers: buildHeaders(key, mode),
        ...(options.revalidate != null
          ? { next: { revalidate: options.revalidate } }
          : { cache: "no-store" as const }),
      });

      if (res.status === 401 || res.status === 403) {
        lastError = `auth_${res.status}`;
        continue;
      }
      if (!res.ok) {
        lastError = `http_${res.status}`;
        continue;
      }

      const payload = (await res.json()) as {
        response?: T;
        errors?: Record<string, string>;
      };

      if (payload.errors && Object.keys(payload.errors).length > 0) {
        const err = JSON.stringify(payload.errors);
        lastError = err;
        if (isMissingKeyError(err)) continue;
        return { data: null, error: err, authMode: mode };
      }

      return { data: (payload.response ?? null) as T | null, authMode: mode };
    } catch (e) {
      lastError = e instanceof Error ? e.message : "fetch_failed";
    }
  }

  return { data: null, error: lastError ?? "fetch_failed" };
}

/** Probe which auth header works without exposing the full key */
export async function verifyApiFootballKey(): Promise<{
  keyLength: number;
  keyPrefix: string;
  keySuffix: string;
  isHexKey: boolean;
  configured: boolean;
  workingMode: ApiFootballAuthMode | null;
  direct: { ok: boolean; error?: string };
  rapidapi: { ok: boolean; error?: string };
  hint: string;
}> {
  const key = getApiFootballKey();
  const configured = key.length >= 32;

  const probe = async (mode: ApiFootballAuthMode) => {
    const { data, error } = await apiFootballFetch<{ account?: unknown }>(
      "/status",
      { authMode: mode, strictAuth: true }
    );
    const ok = Boolean(data && typeof data === "object" && "account" in data) && !error;
    return { ok, error };
  };

  const [direct, rapidapi] = await Promise.all([probe("direct"), probe("rapidapi")]);
  const workingMode = direct.ok ? "direct" : rapidapi.ok ? "rapidapi" : null;

  let hint = "Copy your key from dashboard.api-football.com → Profile (API-Sports direct key).";
  if (workingMode === "rapidapi") {
    hint = "Your key works with RapidAPI headers — set API_FOOTBALL_AUTH=rapidapi in Vercel.";
  } else if (!direct.ok && !rapidapi.ok) {
    hint =
      "Key is rejected by both direct and RapidAPI. Regenerate at dashboard.api-football.com and paste only the 32-char hex key into API_FOOTBALL_KEY (no quotes/spaces).";
  } else if (workingMode === "direct") {
    hint = "Direct API-Sports key works. Redeploy if production still shows errors.";
  }

  return {
    keyLength: key.length,
    keyPrefix: key.slice(0, 4) + "…",
    keySuffix: "…" + key.slice(-4),
    isHexKey: /^[a-f0-9]{32}$/i.test(key),
    configured,
    workingMode,
    direct,
    rapidapi,
    hint,
  };
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
