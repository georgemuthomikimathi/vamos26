import type { CompetitionId, Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import { LIVE_MATCHES } from "@/lib/live";
import { attachLineupsToMatches } from "@/lib/scores/lineups";
import { mergeIrWithApiLive } from "@/lib/scores/merge-hybrid-matches";
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
import {
  fetchWorldCup26AllMatches,
  fetchWorldCup26Fixtures,
} from "@/lib/scores/providers/worldcup26";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";

const STATIC: Record<CompetitionId, Match[]> = {
  "world-cup": LIVE_MATCHES,
  friendly: FRIENDLY_MATCHES,
  "premier-league": [],
  "serie-a": [],
};

export type ScoreProvider = "api-football" | "worldcup26" | "hybrid" | "static";

export type FetchReason =
  | "api_football"
  | "api_football_cached"
  | "worldcup26"
  | "hybrid_ir_api"
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

async function loadWorldCup26Matches(): Promise<{ matches: Match[] | null; error?: string }> {
  const all = await fetchWorldCup26AllMatches("world-cup");
  if (all.matches?.length) return all;

  const recent = await fetchWorldCup26Fixtures("world-cup");
  if (recent.matches?.length) return recent;

  return { matches: null, error: all.error ?? recent.error ?? "no_games" };
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

function apiLiveOnly(matches: Match[] | null | undefined): Match[] {
  if (!matches?.length) return [];
  return matches.filter((m) => m.status === "live" || m.status === "halftime");
}

function hybridApiError(hasLiveFromApi: boolean, apiError?: string, irLiveCount = 0): string | undefined {
  if (hasLiveFromApi || !apiError) return undefined;
  if (isApiFootballRateLimitError(apiError)) {
    return irLiveCount > 0
      ? "API quota reached — live clock from worldcup26.ir backup."
      : "Live clock unavailable (API quota) — scores & scorers from worldcup26.ir.";
  }
  if (isApiFootballAuthError(apiError)) {
    return "Live clock unavailable — fix API_FOOTBALL_KEY. Scores from worldcup26.ir.";
  }
  return undefined;
}

async function returnHybridWorldCup(
  irMatches: Match[],
  apiMatches: Match[] | null,
  apiFootballError?: string,
  fromCache?: boolean
): Promise<{
  matches: Match[];
  source: "api";
  provider: ScoreProvider;
  reason: FetchReason;
  apiFootballError?: string;
  apiError?: string;
}> {
  const liveOverlay = apiLiveOnly(apiMatches);
  const merged = mergeIrWithApiLive(irMatches, liveOverlay);
  const irLiveCount = irMatches.filter(
    (m) => m.status === "live" || m.status === "halftime"
  ).length;

  if (apiMatches?.length) {
    setCachedApiFootballFixtures(apiMatches);
  }

  const hasLiveFromApi = liveOverlay.length > 0;

  return {
    matches: finalizeMatches(merged),
    source: "api",
    provider: hasLiveFromApi ? "hybrid" : "worldcup26",
    reason: hasLiveFromApi
      ? fromCache
        ? "api_football_cached"
        : "hybrid_ir_api"
      : "worldcup26",
    apiFootballError,
    apiError: hybridApiError(hasLiveFromApi, apiFootballError, irLiveCount),
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
    const [irResult, apiResult] = await Promise.all([
      loadWorldCup26Matches(),
      isApiFootballConfigured()
        ? fetchApiFootballWithCache(competition)
        : Promise.resolve({
            matches: null as Match[] | null,
            error: "no_key" as string | undefined,
            fromCache: false as boolean | undefined,
          }),
    ]);

    if (irResult.matches?.length) {
      return returnHybridWorldCup(
        irResult.matches,
        apiResult.matches,
        apiResult.error,
        apiResult.fromCache
      );
    }

    if (apiResult.matches?.length) {
      setCachedApiFootballFixtures(apiResult.matches);
      return {
        matches: finalizeMatches(apiResult.matches),
        source: "api",
        provider: "api-football",
        reason: apiResult.fromCache ? "api_football_cached" : "api_football",
        apiFootballError: apiResult.error,
      };
    }

    const stale = getCachedApiFootballFixtures({ allowStale: true });
    if (stale?.length) {
      return {
        matches: finalizeMatches(stale),
        source: "api",
        provider: "api-football",
        reason: "api_football_cached",
        apiFootballError: apiResult.error ?? irResult.error,
        apiError: hybridApiError(false, apiResult.error ?? irResult.error),
      };
    }

    return {
      matches: finalizeMatches(STATIC[competition] ?? []),
      source: "static",
      provider: "static",
      reason: "static_api_empty",
      apiFootballError: apiResult.error,
      apiError:
        irResult.error ??
        apiResult.error ??
        "No fixtures from worldcup26.ir or API-Football.",
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
    setCachedApiFootballFixtures(matches);
    return {
      matches: finalizeMatches(matches),
      source: "api",
      provider: "api-football",
      reason: fromCache ? "api_football_cached" : "api_football",
      apiFootballError: error,
      apiError: isApiFootballRateLimitError(error)
        ? "Daily API quota reached — showing cached scores until reset (00:00 UTC)."
        : undefined,
    };
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
