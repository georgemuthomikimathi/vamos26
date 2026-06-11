import type { CompetitionId, Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import { LIVE_MATCHES } from "@/lib/live";
import { isApiFootballConfigured } from "@/lib/scores/providers/api-config";
import { fetchApiFootballFixtures } from "@/lib/scores/providers/api-football";
import { enrichMatches } from "@/lib/scores/providers/fixture-enrichment";

const STATIC: Record<CompetitionId, Match[]> = {
  "world-cup": LIVE_MATCHES,
  friendly: FRIENDLY_MATCHES,
  "premier-league": [],
  "serie-a": [],
};

export type FetchReason =
  | "api"
  | "static_no_key"
  | "static_api_empty"
  | "static_api_error";

export async function fetchMatchesByCompetition(
  competition: CompetitionId
): Promise<{ matches: Match[]; source: "api" | "static"; reason: FetchReason; apiError?: string }> {
  if (!isApiFootballConfigured()) {
    return {
      matches: STATIC[competition] ?? [],
      source: "static",
      reason: "static_no_key",
      apiError: "Add API_FOOTBALL_KEY in Vercel → Settings → Environment Variables, then Redeploy.",
    };
  }

  const { matches, error } = await fetchApiFootballFixtures(competition);

  if (matches && matches.length > 0) {
    const enriched = await enrichMatches(matches);
    return { matches: enriched, source: "api", reason: "api" };
  }

  return {
    matches: STATIC[competition] ?? [],
    source: "static",
    reason: error === "no_key" ? "static_no_key" : "static_api_empty",
    apiError: error ?? "API returned zero fixtures. Check league=1 season=2026.",
  };
}
