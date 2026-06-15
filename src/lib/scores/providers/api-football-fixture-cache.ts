import type { Match } from "@/lib/scores/types";

const SOFT_TTL_IDLE_MS = 5 * 60_000;
const SOFT_TTL_LIVE_MS = 2 * 60_000;
const STALE_TTL_MS = 24 * 60 * 60_000;

let snapshot: { matches: Match[]; storedAt: number } | null = null;
let seasonSnapshot: { matches: Match[]; storedAt: number } | null = null;

const SEASON_TTL_MS = 24 * 60 * 60_000;

function isLiveish(match: Match): boolean {
  return match.status === "live" || match.status === "halftime";
}

export function cacheHasLiveMatches(matches: Match[]): boolean {
  return matches.some(isLiveish);
}

export function getFixtureCacheSoftTtlMs(matches?: Match[] | null): number {
  if (matches && cacheHasLiveMatches(matches)) return SOFT_TTL_LIVE_MS;
  return SOFT_TTL_IDLE_MS;
}

export function getCachedApiFootballFixtures(options?: {
  allowStale?: boolean;
}): Match[] | null {
  if (!snapshot) return null;

  const age = Date.now() - snapshot.storedAt;
  const softTtl = getFixtureCacheSoftTtlMs(snapshot.matches);
  const maxAge = options?.allowStale ? STALE_TTL_MS : softTtl;

  if (age > maxAge) {
    if (options?.allowStale) return null;
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

export function getCachedSeasonFixtures(): Match[] | null {
  if (!seasonSnapshot) return null;
  if (Date.now() - seasonSnapshot.storedAt > SEASON_TTL_MS) {
    seasonSnapshot = null;
    return null;
  }
  return seasonSnapshot.matches;
}

export function setCachedSeasonFixtures(matches: Match[]): void {
  if (matches.length === 0) return;
  seasonSnapshot = { matches, storedAt: Date.now() };
}

export function findCachedMatch(id: string): Match | undefined {
  return (
    snapshot?.matches.find((m) => m.id === id) ??
    seasonSnapshot?.matches.find((m) => m.id === id)
  );
}
