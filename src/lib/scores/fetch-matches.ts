import type { CompetitionId, Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import { LIVE_MATCHES } from "@/lib/live";
import {
  fetchApiFootballFixtures,
  fetchApiFootballLive,
  isApiFootballConfigured,
} from "@/lib/scores/providers/api-football";

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

  const fromApi = await fetchApiFootballFixtures(competition);
  if (fromApi && fromApi.length > 0) {
    return { matches: fromApi, source: "api" };
  }

  // World Cup: if no WC fixtures yet, show live matches from API for demo/testing
  if (competition === "world-cup") {
    const live = await fetchApiFootballLive();
    if (live && live.length > 0) {
      return { matches: live, source: "api" };
    }
  }

  return { matches: STATIC[competition] ?? [], source: "static" };
}
