import type { Team } from "@/lib/data";
import { GROUPS } from "@/lib/data";
import type { Match } from "@/lib/scores/types";

export type StandingRow = {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  qualifies: boolean;
};

export type GroupStandings = {
  letter: string;
  rows: StandingRow[];
};

export type CompiledGroupStandings = {
  groups: GroupStandings[];
  matchesPlayed: number;
  updatedAt: string;
};

type RowAccumulator = Omit<StandingRow, "position" | "qualifies">;

function extractGroupLetter(stage: string): string | null {
  const match = stage.match(/Group\s+([A-L])/i);
  return match ? match[1].toUpperCase() : null;
}

function isGroupStageMatch(match: Match): boolean {
  return /group\s+[A-L]/i.test(match.stage);
}

function emptyRow(team: Team): RowAccumulator {
  return {
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function applyResult(
  row: RowAccumulator,
  goalsFor: number,
  goalsAgainst: number
): void {
  row.played += 1;
  row.goalsFor += goalsFor;
  row.goalsAgainst += goalsAgainst;
  row.goalDifference = row.goalsFor - row.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    row.won += 1;
    row.points += 3;
  } else if (goalsFor === goalsAgainst) {
    row.drawn += 1;
    row.points += 1;
  } else {
    row.lost += 1;
  }
}

function sortRows(rows: RowAccumulator[]): RowAccumulator[] {
  return [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.name.localeCompare(b.team.name);
  });
}

/** Build group tables from finished World Cup group-stage matches (W=3, D=1, L=0). */
export function compileGroupStandings(matches: Match[]): CompiledGroupStandings {
  const accum = new Map<string, Map<string, RowAccumulator>>();

  for (const group of GROUPS) {
    const teamMap = new Map<string, RowAccumulator>();
    for (const team of group.teams) {
      teamMap.set(team.code, emptyRow(team));
    }
    accum.set(group.letter, teamMap);
  }

  const finishedGroup = matches.filter(
    (m) =>
      m.competition === "world-cup" &&
      m.status === "finished" &&
      isGroupStageMatch(m) &&
      m.score.home !== null &&
      m.score.away !== null
  );

  for (const match of finishedGroup) {
    const groupLetter = extractGroupLetter(match.stage);
    if (!groupLetter) continue;

    const teamMap = accum.get(groupLetter);
    if (!teamMap) continue;

    const homeGoals = match.score.home ?? 0;
    const awayGoals = match.score.away ?? 0;

    const homeRow = teamMap.get(match.home.code);
    const awayRow = teamMap.get(match.away.code);

    if (homeRow) applyResult(homeRow, homeGoals, awayGoals);
    if (awayRow) applyResult(awayRow, awayGoals, homeGoals);
  }

  const groups: GroupStandings[] = GROUPS.map((group) => {
    const teamMap = accum.get(group.letter)!;
    const sorted = sortRows([...teamMap.values()]);

    return {
      letter: group.letter,
      rows: sorted.map((row, index) => ({
        ...row,
        position: index + 1,
        qualifies: index < 2,
      })),
    };
  });

  return {
    groups,
    matchesPlayed: finishedGroup.length,
    updatedAt: new Date().toISOString(),
  };
}
