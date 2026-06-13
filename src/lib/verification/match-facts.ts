import type { Match } from "@/lib/scores/types";

export type MatchFact = {
  matchId: string;
  home: string;
  away: string;
  homeCode: string;
  awayCode: string;
  homeGoals: number;
  awayGoals: number;
  isDraw: boolean;
  winner: string | null;
  loser: string | null;
  stage: string;
  date: string;
  venue: string;
  city: string;
  detailUrl?: string;
};

/** Lowercase aliases for matching headlines to teams */
export const TEAM_ALIASES: Record<string, string[]> = {
  mexico: ["mexico", "el tri"],
  "south africa": ["south africa", "bafana"],
  "korea republic": ["korea republic", "korea rep", "south korea", "korea"],
  czechia: ["czechia", "czech republic", "czech rep", "czech"],
  canada: ["canada"],
  "bosnia & herzegovina": [
    "bosnia & herzegovina",
    "bosnia and herzegovina",
    "bosnia-herzegovina",
    "bosnia",
  ],
  usa: ["usa", "united states", "usmnt", "u.s."],
  paraguay: ["paraguay"],
  qatar: ["qatar"],
};

export function normalizeTeamName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9&\s]/g, "").replace(/\s+/g, " ").trim();
}

export function teamMatchesAlias(text: string, canonical: string): boolean {
  const hay = normalizeTeamName(text);
  const aliases = TEAM_ALIASES[canonical] ?? [canonical];
  return aliases.some((alias) => hay.includes(alias));
}

export function findTeamInText(text: string): string | null {
  const hay = normalizeTeamName(text);
  for (const canonical of Object.keys(TEAM_ALIASES)) {
    if (teamMatchesAlias(hay, canonical)) return canonical;
  }
  return null;
}

export function teamsMatch(nameA: string, nameB: string): boolean {
  const a = normalizeTeamName(nameA);
  const b = normalizeTeamName(nameB);
  if (a === b) return true;
  for (const canonical of Object.keys(TEAM_ALIASES)) {
    if (teamMatchesAlias(a, canonical) && teamMatchesAlias(b, canonical)) return true;
  }
  return false;
}

export function buildMatchFacts(matches: Match[]): MatchFact[] {
  return matches
    .filter((m) => m.status === "finished" && m.score.home != null && m.score.away != null)
    .map((m) => {
      const homeGoals = m.score.home ?? 0;
      const awayGoals = m.score.away ?? 0;
      const isDraw = homeGoals === awayGoals;
      let winner: string | null = null;
      let loser: string | null = null;
      if (!isDraw) {
        if (homeGoals > awayGoals) {
          winner = m.home.name;
          loser = m.away.name;
        } else {
          winner = m.away.name;
          loser = m.home.name;
        }
      }
      return {
        matchId: m.id,
        home: m.home.name,
        away: m.away.name,
        homeCode: m.home.code,
        awayCode: m.away.code,
        homeGoals,
        awayGoals,
        isDraw,
        winner,
        loser,
        stage: m.stage,
        date: m.date,
        venue: m.venue,
        city: m.city,
        detailUrl: m.detailUrl,
      };
    });
}

export function findFactBetween(
  facts: MatchFact[],
  teamA: string,
  teamB: string
): MatchFact | undefined {
  return facts.find(
    (f) =>
      (teamsMatch(f.home, teamA) && teamsMatch(f.away, teamB)) ||
      (teamsMatch(f.home, teamB) && teamsMatch(f.away, teamA))
  );
}

export function formatFactScore(fact: MatchFact): string {
  return `${fact.homeGoals}–${fact.awayGoals}`;
}
