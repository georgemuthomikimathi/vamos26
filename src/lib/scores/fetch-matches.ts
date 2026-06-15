import type { CompetitionId, Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import { LIVE_MATCHES } from "@/lib/live";
import { attachLineupsToMatches } from "@/lib/scores/lineups";
import { isApiFootballConfigured } from "@/lib/scores/providers/api-config";
import { fetchApiFootballFixtures } from "@/lib/scores/providers/api-football";
import {
  getCachedApiFootballFixtures,
  setCachedApiFootballFixtures,
} from "@/lib/scores/providers/api-football-fixture-cache";
import {
  fetchWorldCup26Fixtures,
  fetchWorldCup26AllGroupMatches,
} from "@/lib/scores/providers/worldcup26";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";
import { enrichMatches } from "@/lib/scores/providers/fixture-enrichment";

const STATIC: Record<CompetitionId, Match[]> = {
  "world-cup": LIVE_MATCHES,
  friendly: FRIENDLY_MATCHES,
  "premier-league": [],
  "serie-a": [],
};

export type ScoreProvider = "api-football" | "worldcup26" | "static";

export type FetchReason =
  | "api_football"
  | "api_football_cached"
  | "worldcup26"
  | "static_no_key"
  | "static_api_empty"
  | "static_api_error"
  | "static_plan_fallback";

export function isApiFootballPlanError(error?: string): boolean {
  if (!error) return false;
  return /free plans do not have access|do not have access to this season/i.test(error);
}

export function isApiFootballRateLimitError(error?: string): boolean {
  if (!error) return false;
  return /rate limit|too many requests|request limit|requests per day|http_429/i.test(
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

/** When true, API-Football cannot serve WC 2026 — use worldcup26.ir as the sole source. */
export function shouldPreferWorldCup26Only(apiFootballError?: string): boolean {
  if (!apiFootballError) return false;
  if (isApiFootballRateLimitError(apiFootballError)) return false;
  return (
    isApiFootballPlanError(apiFootballError) ||
    isApiFootballAuthError(apiFootballError) ||
    apiFootballError === "no_key"
  );
}

/** @deprecated Use shouldPreferWorldCup26Only */
export function shouldFallbackToWorldCup26(apiFootballError?: string): boolean {
  return shouldPreferWorldCup26Only(apiFootballError);
}

function finalizeMatches(matches: Match[]): Match[] {
  return enrichMatchesFromMeta(attachLineupsToMatches(matches));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadWorldCup26Matches(): Promise<{ matches: Match[] | null; error?: string }> {
  const recent = await fetchWorldCup26Fixtures("world-cup");
  if (recent.matches?.length) return recent;

  const all = await fetchWorldCup26AllGroupMatches("world-cup");
  if (all.matches?.length) return all;

  return { matches: null, error: recent.error ?? all.error ?? "no_games" };
}

async function finalizeApiFootballMatches(matches: Match[]): Promise<Match[]> {
  const enriched = await enrichMatches(matches, { skipLineups: true });
  return finalizeMatches(enriched);
}

async function fetchApiFootballWithRetry(
  competition: CompetitionId
): Promise<{ matches: Match[] | null; error?: string; fromCache?: boolean }> {
  let result = await fetchApiFootballFixtures(competition);
  if (result.matches?.length) return result;

  if (isApiFootballRateLimitError(result.error)) {
    await sleep(700);
    result = await fetchApiFootballFixtures(competition);
    if (result.matches?.length) return result;

    const cached = getCachedApiFootballFixtures();
    if (cached?.length) {
      return { matches: cached, error: result.error, fromCache: true };
    }
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
}> {
  setCachedApiFootballFixtures(matches);
  const finalized = await finalizeApiFootballMatches(matches);
  return {
    matches: finalized,
    source: "api",
    provider: "api-football",
    reason,
    apiFootballError,
  };
}

export async function fetchMatchesByCompetition(
  competition: CompetitionId
): Promise<{
  matches: Match[];
  source: "api" | "static";
  provider: ScoreProvider;
  reason: FetchReason;
  apiError?: string;
  apiFootballError?: string;
}> {
  let apiFootballError: string | undefined;

  if (competition === "world-cup") {
    if (isApiFootballConfigured()) {
      const { matches, error, fromCache } = await fetchApiFootballWithRetry(competition);
      apiFootballError = error;

      if (matches && matches.length > 0) {
        return returnApiFootball(
          matches,
          fromCache ? "api_football_cached" : "api_football",
          error
        );
      }

      if (!shouldPreferWorldCup26Only(error)) {
        const cached = getCachedApiFootballFixtures();
        if (cached?.length) {
          return returnApiFootball(cached, "api_football_cached", error);
        }
      }
    } else {
      apiFootballError = "no_key";
    }

    const { matches: wc26Matches, error: wc26Error } = await loadWorldCup26Matches();
    if (wc26Matches && wc26Matches.length > 0) {
      const fallbackReason = shouldPreferWorldCup26Only(apiFootballError)
        ? "static_plan_fallback"
        : "worldcup26";
      return {
        matches: finalizeMatches(wc26Matches),
        source: "api",
        provider: "worldcup26",
        reason: fallbackReason,
        apiFootballError,
        apiError: isApiFootballPlanError(apiFootballError)
          ? "API-Football free plan cannot access WC 2026 — using worldcup26.ir instead."
          : isApiFootballRateLimitError(apiFootballError)
            ? "API-Football rate limit hit — using worldcup26.ir until quota resets."
            : isApiFootballAuthError(apiFootballError)
              ? "API-Football auth failed — using worldcup26.ir. Fix API_FOOTBALL_KEY in Vercel."
              : undefined,
      };
    }

    return {
      matches: finalizeMatches(STATIC[competition] ?? []),
      source: "static",
      provider: "static",
      reason: shouldPreferWorldCup26Only(apiFootballError)
        ? "static_plan_fallback"
        : apiFootballError === "no_key"
          ? "static_no_key"
          : "static_api_empty",
      apiFootballError,
      apiError:
        wc26Error ??
        apiFootballError ??
        "No live fixtures from API-Football or worldcup26.ir.",
    };
  }

  if (!isApiFootballConfigured()) {
    return {
      matches: finalizeMatches(STATIC[competition] ?? []),
      source: "static",
      provider: "static",
      reason: "static_no_key",
      apiError:
        "Add API_FOOTBALL_KEY in Vercel → Settings → Environment Variables, then Redeploy.",
    };
  }

  const { matches, error } = await fetchApiFootballWithRetry(competition);

  if (matches && matches.length > 0) {
    return returnApiFootball(matches, "api_football", error);
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
