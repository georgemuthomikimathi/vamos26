import type { Match } from "@/lib/scores/types";
import { getDisplayEvents } from "@/lib/scores/card-events";
import { enrichMatchFromMeta } from "@/lib/scores/enrich-from-meta";
import { NATIONAL_SQUADS } from "@/lib/squads";
import type { StatLeader } from "@/lib/stats";

export type TournamentStatsSummary = {
  totalGoals: number;
  totalAssists: number;
  totalYellow: number;
  totalRed: number;
  totalPenalties: number;
  totalSubstitutions: number;
  finishedMatches: number;
  liveMatches: number;
};

export type CompiledTournamentStats = {
  matchesPlayed: number;
  topScorers: StatLeader[];
  topAssists: StatLeader[];
  mostYellowCards: StatLeader[];
  mostRedCards: StatLeader[];
  topPenalties: StatLeader[];
  mostSubstitutions: StatLeader[];
  summary: TournamentStatsSummary;
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
  if (!name || name === "—" || name === "Unknown") return;
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
  limit = 8,
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

function isStatMatch(match: Match): boolean {
  return (
    match.competition === "world-cup" &&
    (match.status === "finished" ||
      match.status === "live" ||
      match.status === "halftime")
  );
}

/** Aggregate scorers, assists, cards, pens & subs from API-enriched matches. */
export function compileTournamentStats(matches: Match[]): CompiledTournamentStats {
  const statMatches = matches.filter(isStatMatch).map(enrichMatchFromMeta);
  const finished = statMatches.filter((m) => m.status === "finished");
  const live = statMatches.filter(
    (m) => m.status === "live" || m.status === "halftime"
  );

  const scorers = new Map<string, PlayerAccumulator>();
  const assists = new Map<string, PlayerAccumulator>();
  const yellowCards = new Map<string, PlayerAccumulator>();
  const redCards = new Map<string, PlayerAccumulator>();
  const penalties = new Map<string, PlayerAccumulator>();
  const subsUsed = new Map<string, PlayerAccumulator>();

  let totalGoals = 0;
  let totalAssists = 0;
  let totalYellow = 0;
  let totalRed = 0;
  let totalPenalties = 0;
  let totalSubstitutions = 0;

  for (const match of statMatches) {
    const events = getDisplayEvents(match.events ?? []);

    for (const event of events) {
      const team = event.team === "home" ? match.home : match.away;

      if (event.type === "goal" || event.type === "penalty") {
        bump(scorers, event.player, team.code, team.name, 1);
        totalGoals += 1;
        if (event.type === "penalty") {
          bump(penalties, event.player, team.code, team.name, 1);
          totalPenalties += 1;
        }
        if (event.playerSecondary) {
          bump(assists, event.playerSecondary, team.code, team.name, 1);
          totalAssists += 1;
        }
      }

      if (event.type === "yellow") {
        bump(yellowCards, event.player, team.code, team.name, 1);
        totalYellow += 1;
      }

      if (event.type === "red") {
        bump(redCards, event.player, team.code, team.name, 1);
        totalRed += 1;
      }
    }

    for (const sub of match.homeSubs ?? []) {
      bump(subsUsed, sub.playerIn, match.home.code, match.home.name, 1);
      totalSubstitutions += 1;
    }
    for (const sub of match.awaySubs ?? []) {
      bump(subsUsed, sub.playerIn, match.away.code, match.away.name, 1);
      totalSubstitutions += 1;
    }
  }

  const topScorers = toLeaders(scorers);
  const topAssists = toLeaders(assists);
  const mostYellowCards = toLeaders(yellowCards);
  const mostRedCards = toLeaders(redCards);
  const topPenalties = toLeaders(penalties);
  const mostSubstitutions = toLeaders(subsUsed);

  return {
    matchesPlayed: finished.length,
    topScorers: topScorers.length > 0 ? topScorers : emptyLeaders(),
    topAssists: topAssists.length > 0 ? topAssists : emptyLeaders(),
    mostYellowCards: mostYellowCards.length > 0 ? mostYellowCards : emptyLeaders(),
    mostRedCards: mostRedCards.length > 0 ? mostRedCards : emptyLeaders(),
    topPenalties: topPenalties.length > 0 ? topPenalties : emptyLeaders(),
    mostSubstitutions: mostSubstitutions.length > 0 ? mostSubstitutions : emptyLeaders(),
    summary: {
      totalGoals,
      totalAssists,
      totalYellow,
      totalRed,
      totalPenalties,
      totalSubstitutions,
      finishedMatches: finished.length,
      liveMatches: live.length,
    },
    updatedAt: new Date().toISOString(),
  };
}
