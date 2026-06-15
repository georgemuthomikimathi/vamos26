import type { MatchEvent } from "@/lib/scores/types";

const TTL_MS = 15 * 60_000;

const cache = new Map<string, { events: MatchEvent[]; storedAt: number }>();

export function getCachedFixtureEvents(fixtureId: string): MatchEvent[] | null {
  const row = cache.get(fixtureId);
  if (!row) return null;
  if (Date.now() - row.storedAt > TTL_MS) {
    cache.delete(fixtureId);
    return null;
  }
  return row.events;
}

export function setCachedFixtureEvents(fixtureId: string, events: MatchEvent[]): void {
  cache.set(fixtureId, { events, storedAt: Date.now() });
}
