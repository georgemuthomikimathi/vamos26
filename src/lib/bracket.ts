import type { Group } from "./data";
import type { Match } from "@/lib/scores/types";

export type KnockoutRound = {
  id: string;
  name: string;
  shortName: string;
  matches: number;
  teams: number;
  dates: string;
};

export const KNOCKOUT_ROUNDS: KnockoutRound[] = [
  {
    id: "r32",
    name: "Round of 32",
    shortName: "R32",
    matches: 16,
    teams: 32,
    dates: "Jun 28 – Jul 3",
  },
  {
    id: "r16",
    name: "Round of 16",
    shortName: "R16",
    matches: 8,
    teams: 16,
    dates: "Jul 4 – Jul 7",
  },
  {
    id: "qf",
    name: "Quarter-Finals",
    shortName: "QF",
    matches: 4,
    teams: 8,
    dates: "Jul 9 – Jul 11",
  },
  {
    id: "sf",
    name: "Semi-Finals",
    shortName: "SF",
    matches: 2,
    teams: 4,
    dates: "Jul 14 – Jul 15",
  },
  {
    id: "final",
    name: "THE FINAL",
    shortName: "Final",
    matches: 1,
    teams: 2,
    dates: "Jul 19",
  },
];

export type BracketTeam = {
  name: string;
  code: string;
};

export type BracketMatch = {
  id: string;
  roundId: string;
  home: BracketTeam | null;
  away: BracketTeam | null;
  winnerCode: string | null;
};

type TeamRef = BracketTeam | { winnerOf: string };

type BracketMatchDef = {
  id: string;
  roundId: string;
  home: TeamRef;
  away: TeamRef;
};

/** Round of 32 — fixed after group stage (combination #3, Annex C). */
const R32_TEAMS: BracketMatchDef[] = [
  {
    id: "r32-1",
    roundId: "r32",
    home: { name: "South Africa", code: "za" },
    away: { name: "Canada", code: "ca" },
  },
  {
    id: "r32-2",
    roundId: "r32",
    home: { name: "Brazil", code: "br" },
    away: { name: "Japan", code: "jp" },
  },
  {
    id: "r32-3",
    roundId: "r32",
    home: { name: "Germany", code: "de" },
    away: { name: "Paraguay", code: "py" },
  },
  {
    id: "r32-4",
    roundId: "r32",
    home: { name: "Netherlands", code: "nl" },
    away: { name: "Morocco", code: "ma" },
  },
  {
    id: "r32-5",
    roundId: "r32",
    home: { name: "Côte d'Ivoire", code: "ci" },
    away: { name: "Norway", code: "no" },
  },
  {
    id: "r32-6",
    roundId: "r32",
    home: { name: "France", code: "fr" },
    away: { name: "Sweden", code: "se" },
  },
  {
    id: "r32-7",
    roundId: "r32",
    home: { name: "Mexico", code: "mx" },
    away: { name: "Ecuador", code: "ec" },
  },
  {
    id: "r32-8",
    roundId: "r32",
    home: { name: "England", code: "gb-eng" },
    away: { name: "DR Congo", code: "cd" },
  },
  {
    id: "r32-9",
    roundId: "r32",
    home: { name: "USA", code: "us" },
    away: { name: "Bosnia & Herzegovina", code: "ba" },
  },
  {
    id: "r32-10",
    roundId: "r32",
    home: { name: "Belgium", code: "be" },
    away: { name: "Senegal", code: "sn" },
  },
  {
    id: "r32-11",
    roundId: "r32",
    home: { name: "Portugal", code: "pt" },
    away: { name: "Croatia", code: "hr" },
  },
  {
    id: "r32-12",
    roundId: "r32",
    home: { name: "Spain", code: "es" },
    away: { name: "Austria", code: "at" },
  },
  {
    id: "r32-13",
    roundId: "r32",
    home: { name: "Switzerland", code: "ch" },
    away: { name: "Algeria", code: "dz" },
  },
  {
    id: "r32-14",
    roundId: "r32",
    home: { name: "Argentina", code: "ar" },
    away: { name: "Cabo Verde", code: "cv" },
  },
  {
    id: "r32-15",
    roundId: "r32",
    home: { name: "Colombia", code: "co" },
    away: { name: "Ghana", code: "gh" },
  },
  {
    id: "r32-16",
    roundId: "r32",
    home: { name: "Australia", code: "au" },
    away: { name: "Egypt", code: "eg" },
  },
];

