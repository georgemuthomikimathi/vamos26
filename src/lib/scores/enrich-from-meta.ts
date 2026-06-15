import type { Match, MatchEvent, MatchSubstitution } from "@/lib/scores/types";
import { getMatchMetaForMatch } from "@/lib/match-meta";

function subsFromMeta(
  used:
    | { minute: number; extraMinute?: number; playerIn: string; playerOut: string }[]
    | undefined
): MatchSubstitution[] {
  return (used ?? []).map((s) => ({
    minute: s.minute,
    extraMinute: s.extraMinute,
    playerIn: s.playerIn,
    playerOut: s.playerOut,
  }));
}

function eventKey(event: MatchEvent): string {
  return `${event.minute}-${event.extraMinute ?? 0}-${event.type}-${event.team}-${event.player}`;
}

function mergeEvents(
  apiEvents: MatchEvent[] | undefined,
  metaEvents: MatchEvent[] | undefined
): MatchEvent[] | undefined {
  const seen = new Set<string>();
  const combined: MatchEvent[] = [];

  for (const event of [...(apiEvents ?? []), ...(metaEvents ?? [])]) {
    const key = eventKey(event);
    if (seen.has(key)) continue;
    seen.add(key);
    combined.push(event);
  }

  if (combined.length === 0) return undefined;
  return combined.sort((a, b) => a.minute - b.minute || a.type.localeCompare(b.type));
}

export function enrichMatchFromMeta(match: Match): Match {
  // API-Football fixtures are authoritative — do not blend static preview meta.
  if (match.id.startsWith("af-")) return match;

  const meta = getMatchMetaForMatch(match);
  if (!meta) return match;

  const homeSubs =
    match.homeSubs?.length
      ? match.homeSubs
      : subsFromMeta(meta.home.subsUsed).length > 0
        ? subsFromMeta(meta.home.subsUsed)
        : match.homeSubs;

  const awaySubs =
    match.awaySubs?.length
      ? match.awaySubs
      : subsFromMeta(meta.away.subsUsed).length > 0
        ? subsFromMeta(meta.away.subsUsed)
        : match.awaySubs;

  return {
    ...match,
    events: mergeEvents(match.events, meta.events),
    homeSubs,
    awaySubs,
  };
}

export function enrichMatchesFromMeta(matches: Match[]): Match[] {
  return matches.map(enrichMatchFromMeta);
}
