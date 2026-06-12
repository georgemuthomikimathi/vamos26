import type { Match, MatchEvent, MatchSubstitution } from "@/lib/scores/types";
import {
  apiFootballFetch,
  fixtureIdFromMatchId,
  mapWithConcurrency,
} from "@/lib/scores/providers/api-football-fetch";
import { fetchFixtureLineups } from "@/lib/scores/providers/api-football-lineups";

type RawEvent = {
  time: { elapsed: number | null; extra?: number | null };
  team: { name: string };
  player: { name: string };
  assist?: { name: string } | null;
  type: string;
  detail: string;
};

function teamSide(match: Match, teamName: string): "home" | "away" {
  if (teamName === match.home.name) return "home";
  if (teamName === match.away.name) return "away";
  if (teamName.toLowerCase().includes(match.home.name.toLowerCase().slice(0, 4))) {
    return "home";
  }
  return "away";
}

function isSecondYellow(detail: string): boolean {
  return /second\s+yellow/i.test(detail);
}

function parseCardEvent(
  minute: number,
  extraMinute: number | undefined,
  player: string,
  side: "home" | "away",
  detail: string
): MatchEvent {
  if (/red/i.test(detail) || isSecondYellow(detail)) {
    return {
      minute,
      extraMinute,
      type: "red",
      player,
      team: side,
      detail: isSecondYellow(detail) ? "Second yellow" : detail,
    };
  }

  return {
    minute,
    extraMinute,
    type: "yellow",
    player,
    team: side,
    detail,
  };
}

export function parseApiFootballEvents(
  raw: RawEvent[],
  match: Match
): {
  events: MatchEvent[];
  homeSubs: MatchSubstitution[];
  awaySubs: MatchSubstitution[];
} {
  const events: MatchEvent[] = [];
  const homeSubs: MatchSubstitution[] = [];
  const awaySubs: MatchSubstitution[] = [];

  for (const e of raw) {
    const minute = e.time.elapsed ?? 0;
    const extraMinute = e.time.extra ?? undefined;
    const player = e.player?.name ?? "Unknown";
    const secondary = e.assist?.name;
    const side = teamSide(match, e.team?.name ?? "");
    const type = e.type ?? "";
    const detail = e.detail ?? "";

    if (type === "subst") {
      const sub: MatchSubstitution = {
        minute,
        extraMinute,
        playerIn: player,
        playerOut: secondary ?? "—",
      };
      if (side === "home") homeSubs.push(sub);
      else awaySubs.push(sub);
      events.push({
        minute,
        extraMinute,
        type: "subst",
        player,
        playerSecondary: secondary,
        team: side,
        detail,
      });
      continue;
    }

    if (type === "Goal") {
      const isPenalty = /penalty/i.test(detail);
      const isMissed = /missed/i.test(detail);
      events.push({
        minute,
        extraMinute,
        type: isMissed ? "penalty_missed" : isPenalty ? "penalty" : "goal",
        player,
        playerSecondary: secondary,
        team: side,
        detail,
      });
      continue;
    }

    if (type === "Card") {
      events.push(parseCardEvent(minute, extraMinute, player, side, detail));
    }
  }

  return { events, homeSubs, awaySubs };
}

async function fetchFixtureEventsRaw(fixtureId: string, live: boolean): Promise<RawEvent[]> {
  const { data } = await apiFootballFetch<RawEvent[]>(
    `/fixtures/events?fixture=${fixtureId}`,
    live ? {} : { revalidate: 60 }
  );
  return data ?? [];
}

export async function enrichMatchFromApi(match: Match): Promise<Match> {
  const fixtureId = fixtureIdFromMatchId(match.id);
  if (!fixtureId) return match;

  const live = match.status === "live" || match.status === "halftime";

  const [rawEvents, lineups] = await Promise.all([
    fetchFixtureEventsRaw(fixtureId, live),
    fetchFixtureLineups(match),
  ]);

  const { events, homeSubs, awaySubs } = parseApiFootballEvents(rawEvents, match);

  return {
    ...match,
    events: events.length > 0 ? events : match.events,
    homeSubs: homeSubs.length > 0 ? homeSubs : match.homeSubs,
    awaySubs: awaySubs.length > 0 ? awaySubs : match.awaySubs,
    homeLineup: lineups.homeLineup ?? match.homeLineup,
    awayLineup: lineups.awayLineup ?? match.awayLineup,
  };
}

function shouldEnrichMatch(match: Match): boolean {
  if (!match.id.startsWith("af-")) return false;
  if (
    match.status === "live" ||
    match.status === "halftime" ||
    match.status === "finished"
  ) {
    return true;
  }
  return isKickoffSoon(match);
}

export async function enrichMatches(matches: Match[]): Promise<Match[]> {
  const needsEnrichment = matches.filter(shouldEnrichMatch);

  if (needsEnrichment.length === 0) return matches;

  const enriched = await mapWithConcurrency(needsEnrichment, 8, enrichMatchFromApi);
  const map = new Map(enriched.map((m) => [m.id, m]));

  return matches.map((m) => map.get(m.id) ?? m);
}

function isKickoffSoon(match: Match): boolean {
  if (!match.kickoffAt || match.status !== "scheduled") return false;
  const kickoff = new Date(match.kickoffAt).getTime();
  const now = Date.now();
  return kickoff > now - 30 * 60_000 && kickoff < now + 6 * 60 * 60_000;
}
