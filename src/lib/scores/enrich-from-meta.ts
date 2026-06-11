import type { Match, MatchEvent, MatchSubstitution } from "@/lib/scores/types";
import { getMatchMeta } from "@/lib/match-meta";

function subsFromMeta(
  used: { minute: number; playerIn: string; playerOut: string }[] | undefined
): MatchSubstitution[] {
  return (used ?? []).map((s) => ({
    minute: s.minute,
    playerIn: s.playerIn,
    playerOut: s.playerOut,
  }));
}

function mergeEvents(existing: MatchEvent[] | undefined, extra: MatchEvent[] | undefined): MatchEvent[] | undefined {
  const combined = [...(existing ?? []), ...(extra ?? [])];
  if (combined.length === 0) return undefined;
  return combined.sort((a, b) => a.minute - b.minute || a.type.localeCompare(b.type));
}

export function enrichMatchFromMeta(match: Match): Match {
  const meta = getMatchMeta(match.id);
  if (!meta) return match;

  const homeSubs = match.homeSubs?.length
    ? match.homeSubs
    : subsFromMeta(meta.home.subsUsed);
  const awaySubs = match.awaySubs?.length
    ? match.awaySubs
    : subsFromMeta(meta.away.subsUsed);

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
