import type { CompetitionId, Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import { LIVE_MATCHES } from "@/lib/live";
import { isApiFootballConfigured } from "@/lib/scores/providers/api-config";
import { fetchApiFootballFixtures } from "@/lib/scores/providers/api-football";
import { fetchWorldCup26Fixtures } from "@/lib/scores/providers/worldcup26";
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
  | "worldcup26"
  | "static_no_key"
  | "static_api_empty"
  | "static_api_error"
  | "static_plan_fallback";

export function isApiFootballPlanError(error?: string): boolean {
  if (!error) return false;
  return /free plans do not have access|do not have access to this season/i.test(error);
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
      const { matches, error } = await fetchApiFootballFixtures(competition);
      apiFootballError = error;

      if (matches && matches.length > 0) {
        const enriched = await enrichMatches(matches);
        return {
          matches: enriched,
          source: "api",
          provider: "api-football",
          reason: "api_football",
        };
      }
    } else {
      apiFootballError = "no_key";
    }

    const { matches: wc26Matches, error: wc26Error } = await fetchWorldCup26Fixtures(competition);
    if (wc26Matches && wc26Matches.length > 0) {
      return {
        matches: wc26Matches,
        source: "api",
        provider: "worldcup26",
        reason: isApiFootballPlanError(apiFootballError) ? "static_plan_fallback" : "worldcup26",
        apiFootballError,
        apiError: isApiFootballPlanError(apiFootballError)
          ? "API-Football free plan cannot access WC 2026 — using worldcup26.ir instead."
          : undefined,
      };
    }

    return {
      matches: STATIC[competition] ?? [],
      source: "static",
      provider: "static",
      reason: isApiFootballPlanError(apiFootballError)
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
      matches: STATIC[competition] ?? [],
      source: "static",
      provider: "static",
      reason: "static_no_key",
      apiError: "Add API_FOOTBALL_KEY in Vercel → Settings → Environment Variables, then Redeploy.",
    };
  }

  const { matches, error } = await fetchApiFootballFixtures(competition);

  if (matches && matches.length > 0) {
    const enriched = await enrichMatches(matches);
    return {
      matches: enriched,
      source: "api",
      provider: "api-football",
      reason: "api_football",
    };
  }

  return {
    matches: STATIC[competition] ?? [],
    source: "static",
    provider: "static",
    reason: error === "no_key" ? "static_no_key" : "static_api_empty",
    apiFootballError: error,
    apiError: error ?? "API returned zero fixtures.",
  };
}
