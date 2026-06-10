export type CompetitionId =
  | "world-cup"
  | "friendly"
  | "premier-league"
  | "serie-a";

export type MatchStatus = "scheduled" | "live" | "halftime" | "finished";

/** Nullable score — null means pre-match (nil-nil / not started) */
export type Score = {
  home: number | null;
  away: number | null;
};

export type TeamRef = {
  name: string;
  code: string;
};

export type MatchEvent = {
  minute: number;
  type: "goal" | "yellow" | "red";
  player: string;
  team: "home" | "away";
};

export type Match = {
  id: string;
  competition: CompetitionId;
  status: MatchStatus;
  minute?: number;
  date: string;
  time: string;
  home: TeamRef;
  away: TeamRef;
  venue: string;
  city: string;
  stage: string;
  score: Score;
  events?: MatchEvent[];
};

export type Competition = {
  id: CompetitionId;
  name: string;
  shortName: string;
  season: string;
  active: boolean;
  description: string;
};

export function formatScore(score: Score): string {
  if (score.home === null || score.away === null) return "–";
  return `${score.home} – ${score.away}`;
}

export function isPreMatch(score: Score): boolean {
  return score.home === null || score.away === null;
}

export function getLiveCount(matches: Match[]): number {
  return matches.filter((m) => m.status === "live" || m.status === "halftime").length;
}
