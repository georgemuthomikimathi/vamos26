import type { Match, MatchEvent, MatchSubstitution } from "@/lib/scores/types";
import { getApiFootballKey } from "@/lib/scores/providers/api-config";

const API_BASE = "https://v3.football.api-sports.io";

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

function parseEvents(raw: RawEvent[], match: Match): {
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
      if (/red/i.test(detail)) {
        events.push({ minute, extraMinute, type: "red", player, team: side, detail });
      } else if (/yellow/i.test(detail)) {
        events.push({ minute, extraMinute, type: "yellow", player, team: side, detail });
      }
    }
  }

  return { events, homeSubs, awaySubs };
}

export async function enrichMatchFromApi(match: Match): Promise<Match> {
  const key = getApiFootballKey();
  if (!key || !match.id.startsWith("af-")) return match;

  const fixtureId = match.id.replace(/^af-/, "");

  try {
    const res = await fetch(`${API_BASE}/fixtures/events?fixture=${fixtureId}`, {
      headers: { "x-apisports-key": key },
      cache: "no-store",
    });
    if (!res.ok) return match;

    const data = (await res.json()) as { response?: RawEvent[] };
    const { events, homeSubs, awaySubs } = parseEvents(data.response ?? [], match);

    return {
      ...match,
      events: events.length > 0 ? events : match.events,
      homeSubs: homeSubs.length > 0 ? homeSubs : match.homeSubs,
      awaySubs: awaySubs.length > 0 ? awaySubs : match.awaySubs,
    };
  } catch {
    return match;
  }
}

export async function enrichMatches(matches: Match[]): Promise<Match[]> {
  const needsEnrichment = matches.filter(
    (m) =>
      m.id.startsWith("af-") &&
      (m.status === "live" ||
        m.status === "halftime" ||
        m.status === "finished" ||
        isKickoffSoon(m))
  );

  if (needsEnrichment.length === 0) return matches;

  const enriched = await Promise.all(needsEnrichment.map(enrichMatchFromApi));
  const map = new Map(enriched.map((m) => [m.id, m]));

  return matches.map((m) => map.get(m.id) ?? m);
}

function isKickoffSoon(match: Match): boolean {
  if (!match.kickoffAt || match.status !== "scheduled") return false;
  const kickoff = new Date(match.kickoffAt).getTime();
  const now = Date.now();
  return kickoff > now - 30 * 60_000 && kickoff < now + 3 * 60 * 60_000;
}
