import type { Match } from "@/lib/scores/types";

const TTL_MS = 90_000;

let snapshot: { matches: Match[]; storedAt: number } | null = null;

/** Short-lived cache so brief API-Football rate limits do not flip the site to worldcup26.ir. */
export function getCachedApiFootballFixtures(): Match[] | null {
  if (!snapshot) return null;
  if (Date.now() - snapshot.storedAt > TTL_MS) {
    snapshot = null;
    return null;
  }
  return snapshot.matches;
}

export function setCachedApiFootballFixtures(matches: Match[]): void {
  if (matches.length === 0) return;
  snapshot = { matches, storedAt: Date.now() };
}

export function clearCachedApiFootballFixtures(): void {
  snapshot = null;
}
