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

function eventSortKey(a: MatchEvent, b: MatchEvent): number {
  const minuteDiff = a.minute - b.minute;
  if (minuteDiff !== 0) return minuteDiff;
  const extraDiff = (a.extraMinute ?? 0) - (b.extraMinute ?? 0);
  if (extraDiff !== 0) return extraDiff;
  return a.type.localeCompare(b.type);
}

function mergeEvents(
  primary: MatchEvent[] | undefined,
  supplemental: MatchEvent[] | undefined
): MatchEvent[] | undefined {
  const seen = new Set<string>();
  const combined: MatchEvent[] = [];

  for (const event of [...(primary ?? []), ...(supplemental ?? [])]) {
    const key = eventKey(event);
    if (seen.has(key)) continue;
    seen.add(key);
    combined.push(event);
  }

  if (combined.length === 0) return undefined;
  return combined.sort(eventSortKey);
}

export function enrichMatchFromMeta(match: Match): Match {
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
