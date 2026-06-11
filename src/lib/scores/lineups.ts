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

export function attachLineupsToMatches(matches: Match[]): Match[] {
  return matches.map((match) => {
    if (match.homeLineup && match.awayLineup) return match;

    const homeSquad = getSquad(match.home.code);
    const awaySquad = getSquad(match.away.code);

    if (!homeSquad && !awaySquad) return match;

    return {
      ...match,
      homeLineup: match.homeLineup ?? (homeSquad ? squadToLineup(homeSquad) : undefined),
      awayLineup: match.awayLineup ?? (awaySquad ? squadToLineup(awaySquad) : undefined),
    };
  });
}
