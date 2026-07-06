import type { Match } from "@/lib/scores/types";
import { getDisplayEvents } from "@/lib/scores/card-events";
import { enrichMatchFromMeta } from "@/lib/scores/enrich-from-meta";
import { NATIONAL_SQUADS } from "@/lib/squads";
import type { StatLeader } from "@/lib/stats";
import { playerSlugFromName } from "@/lib/playerImages";

export const STATS_LEADER_LIMIT = 20;

export type TournamentStatsSummary = {
  totalGoals: number;
  totalAssists: number;
  totalYellow: number;
  totalRed: number;
  totalPenalties: number;
  totalSubstitutions: number;
  totalCleanSheets: number;
  finishedMatches: number;
  liveMatches: number;
};

export type MatchStatHighlight = {
  matchId: string;
  label: string;
  stage: string;
  date: string;
  scorers: { name: string; goals: number; teamCode: string; teamName: string }[];
  cards: { yellow: number; red: number };
};

export type CompiledTournamentStats = {
  matchesPlayed: number;
  topScorers: StatLeader[];
  topAssists: StatLeader[];
  mostYellowCards: StatLeader[];
  mostRedCards: StatLeader[];
  topPenalties: StatLeader[];
  mostSubstitutions: StatLeader[];
  cleanSheets: StatLeader[];
  summary: TournamentStatsSummary;
  matchHighlights: MatchStatHighlight[];
  updatedAt: string;
};

type PlayerAccumulator = {
  name: string;
  country: string;
  code: string;
  club: string;
  value: number;
  detail?: string;
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
  delta: number,
  detail?: string
): void {
  if (!name || name === "—" || name === "Unknown") return;
  const key = playerKey(name, teamCode);
  const existing = map.get(key);
  if (existing) {
    existing.value += delta;
    if (detail && !existing.detail) existing.detail = detail;
    return;
  }
  map.set(key, {
    name: name.trim(),
    country: teamName,
    code: teamCode,
    club: findPlayerClub(name, teamCode),
    value: delta,
    detail,
  });
}

function toLeaders(
  map: Map<string, PlayerAccumulator>,
  limit = STATS_LEADER_LIMIT,
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
      detail: p.detail,
      imageSlug: playerSlugFromName(p.name),
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

function startingKeeper(match: Match, side: "home" | "away"): string | null {
  const lineup = side === "home" ? match.homeLineup : match.awayLineup;
  const gk = lineup?.startingXI.find((p) => p.position === "GK");
  if (gk) return gk.name;

  const squad = NATIONAL_SQUADS[side === "home" ? match.home.code : match.away.code];
  const squadGk = squad?.startingXI.find((p) => p.role === "GK");
  return squadGk?.name ?? null;
}

function formatScoreLabel(match: Match): string {
  const h = match.score.home ?? 0;
  const a = match.score.away ?? 0;
  return `${match.home.name} ${h}–${a} ${match.away.name}`;
}

/** Aggregate leaders from finished/live matches — tallied after each full-time result. */
export function compileTournamentStats(matches: Match[]): CompiledTournamentStats {
  const statMatches = matches.filter(isStatMatch).map(enrichMatchFromMeta);
  const finished = statMatches
    .filter((m) => m.status === "finished")
    .sort((a, b) => {
      if (a.kickoffAt && b.kickoffAt) {
        return new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime();
      }
      return 0;
    });
  const live = statMatches.filter(
    (m) => m.status === "live" || m.status === "halftime"
  );

  const scorers = new Map<string, PlayerAccumulator>();
  const assists = new Map<string, PlayerAccumulator>();
  const yellowCards = new Map<string, PlayerAccumulator>();
  const redCards = new Map<string, PlayerAccumulator>();
  const penalties = new Map<string, PlayerAccumulator>();
  const subsUsed = new Map<string, PlayerAccumulator>();
  const cleanSheets = new Map<string, PlayerAccumulator>();

  let totalGoals = 0;
  let totalAssists = 0;
  let totalYellow = 0;
  let totalRed = 0;
  let totalPenalties = 0;
  let totalSubstitutions = 0;
  let totalCleanSheets = 0;

  const matchHighlights: MatchStatHighlight[] = [];

  for (const match of statMatches) {
    const events = getDisplayEvents(match.events ?? []);
    const matchScorerMap = new Map<string, { name: string; goals: number; teamCode: string; teamName: string }>();

    for (const event of events) {
      const team = event.team === "home" ? match.home : match.away;

      if (event.type === "goal" || event.type === "penalty") {
        bump(scorers, event.player, team.code, team.name, 1);
        totalGoals += 1;
        const sk = playerKey(event.player, team.code);
        const existing = matchScorerMap.get(sk);
        if (existing) {
          existing.goals += 1;
        } else {
          matchScorerMap.set(sk, {
            name: event.player,
            goals: 1,
            teamCode: team.code,
            teamName: team.name,
          });
        }
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

    if (match.status === "finished") {
      const homeGoals = match.score.home ?? 0;
      const awayGoals = match.score.away ?? 0;

      if (awayGoals === 0) {
        const gk = startingKeeper(match, "home");
        if (gk) {
          bump(cleanSheets, gk, match.home.code, match.home.name, 1, "GK");
          totalCleanSheets += 1;
        }
      }
      if (homeGoals === 0) {
        const gk = startingKeeper(match, "away");
        if (gk) {
          bump(cleanSheets, gk, match.away.code, match.away.name, 1, "GK");
          totalCleanSheets += 1;
        }
      }

      const yellowCount = events.filter((e) => e.type === "yellow").length;
      const redCount = events.filter((e) => e.type === "red").length;

      matchHighlights.push({
        matchId: match.id,
        label: formatScoreLabel(match),
        stage: match.stage,
        date: match.date,
        scorers: [...matchScorerMap.values()].sort((a, b) => b.goals - a.goals),
        cards: { yellow: yellowCount, red: redCount },
      });
    }
  }

  const topScorers = toLeaders(scorers);
  const topAssists = toLeaders(assists);
  const mostYellowCards = toLeaders(yellowCards);
  const mostRedCards = toLeaders(redCards);
  const topPenalties = toLeaders(penalties);
  const mostSubstitutions = toLeaders(subsUsed);
  const cleanSheetLeaders = toLeaders(cleanSheets);

  return {
    matchesPlayed: finished.length,
    topScorers: topScorers.length > 0 ? topScorers : emptyLeaders(),
    topAssists: topAssists.length > 0 ? topAssists : emptyLeaders(),
    mostYellowCards: mostYellowCards.length > 0 ? mostYellowCards : emptyLeaders(),
    mostRedCards: mostRedCards.length > 0 ? mostRedCards : emptyLeaders(),
    topPenalties: topPenalties.length > 0 ? topPenalties : emptyLeaders(),
    mostSubstitutions: mostSubstitutions.length > 0 ? mostSubstitutions : emptyLeaders(),
    cleanSheets: cleanSheetLeaders.length > 0 ? cleanSheetLeaders : emptyLeaders(),
    matchHighlights: matchHighlights.slice(0, STATS_LEADER_LIMIT),
    summary: {
      totalGoals,
      totalAssists,
      totalYellow,
      totalRed,
      totalPenalties,
      totalSubstitutions,
      totalCleanSheets,
      finishedMatches: finished.length,
      liveMatches: live.length,
    },
    updatedAt: new Date().toISOString(),
  };
}
