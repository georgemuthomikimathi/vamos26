import type { Match, MatchLineup } from "@/lib/scores/types";
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

function hasApiLineup(match: Match): boolean {
  return match.id.startsWith("af-") && Boolean(match.homeLineup || match.awayLineup);
}

export function attachLineupsToMatch(match: Match): Match {
  if (match.homeLineup && match.awayLineup) return match;

  if (hasApiLineup(match)) {
    return {
      ...match,
      homeLineup: match.homeLineup,
      awayLineup: match.awayLineup,
    };
  }

  const homeSquad = getSquad(match.home.code);
  const awaySquad = getSquad(match.away.code);

  if (!homeSquad && !awaySquad) return match;

  return {
    ...match,
    homeLineup: match.homeLineup ?? (homeSquad ? squadToLineup(homeSquad) : undefined),
    awayLineup: match.awayLineup ?? (awaySquad ? squadToLineup(awaySquad) : undefined),
  };
}

export function attachLineupsToMatches(matches: Match[]): Match[] {
  return matches.map(attachLineupsToMatch);
}
