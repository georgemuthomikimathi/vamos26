import type { CompetitionId, Match } from "@/lib/scores/types";
import { LIVE_MATCHES } from "@/lib/live";

const MATCH_REGISTRY: Record<CompetitionId, Match[]> = {
  "world-cup": LIVE_MATCHES,
  friendly: [],
  "premier-league": [],
  "serie-a": [],
};

export function getMatchesByCompetition(competition: CompetitionId): Match[] {
  return MATCH_REGISTRY[competition] ?? [];
}

export function getAllActiveMatches(): Match[] {
  return LIVE_MATCHES;
}
