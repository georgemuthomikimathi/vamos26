import type { CompetitionId, Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import { LIVE_MATCHES } from "@/lib/live";
import { attachLineupsToMatches } from "@/lib/scores/lineups";
import { fetchWorldCup26Fixtures } from "@/lib/scores/providers/worldcup26";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";

const STATIC: Record<CompetitionId, Match[]> = {
  "world-cup": LIVE_MATCHES,
  friendly: FRIENDLY_MATCHES,
  "premier-league": [],
  "serie-a": [],
};

export type ScoreProvider = "worldcup26" | "static";

export type FetchReason = "worldcup26" | "static_api_empty" | "static_api_error";

function finalizeMatches(matches: Match[]): Match[] {
  return enrichMatchesFromMeta(attachLineupsToMatches(matches));
}

/** World Cup 2026 uses worldcup26.ir as the sole live data source (free, no API key). */
export async function fetchMatchesByCompetition(
  competition: CompetitionId
): Promise<{
  matches: Match[];
  source: "api" | "static";
  provider: ScoreProvider;
  reason: FetchReason;
  apiError?: string;
}> {
  if (competition !== "world-cup") {
    return {
      matches: finalizeMatches(STATIC[competition] ?? []),
      source: "static",
      provider: "static",
      reason: "static_api_empty",
    };
  }

  const { matches: wc26Matches, error: wc26Error } =
    await fetchWorldCup26Fixtures(competition);

  if (wc26Matches && wc26Matches.length > 0) {
    return {
      matches: finalizeMatches(wc26Matches),
      source: "api",
      provider: "worldcup26",
      reason: "worldcup26",
    };
  }

  return {
    matches: finalizeMatches(STATIC[competition] ?? []),
    source: "static",
    provider: "static",
    reason: "static_api_empty",
    apiError: wc26Error ?? "worldcup26.ir unavailable — showing preview schedule.",
  };
}
