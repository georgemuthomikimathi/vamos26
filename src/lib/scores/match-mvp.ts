import type { Match, MatchEvent } from "@/lib/scores/types";

export type MatchMvp = {
  name: string;
  teamCode: string;
  teamName: string;
  goals: number;
  assists: number;
};

function tally(events: MatchEvent[], match: Match): Map<string, MatchMvp> {
  const map = new Map<string, MatchMvp>();

  for (const event of events) {
    if (event.type !== "goal" && event.type !== "penalty") continue;
    const team = event.team === "home" ? match.home : match.away;
    const key = `${team.code}:${event.player}`;
    const row = map.get(key) ?? {
      name: event.player,
      teamCode: team.code,
      teamName: team.name,
      goals: 0,
      assists: 0,
    };
    row.goals += 1;
    map.set(key, row);

    if (event.playerSecondary) {
      const aKey = `${team.code}:${event.playerSecondary}`;
      const assist = map.get(aKey) ?? {
        name: event.playerSecondary,
        teamCode: team.code,
        teamName: team.name,
        goals: 0,
        assists: 0,
      };
      assist.assists += 1;
      map.set(aKey, assist);
    }
  }

  return map;
}

/** Best performer in a single match from goal events (goals weighted over assists). */
export function pickMatchMvp(match: Match): MatchMvp | null {
  const events = match.events ?? [];
  if (events.length === 0) return null;

  const rows = [...tally(events, match).values()];
  if (rows.length === 0) return null;

  rows.sort((a, b) => b.goals * 10 + b.assists - (a.goals * 10 + a.assists));
  return rows[0] ?? null;
}

/** Most recent finished match with a clear standout scorer. */
export function pickLatestMatchMvp(matches: Match[]): MatchMvp | null {
  const finished = matches
    .filter((m) => m.status === "finished")
    .sort((a, b) => {
      const ta = a.kickoffAt ? new Date(a.kickoffAt).getTime() : 0;
      const tb = b.kickoffAt ? new Date(b.kickoffAt).getTime() : 0;
      return tb - ta;
    });

  for (const match of finished) {
    const mvp = pickMatchMvp(match);
    if (mvp && mvp.goals > 0) return mvp;
  }
  return null;
}
