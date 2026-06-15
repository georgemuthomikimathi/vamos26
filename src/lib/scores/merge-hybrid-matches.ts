import type { Match } from "@/lib/scores/types";

/** Stable key — each pairing occurs at most once per tournament stage path. */
export function fixturePairKey(match: Match): string {
  const [a, b] = [match.home.code, match.away.code].sort();
  return `${a}:${b}`;
}

function isLiveish(match: Match): boolean {
  return match.status === "live" || match.status === "halftime";
}

/**
 * worldcup26.ir is the source of truth for finished & scheduled fixtures.
 * API-Football overlays only live/halftime rows (clock + in-play score).
 */
export function mergeIrWithApiLive(irMatches: Match[], apiMatches: Match[]): Match[] {
  const byKey = new Map<string, Match>();
  for (const m of irMatches) {
    byKey.set(fixturePairKey(m), m);
  }

  for (const m of apiMatches) {
    if (!isLiveish(m)) continue;
    byKey.set(fixturePairKey(m), m);
  }

  const order = { live: 0, halftime: 1, scheduled: 2, finished: 3 };
  return [...byKey.values()].sort((a, b) => {
    const sa = order[a.status];
    const sb = order[b.status];
    if (sa !== sb) return sa - sb;
    if (a.kickoffAt && b.kickoffAt) {
      return new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime();
    }
    return 0;
  });
}
