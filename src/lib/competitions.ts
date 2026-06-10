import type { Competition, CompetitionId } from "@/lib/scores/types";

export const COMPETITIONS: Record<CompetitionId, Competition> = {
  "world-cup": {
    id: "world-cup",
    name: "FIFA World Cup 2026",
    shortName: "World Cup",
    season: "2026",
    active: true,
    description: "48 nations · USA, Mexico & Canada",
  },
  friendly: {
    id: "friendly",
    name: "International Friendlies",
    shortName: "Friendlies",
    season: "2026",
    active: true,
    description: "Pre-tournament warm-up matches",
  },
  "premier-league": {
    id: "premier-league",
    name: "Premier League",
    shortName: "EPL",
    season: "2026/27",
    active: false,
    description: "Coming soon — live EPL scores",
  },
  "serie-a": {
    id: "serie-a",
    name: "Serie A",
    shortName: "Serie A",
    season: "2026/27",
    active: false,
    description: "Coming soon — live Serie A scores",
  },
};

export const ACTIVE_COMPETITIONS = Object.values(COMPETITIONS).filter((c) => c.active);

export function getCompetition(id: string): Competition | null {
  if (id in COMPETITIONS) return COMPETITIONS[id as CompetitionId];
  return null;
}

export function isValidCompetition(id: string): id is CompetitionId {
  return id in COMPETITIONS;
}
