import type { Match } from "@/lib/scores/types";

/** Fresh window — serve without re-fetching. */
const SOFT_TTL_MS = 90_000;
/** Stale window — keep API-Football during rate limits; never flip to worldcup26.ir. */
const STALE_TTL_MS = 15 * 60_000;

let snapshot: { matches: Match[]; storedAt: number } | null = null;

function isLiveish(match: Match): boolean {
  return match.status === "live" || match.status === "halftime";
}

export function cacheHasLiveMatches(matches: Match[]): boolean {
  return matches.some(isLiveish);
}

/** Short-lived cache so brief API-Football rate limits do not flip the site to worldcup26.ir. */
export function getCachedApiFootballFixtures(options?: {
  allowStale?: boolean;
}): Match[] | null {
  if (!snapshot) return null;

  const age = Date.now() - snapshot.storedAt;
  const maxAge = options?.allowStale ? STALE_TTL_MS : SOFT_TTL_MS;

  if (age > maxAge) {
    snapshot = null;
    return null;
  }

  return snapshot.matches;
}

export function getCachedApiFootballAgeMs(): number | null {
  if (!snapshot) return null;
  return Date.now() - snapshot.storedAt;
}

export function setCachedApiFootballFixtures(matches: Match[]): void {
  if (matches.length === 0) return;
  snapshot = { matches, storedAt: Date.now() };
}

export function clearCachedApiFootballFixtures(): void {
  snapshot = null;
}

/** Merge live fixture poll into a cached schedule (keeps finished/upcoming rows). */
export function mergeLiveIntoCached(cached: Match[], live: Match[]): Match[] {
  const byId = new Map(cached.map((m) => [m.id, m]));

  for (const match of live) {
    byId.set(match.id, match);
  }

  const order = { live: 0, halftime: 1, scheduled: 2, finished: 3 };
  return [...byId.values()].sort((a, b) => {
    const sa = order[a.status];
    const sb = order[b.status];
    if (sa !== sb) return sa - sb;
    if (a.kickoffAt && b.kickoffAt) {
      return new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime();
    }
    return 0;
  });
}
