import type { Match } from "@/lib/scores/types";
import { getDisplayEvents } from "@/lib/scores/card-events";
import { NATIONAL_SQUADS } from "@/lib/squads";
import type { StatLeader } from "@/lib/stats";

export type CompiledTournamentStats = {
  matchesPlayed: number;
  topScorers: StatLeader[];
  topAssists: StatLeader[];
  mostCards: StatLeader[];
  updatedAt: string;
};

type PlayerAccumulator = {
  name: string;
  country: string;
  code: string;
  club: string;
  value: number;
};

function findPlayerClub(name: string, teamCode: string): string {
  const squad = NATIONAL_SQUADS[teamCode];
  if (!squad) return "—";

  const normalized = name.trim().toLowerCase();
  const player = [...squad.startingXI, ...squad.bench].find(
    (p) =>
      p.name.toLowerCase() === normalized ||
      p.name.toLowerCase().includes(normalized) ||
      normalized.includes(p.name.split(" ").pop()?.toLowerCase() ?? "")
  );
  return player?.club ?? "—";
}

function playerKey(name: string, code: string): string {
  return `${code}:${name.trim().toLowerCase()}`;
}

function bump(
  map: Map<string, PlayerAccumulator>,
  name: string,
  teamCode: string,
  teamName: string,
  delta: number
): void {
  const key = playerKey(name, teamCode);
  const existing = map.get(key);
  if (existing) {
    existing.value += delta;
    return;
  }
  map.set(key, {
    name: name.trim(),
    country: teamName,
    code: teamCode,
    club: findPlayerClub(name, teamCode),
    value: delta,
  });
}

function toLeaders(
  map: Map<string, PlayerAccumulator>,
  limit = 6,
  minValue = 1
): StatLeader[] {
  return [...map.values()]
    .filter((p) => p.value >= minValue)
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((p, i) => ({
      rank: i + 1,
      name: p.name,
      country: p.country,
      code: p.code,
      club: p.club,
      value: p.value,
    }));
}

function emptyLeaders(): StatLeader[] {
  return [{ rank: 1, name: "—", country: "—", code: "un", club: "—", value: 0 }];
}

/** Aggregate scorers, assists, and cards from all finished World Cup matches. */
export function compileTournamentStats(matches: Match[]): CompiledTournamentStats {
  const finished = matches.filter(
    (m) => m.status === "finished" && m.competition === "world-cup"
  );

  const scorers = new Map<string, PlayerAccumulator>();
  const assists = new Map<string, PlayerAccumulator>();
  const cards = new Map<string, PlayerAccumulator>();

  for (const match of finished) {
    const events = getDisplayEvents(match.events ?? []);

    for (const event of events) {
      const team = event.team === "home" ? match.home : match.away;

      if (event.type === "goal" || event.type === "penalty") {
        bump(scorers, event.player, team.code, team.name, 1);
        if (event.playerSecondary) {
          bump(assists, event.playerSecondary, team.code, team.name, 1);
        }
      }

      if (event.type === "yellow") {
        bump(cards, event.player, team.code, team.name, 1);
      }

      if (event.type === "red") {
        bump(cards, event.player, team.code, team.name, 1);
      }
    }
  }

  const topScorers = toLeaders(scorers);
  const topAssists = toLeaders(assists);
  const mostCards = toLeaders(cards);

  return {
    matchesPlayed: finished.length,
    topScorers: topScorers.length > 0 ? topScorers : emptyLeaders(),
    topAssists: topAssists.length > 0 ? topAssists : emptyLeaders(),
    mostCards: mostCards.length > 0 ? mostCards : emptyLeaders(),
    updatedAt: new Date().toISOString(),
  };
}
