import type { Match, MatchEvent, MatchSubstitution } from "@/lib/scores/types";
import { getMatchMeta } from "@/lib/match-meta";

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

function subKey(sub: MatchSubstitution): string {
  return `${sub.minute}-${sub.extraMinute ?? 0}-${sub.playerIn}-${sub.playerOut}`;
}

function mergeSubs(
  existing: MatchSubstitution[] | undefined,
  extra: MatchSubstitution[] | undefined
): MatchSubstitution[] {
  const seen = new Set<string>();
  const merged: MatchSubstitution[] = [];

  for (const sub of [...(existing ?? []), ...(extra ?? [])]) {
    const key = subKey(sub);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(sub);
  }

  return merged.sort((a, b) => a.minute - b.minute || (a.extraMinute ?? 0) - (b.extraMinute ?? 0));
}

function eventKey(event: MatchEvent): string {
  return `${event.minute}-${event.extraMinute ?? 0}-${event.type}-${event.team}-${event.player}`;
}

function mergeEvents(existing: MatchEvent[] | undefined, extra: MatchEvent[] | undefined): MatchEvent[] | undefined {
  const seen = new Set<string>();
  const combined: MatchEvent[] = [];

  for (const event of [...(existing ?? []), ...(extra ?? [])]) {
    const key = eventKey(event);
    if (seen.has(key)) continue;
    seen.add(key);
    combined.push(event);
  }

  if (combined.length === 0) return undefined;
  return combined.sort((a, b) => a.minute - b.minute || a.type.localeCompare(b.type));
}

export function enrichMatchFromMeta(match: Match): Match {
  const meta = getMatchMeta(match.id);
  if (!meta) return match;

  const homeSubs = mergeSubs(match.homeSubs, subsFromMeta(meta.home.subsUsed));
  const awaySubs = mergeSubs(match.awaySubs, subsFromMeta(meta.away.subsUsed));

  return {
    ...match,
    events: mergeEvents(match.events, meta.events),
    homeSubs: homeSubs.length > 0 ? homeSubs : match.homeSubs,
    awaySubs: awaySubs.length > 0 ? awaySubs : match.awaySubs,
  };
}

export function enrichMatchesFromMeta(matches: Match[]): Match[] {
  return matches.map(enrichMatchFromMeta);
}
