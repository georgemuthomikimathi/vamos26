import type { Match, MatchLineup } from "@/lib/scores/types";
import { isSquadRevealWindow } from "@/lib/realtime/polling";
import { getSquad, type NationalSquad } from "@/lib/squads";

function squadToLineup(squad: NationalSquad): MatchLineup {
  return {
    formation: squad.formation,
    coach: squad.coach,
    startingXI: squad.startingXI.map((p) => ({
      name: p.name,
      number: p.number,
      position: p.role,
    })),
    bench: squad.bench.map((p) => ({
      name: p.name,
      number: p.number,
      position: p.role,
    })),
  };
}

/** Full squads publish 30 minutes before kickoff (or once live/finished). */
export function shouldRevealSquads(match: Match, now = Date.now()): boolean {
  if (match.status === "live" || match.status === "halftime" || match.status === "finished") {
    return true;
  }
  return isSquadRevealWindow(match.kickoffAt, now);
}

export function attachLineupsToMatch(match: Match, now = Date.now()): Match {
  if (!shouldRevealSquads(match, now)) return match;

  const homeSquad = getSquad(match.home.code);
  const awaySquad = getSquad(match.away.code);

  return {
    ...match,
    homeLineup:
      match.homeLineup ?? (homeSquad ? squadToLineup(homeSquad) : undefined),
    awayLineup:
      match.awayLineup ?? (awaySquad ? squadToLineup(awaySquad) : undefined),
  };
}

export function attachLineupsToMatches(matches: Match[], now = Date.now()): Match[] {
  return matches.map((m) => attachLineupsToMatch(m, now));
}
