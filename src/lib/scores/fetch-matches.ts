import type { CompetitionId, Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import { LIVE_MATCHES } from "@/lib/live";
import {
  fetchApiFootballFixtures,
  fetchApiFootballLive,
  isApiFootballConfigured,
} from "@/lib/scores/providers/api-football";
import { enrichMatches } from "@/lib/scores/providers/fixture-enrichment";

const STATIC: Record<CompetitionId, Match[]> = {
  "world-cup": LIVE_MATCHES,
  friendly: FRIENDLY_MATCHES,
  "premier-league": [],
  "serie-a": [],
};

export async function fetchMatchesByCompetition(
  competition: CompetitionId
): Promise<{ matches: Match[]; source: "api" | "static" }> {
  if (!isApiFootballConfigured()) {
    return { matches: STATIC[competition] ?? [], source: "static" };
  }

  let matches: Match[] | null = await fetchApiFootballFixtures(competition);

  if ((!matches || matches.length === 0) && competition === "world-cup") {
    matches = await fetchApiFootballLive();
  }

  if (matches && matches.length > 0) {
    const enriched = await enrichMatches(matches);
    return { matches: enriched, source: "api" };
  }

  return { matches: STATIC[competition] ?? [], source: "static" };
}
