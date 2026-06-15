import type { CompetitionId, Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import { LIVE_MATCHES } from "@/lib/live";
import { attachLineupsToMatches } from "@/lib/scores/lineups";
import { isApiFootballConfigured } from "@/lib/scores/providers/api-config";
import { fetchApiFootballFixtures } from "@/lib/scores/providers/api-football";
import {
  getCachedApiFootballAgeMs,
  getCachedApiFootballFixtures,
  getFixtureCacheSoftTtlMs,
  setCachedApiFootballFixtures,
} from "@/lib/scores/providers/api-football-fixture-cache";
import {
  getApiQuotaBlockReason,
  isApiQuotaBlocked,
} from "@/lib/scores/providers/api-football-quota";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";

const STATIC: Record<CompetitionId, Match[]> = {
  "world-cup": LIVE_MATCHES,
  friendly: FRIENDLY_MATCHES,
  "premier-league": [],
  "serie-a": [],
};

export type ScoreProvider = "api-football" | "static";

export type FetchReason =
  | "api_football"
  | "api_football_cached"
  | "static_no_key"
  | "static_api_empty"
  | "static_api_error";

export function isApiFootballPlanError(error?: string): boolean {
  if (!error) return false;
  return /free plans do not have access|do not have access to this season/i.test(error);
}

export function isApiFootballRateLimitError(error?: string): boolean {
  if (!error) return false;
  return /rate limit|too many requests|request limit|requests per day|quota_blocked|http_429/i.test(
    error
  );
}

export function isApiFootballAuthError(error?: string): boolean {
  if (!error) return false;
  return (
    /^auth_/.test(error) ||
    /invalid api key|missing application key|no_key/i.test(error)
  );
}

function finalizeMatches(matches: Match[]): Match[] {
  return enrichMatchesFromMeta(attachLineupsToMatches(matches));
}

async function fetchApiFootballWithCache(
  competition: CompetitionId
): Promise<{ matches: Match[] | null; error?: string; fromCache?: boolean }> {
  const cached = getCachedApiFootballFixtures();
  const age = getCachedApiFootballAgeMs();
  const softTtl = getFixtureCacheSoftTtlMs(cached);

  if (cached?.length && age != null && age < softTtl) {
    return { matches: cached, fromCache: true };
  }

  if (isApiQuotaBlocked()) {
    const stale = getCachedApiFootballFixtures({ allowStale: true });
    if (stale?.length) {
      return { matches: stale, error: getApiQuotaBlockReason(), fromCache: true };
    }
    return { matches: null, error: "quota_blocked" };
  }

  const result = await fetchApiFootballFixtures(competition);
  if (result.matches?.length) return result;

  const stale = getCachedApiFootballFixtures({ allowStale: true });
  if (stale?.length) {
    return { matches: stale, error: result.error, fromCache: true };
  }

  return result;
}

async function returnApiFootball(
  matches: Match[],
  reason: FetchReason,
  apiFootballError?: string
): Promise<{
  matches: Match[];
  source: "api";
  provider: ScoreProvider;
  reason: FetchReason;
  apiFootballError?: string;
  apiError?: string;
}> {
  setCachedApiFootballFixtures(matches);
  return {
    matches: finalizeMatches(matches),
    source: "api",
    provider: "api-football",
    reason,
    apiFootballError,
    apiError: isApiFootballRateLimitError(apiFootballError)
      ? "Daily API quota reached — showing cached scores until reset (00:00 UTC)."
      : undefined,
  };
}

export type FetchMatchesOptions = {
  enrichEvents?: boolean;
};

export async function fetchMatchesByCompetition(
  competition: CompetitionId,
  _options: FetchMatchesOptions = {}
): Promise<{
  matches: Match[];
  source: "api" | "static";
  provider: ScoreProvider;
  reason: FetchReason;
  apiError?: string;
  apiFootballError?: string;
}> {
  if (competition === "world-cup") {
    if (!isApiFootballConfigured()) {
      return {
        matches: finalizeMatches(STATIC[competition] ?? []),
        source: "static",
        provider: "static",
        reason: "static_no_key",
        apiError:
          "Add API_FOOTBALL_KEY in Vercel → Settings → Environment Variables, then redeploy.",
      };
    }

    const { matches, error, fromCache } = await fetchApiFootballWithCache(competition);

    if (matches && matches.length > 0) {
      return returnApiFootball(
        matches,
        fromCache ? "api_football_cached" : "api_football",
        error
      );
    }

    const stale = getCachedApiFootballFixtures({ allowStale: true });
    if (stale?.length) {
      return returnApiFootball(stale, "api_football_cached", error);
    }

    return {
      matches: finalizeMatches(STATIC[competition] ?? []),
      source: "static",
      provider: "static",
      reason: error === "no_key" ? "static_no_key" : "static_api_empty",
      apiFootballError: error,
      apiError:
        error ??
        "API-Football returned no fixtures. Check your plan includes World Cup 2026.",
    };
  }

  if (!isApiFootballConfigured()) {
    return {
      matches: finalizeMatches(STATIC[competition] ?? []),
      source: "static",
      provider: "static",
      reason: "static_no_key",
      apiError:
        "Add API_FOOTBALL_KEY in Vercel → Settings → Environment Variables, then redeploy.",
    };
  }

  const { matches, error, fromCache } = await fetchApiFootballWithCache(competition);

  if (matches && matches.length > 0) {
    return returnApiFootball(
      matches,
      fromCache ? "api_football_cached" : "api_football",
      error
    );
  }

  return {
    matches: finalizeMatches(STATIC[competition] ?? []),
    source: "static",
    provider: "static",
    reason: error === "no_key" ? "static_no_key" : "static_api_empty",
    apiFootballError: error,
    apiError: error ?? "API returned zero fixtures.",
  };
}
