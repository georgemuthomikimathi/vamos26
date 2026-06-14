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

function normalizeTeamName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function teamSide(match: Match, teamName: string): "home" | "away" {
  const raw = teamName ?? "";
  if (raw === match.home.name) return "home";
  if (raw === match.away.name) return "away";

  const norm = normalizeTeamName(raw);
  const homeNorm = normalizeTeamName(match.home.name);
  const awayNorm = normalizeTeamName(match.away.name);
  if (norm === homeNorm || norm.includes(homeNorm.slice(0, 4))) return "home";
  if (norm === awayNorm || norm.includes(awayNorm.slice(0, 4))) return "away";

  if (raw.toLowerCase().includes(match.home.name.toLowerCase().slice(0, 4))) {
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
    const type = (e.type ?? "").trim();
    const detail = e.detail ?? "";
    const typeLower = type.toLowerCase();

    if (typeLower === "subst") {
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

    if (typeLower === "goal") {
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

    if (typeLower === "card") {
      events.push(parseCardEvent(minute, extraMinute, player, side, detail));
    }
  }

  return { events, homeSubs, awaySubs };
}

function isRetryableFetchError(error?: string): boolean {
  if (!error) return true;
  return /http_429|rate limit|too many requests|fetch_failed/i.test(error);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchFixtureEventsRaw(fixtureId: string, live: boolean): Promise<RawEvent[]> {
  const attempts = live ? 2 : 4;
  const baseDelayMs = 400;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const useCache = !live && attempt === 0;
    const { data, error } = await apiFootballFetch<RawEvent[]>(
      `/fixtures/events?fixture=${fixtureId}`,
      useCache ? { revalidate: 120 } : {}
    );

    if (data?.length) return data;

    if (attempt < attempts - 1 && isRetryableFetchError(error)) {
      await sleep(baseDelayMs * (attempt + 1));
      continue;
    }

    return data ?? [];
  }

  return [];
}

export async function enrichMatchEventsFromApi(match: Match): Promise<Match> {
  const fixtureId = fixtureIdFromMatchId(match.id);
  if (!fixtureId) return match;

  const live = match.status === "live" || match.status === "halftime";
  const totalGoals = (match.score.home ?? 0) + (match.score.away ?? 0);

  let rawEvents = await fetchFixtureEventsRaw(fixtureId, live);

  if (
    !rawEvents.length &&
    !live &&
    match.status === "finished" &&
    totalGoals > 0
  ) {
    await sleep(600);
    rawEvents = await fetchFixtureEventsRaw(fixtureId, true);
  }

  const { events, homeSubs, awaySubs } = parseApiFootballEvents(rawEvents, match);

  return {
    ...match,
    events: events.length > 0 ? events : match.events,
    homeSubs: homeSubs.length > 0 ? homeSubs : match.homeSubs,
    awaySubs: awaySubs.length > 0 ? awaySubs : match.awaySubs,
  };
}

export async function enrichMatchFromApi(match: Match): Promise<Match> {
  const withEvents = await enrichMatchEventsFromApi(match);
  const lineups = await fetchFixtureLineups(withEvents);

  return {
    ...withEvents,
    homeLineup: lineups.homeLineup ?? withEvents.homeLineup,
    awayLineup: lineups.awayLineup ?? withEvents.awayLineup,
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

async function enrichMatchBatch(
  batch: Match[],
  concurrency: number,
  enrichFn: (match: Match) => Promise<Match>
): Promise<Map<string, Match>> {
  if (batch.length === 0) return new Map();
  const enriched = await mapWithConcurrency(batch, concurrency, enrichFn);
  return new Map(enriched.map((m) => [m.id, m]));
}

function applyEnrichment(matches: Match[], map: Map<string, Match>): Match[] {
  return matches.map((m) => map.get(m.id) ?? m);
}

function finishedWithMissingEvents(match: Match): boolean {
  if (match.status !== "finished" || !match.id.startsWith("af-")) return false;
  const goals = (match.score.home ?? 0) + (match.score.away ?? 0);
  if (goals === 0) return false;
  return !(match.events?.length);
}

export type EnrichMatchesOptions = {
  /** Skip lineup API calls during bulk enrichment (lineups load on match-details). */
  skipLineups?: boolean;
};

export async function enrichMatches(
  matches: Match[],
  options: EnrichMatchesOptions = {}
): Promise<Match[]> {
  const enrichFn = options.skipLineups ? enrichMatchEventsFromApi : enrichMatchFromApi;
  const needsEnrichment = matches.filter(shouldEnrichMatch);
  if (needsEnrichment.length === 0) return matches;

  let map = await enrichMatchBatch(needsEnrichment, 4, enrichFn);
  let result = applyEnrichment(matches, map);

  const missingEvents = result.filter(finishedWithMissingEvents);
  if (missingEvents.length > 0) {
    await sleep(900);
    const retryMap = await enrichMatchBatch(missingEvents, 2, enrichFn);
    result = applyEnrichment(result, retryMap);
  }

  return result;
}

function isKickoffSoon(match: Match): boolean {
  if (!match.kickoffAt || match.status !== "scheduled") return false;
  const kickoff = new Date(match.kickoffAt).getTime();
  const now = Date.now();
  return kickoff > now - 30 * 60_000 && kickoff < now + 6 * 60 * 60_000;
}
