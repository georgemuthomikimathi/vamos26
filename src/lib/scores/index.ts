import type { CompetitionId, Match } from "@/lib/scores/types";
import { FRIENDLY_MATCHES } from "@/lib/friendlies";
import { LIVE_MATCHES } from "@/lib/live";

const MATCH_REGISTRY: Record<CompetitionId, Match[]> = {
  "world-cup": LIVE_MATCHES,
  friendly: FRIENDLY_MATCHES,
  "premier-league": [],
  "serie-a": [],
};

export function getMatchesByCompetition(competition: CompetitionId): Match[] {
  return MATCH_REGISTRY[competition] ?? [];
}

export function getAllActiveMatches(): Match[] {
  return [...LIVE_MATCHES, ...FRIENDLY_MATCHES];
}
