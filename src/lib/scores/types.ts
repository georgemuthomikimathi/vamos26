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

export type MatchSubstitution = {
  minute: number;
  extraMinute?: number;
  playerIn: string;
  playerOut: string;
};

export type LineupPlayer = {
  name: string;
  number: number;
  position: string;
};

export type MatchLineup = {
  formation?: string;
  coach?: string;
  startingXI: LineupPlayer[];
  bench?: LineupPlayer[];
};

export type MatchEvent = {
  minute: number;
  extraMinute?: number;
  type: "goal" | "yellow" | "red" | "penalty" | "penalty_missed" | "subst";
  player: string;
  playerSecondary?: string;
  team: "home" | "away";
  detail?: string;
};

export type Match = {
  id: string;
  competition: CompetitionId;
  status: MatchStatus;
  statusShort?: string;
  minute?: number;
  extraMinute?: number;
  /** ISO kickoff for countdown */
  kickoffAt?: string;
  date: string;
  time: string;
  home: TeamRef;
  away: TeamRef;
  venue: string;
  city: string;
  stage: string;
  score: Score;
  events?: MatchEvent[];
  homeSubs?: MatchSubstitution[];
  awaySubs?: MatchSubstitution[];
  homeLineup?: MatchLineup;
  awayLineup?: MatchLineup;
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

export function formatMatchMinute(match: Match): string {
  if (match.status === "halftime") return "HT";
  if (match.status === "finished") return "FT";
  if (match.status === "scheduled") return match.time;
  if (match.minute == null) return "LIVE";
  if (match.extraMinute && match.extraMinute > 0) {
    return `${match.minute}+${match.extraMinute}'`;
  }
  return `${match.minute}'`;
}