const KNOCKOUT_TREE: BracketMatchDef[] = [
  ...R32_TEAMS,
  { id: "r16-1", roundId: "r16", home: { winnerOf: "r32-1" }, away: { winnerOf: "r32-4" } },
  { id: "r16-2", roundId: "r16", home: { winnerOf: "r32-3" }, away: { winnerOf: "r32-6" } },
  { id: "r16-3", roundId: "r16", home: { winnerOf: "r32-2" }, away: { winnerOf: "r32-5" } },
  { id: "r16-4", roundId: "r16", home: { winnerOf: "r32-7" }, away: { winnerOf: "r32-8" } },
  { id: "r16-5", roundId: "r16", home: { winnerOf: "r32-11" }, away: { winnerOf: "r32-12" } },
  { id: "r16-6", roundId: "r16", home: { winnerOf: "r32-9" }, away: { winnerOf: "r32-10" } },
  { id: "r16-7", roundId: "r16", home: { winnerOf: "r32-14" }, away: { winnerOf: "r32-16" } },
  { id: "r16-8", roundId: "r16", home: { winnerOf: "r32-13" }, away: { winnerOf: "r32-15" } },
  { id: "qf-1", roundId: "qf", home: { winnerOf: "r16-2" }, away: { winnerOf: "r16-1" } },
  { id: "qf-2", roundId: "qf", home: { winnerOf: "r16-5" }, away: { winnerOf: "r16-6" } },
  { id: "qf-3", roundId: "qf", home: { winnerOf: "r16-3" }, away: { winnerOf: "r16-4" } },
  { id: "qf-4", roundId: "qf", home: { winnerOf: "r16-7" }, away: { winnerOf: "r16-8" } },
  { id: "sf-1", roundId: "sf", home: { winnerOf: "qf-1" }, away: { winnerOf: "qf-2" } },
  { id: "sf-2", roundId: "sf", home: { winnerOf: "qf-3" }, away: { winnerOf: "qf-4" } },
  {
    id: "final-1",
    roundId: "final",
    home: { winnerOf: "sf-1" },
    away: { winnerOf: "sf-2" },
  },
];

function isTeamRef(ref: TeamRef): ref is BracketTeam {
  return "code" in ref;
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

function knockoutWinner(match: Match): string | null {
  if (match.status !== "finished") return null;
  const { home, away } = match.score;
  if (home === null || away === null) return null;
  if (home > away) return match.home.code;
  if (away > home) return match.away.code;
  return null;
}

function buildResultIndex(matches: Match[]): Map<string, string> {
  const index = new Map<string, string>();
  for (const match of matches) {
    if (!/round of 32|round of 16|quarter|semi|final|r32|r16|qf|sf/i.test(match.stage)) {
      continue;
    }
    const winner = knockoutWinner(match);
    if (!winner) continue;
    index.set(pairKey(match.home.code, match.away.code), winner);
  }
  return index;
}

function resolveWinnerAsTeam(
  matchId: string,
  winners: Map<string, string>,
  resolved: BracketMatch[]
): BracketTeam | null {
  const winnerCode = winners.get(matchId);
  if (!winnerCode) return null;
  const match = resolved.find((m) => m.id === matchId);
  if (!match) return null;
  if (match.home?.code === winnerCode) return match.home;
  if (match.away?.code === winnerCode) return match.away;
  return null;
}

/** Build the full knockout tree, overlaying winners from finished matches when available. */
export function buildKnockoutBracket(matches: Match[] = []): BracketMatch[] {
  const resultIndex = buildResultIndex(matches);
  const matchWinners = new Map<string, string>();
  const resolved: BracketMatch[] = [];

  for (const def of KNOCKOUT_TREE) {
    const home = isTeamRef(def.home)
      ? def.home
      : resolveWinnerAsTeam(def.home.winnerOf, matchWinners, resolved);
    const away = isTeamRef(def.away)
      ? def.away
      : resolveWinnerAsTeam(def.away.winnerOf, matchWinners, resolved);

    let winnerCode: string | null = null;
    if (home && away) {
      winnerCode = resultIndex.get(pairKey(home.code, away.code)) ?? null;
      if (winnerCode) matchWinners.set(def.id, winnerCode);
    }

    resolved.push({ id: def.id, roundId: def.roundId, home, away, winnerCode });
  }

  return resolved;
}

export function getBracketMatchesForRound(
  roundId: string,
  matches: Match[] = []
): BracketMatch[] {
  return buildKnockoutBracket(matches).filter((m) => m.roundId === roundId);
}

/** @deprecated Use getBracketMatchesForRound — kept for any legacy callers */
export function buildBracketMatches(roundId: string): { id: string; label: string }[] {
  const round = KNOCKOUT_ROUNDS.find((r) => r.id === roundId);
  if (!round) return [];
  return getBracketMatchesForRound(roundId).map((m) => ({
    id: m.id,
    label:
      roundId === "final"
        ? m.home && m.away
          ? `${m.home.name} vs ${m.away.name}`
          : "World Cup Final"
        : m.home && m.away
          ? `${m.home.name} vs ${m.away.name}`
          : `${round.shortName} · TBD`,
  }));
}

export function groupAdvanceLabel(group: Group, position: 1 | 2 | 3): string {
  if (position === 1) return `1st Group ${group.letter}`;
  if (position === 2) return `2nd Group ${group.letter}`;
  return `3rd Group ${group.letter}?`;
}
