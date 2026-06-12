import type { Match, MatchLineup, LineupPlayer } from "@/lib/scores/types";
import {
  apiFootballFetch,
  fixtureIdFromMatchId,
} from "@/lib/scores/providers/api-football-fetch";

type RawLineupPlayer = {
  player: {
    id: number;
    name: string;
    number: number;
    pos: string | null;
    grid: string | null;
  };
};

type RawLineup = {
  team: { name: string };
  formation: string | null;
  coach?: { name?: string } | null;
  startXI: RawLineupPlayer[];
  substitutes: RawLineupPlayer[];
};

function mapPosition(pos: string | null): string {
  const normalized = (pos ?? "").trim().toUpperCase();
  if (normalized === "G" || normalized === "GK") return "GK";
  if (normalized === "D" || normalized === "DEF") return "CB";
  if (normalized === "M" || normalized === "MID") return "CM";
  if (normalized === "F" || normalized === "FWD" || normalized === "FW") return "FWD";
  if (/goalkeeper/i.test(pos ?? "")) return "GK";
  if (/defender/i.test(pos ?? "")) return "CB";
  if (/midfield/i.test(pos ?? "")) return "CM";
  if (/attacker|forward|striker/i.test(pos ?? "")) return "FWD";
  return pos?.trim() || "MID";
}

function mapPlayer(raw: RawLineupPlayer): LineupPlayer {
  return {
    name: raw.player.name,
    number: raw.player.number,
    position: mapPosition(raw.player.pos),
  };
}

function parseLineup(raw: RawLineup): MatchLineup {
  return {
    formation: raw.formation ?? undefined,
    coach: raw.coach?.name ?? undefined,
    startingXI: raw.startXI.map(mapPlayer),
    bench: raw.substitutes.length > 0 ? raw.substitutes.map(mapPlayer) : undefined,
  };
}

function teamSide(match: Match, teamName: string): "home" | "away" | null {
  if (teamName === match.home.name) return "home";
  if (teamName === match.away.name) return "away";
  const homePrefix = match.home.name.toLowerCase().slice(0, 4);
  const awayPrefix = match.away.name.toLowerCase().slice(0, 4);
  const lower = teamName.toLowerCase();
  if (homePrefix.length >= 3 && lower.includes(homePrefix)) return "home";
  if (awayPrefix.length >= 3 && lower.includes(awayPrefix)) return "away";
  return null;
}

export async function fetchFixtureLineups(
  match: Match
): Promise<{ homeLineup?: MatchLineup; awayLineup?: MatchLineup }> {
  const fixtureId = fixtureIdFromMatchId(match.id);
  if (!fixtureId) return {};

  const revalidate =
    match.status === "live" || match.status === "halftime" ? undefined : 120;

  const { data } = await apiFootballFetch<RawLineup[]>(
    `/fixtures/lineups?fixture=${fixtureId}`,
    revalidate != null ? { revalidate } : {}
  );

  if (!data?.length) return {};

  let homeLineup: MatchLineup | undefined;
  let awayLineup: MatchLineup | undefined;

  for (const row of data) {
    const side = teamSide(match, row.team.name);
    const lineup = parseLineup(row);
    if (side === "home") homeLineup = lineup;
    if (side === "away") awayLineup = lineup;
  }

  return { homeLineup, awayLineup };
}
