import { GROUPS, type Group } from "./data";

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

export function buildBracketMatches(roundId: string): { id: string; label: string }[] {
  const round = KNOCKOUT_ROUNDS.find((r) => r.id === roundId);
  if (!round) return [];
  return Array.from({ length: round.matches }, (_, i) => ({
    id: `${roundId}-${i + 1}`,
    label:
      roundId === "final"
        ? "World Cup Final"
        : `${round.shortName} · Match ${i + 1}`,
  }));
}

export function groupAdvanceLabel(group: Group, position: 1 | 2 | 3): string {
  if (position === 1) return `1st Group ${group.letter}`;
  if (position === 2) return `2nd Group ${group.letter}`;
  return `3rd Group ${group.letter}?`;
}
