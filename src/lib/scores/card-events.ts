import type { MatchEvent } from "@/lib/scores/types";

export const TWO_YELLOWS_NOTE = "N:B Two yellow cards = red";

function playerKey(event: MatchEvent): string {
  return `${event.team}:${event.player.trim().toLowerCase()}`;
}

/**
 * Converts a player's second yellow into a red card for display.
 * First yellow stays yellow; subsequent yellows for the same player render as red (second yellow).
 */
export function consolidateCardEvents(events: MatchEvent[]): MatchEvent[] {
  const yellowCount = new Map<string, number>();
  const sentOff = new Set<string>();

  return events.map((event) => {
    if (event.type === "red") {
      sentOff.add(playerKey(event));
      return event;
    }

    if (event.type !== "yellow") return event;

    const key = playerKey(event);
    if (sentOff.has(key)) return event;

    const count = (yellowCount.get(key) ?? 0) + 1;
    yellowCount.set(key, count);

    if (count >= 2) {
      sentOff.add(key);
      return {
        ...event,
        type: "red" as const,
        detail: "Second yellow",
      };
    }

    return event;
  });
}

export function getDisplayEvents(events: MatchEvent[] | undefined): MatchEvent[] {
  if (!events?.length) return [];
  return consolidateCardEvents(events);
}

export function hasCardEvents(events: MatchEvent[] | undefined): boolean {
  return (events ?? []).some((e) => e.type === "yellow" || e.type === "red");
}
