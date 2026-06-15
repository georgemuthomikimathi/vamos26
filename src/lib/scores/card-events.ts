import type { MatchEvent } from "@/lib/scores/types";

export const TWO_YELLOWS_NOTE = "N:B Two yellow cards = red";

export type TeamCardCounts = {
  yellow: number;
  red: number;
};

function normalizePlayerName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLowerCase();
}

/** Match abbreviated API names (e.g. "T. Mokoena") to full names ("Teboho Mokoena"). */
function playerKey(event: MatchEvent): string {
  const parts = normalizePlayerName(event.player).split(/\s+/).filter(Boolean);
  const lastName = parts[parts.length - 1] ?? normalizePlayerName(event.player);
  return `${event.team}:${lastName}`;
}

function eventSortKey(event: MatchEvent): number {
  const typeOrder: Record<string, number> = {
    yellow: 0,
    red: 1,
    goal: 2,
    penalty: 2,
    penalty_missed: 2,
    subst: 3,
  };
  return (
    event.minute * 100_000 +
    (event.extraMinute ?? 0) * 1_000 +
    (typeOrder[event.type] ?? 9)
  );
}

function sortEventsChronologically(events: MatchEvent[]): MatchEvent[] {
  return [...events].sort((a, b) => eventSortKey(a) - eventSortKey(b));
}

function isSecondYellowDetail(detail?: string): boolean {
  return Boolean(detail && /second\s+yellow/i.test(detail));
}

/**
 * Converts a player's second yellow into a red card for display.
 * Events must be processed in chronological order (sorted first).
 */
export function consolidateCardEvents(events: MatchEvent[]): MatchEvent[] {
  const yellowCount = new Map<string, number>();
  const sentOff = new Set<string>();

  return sortEventsChronologically(events).map((event) => {
    if (event.type === "red") {
      sentOff.add(playerKey(event));
      return {
        ...event,
        detail: isSecondYellowDetail(event.detail) ? "Second yellow" : event.detail,
      };
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

/** Goals and penalties only — for previous fixture summaries. */
export function getGoalEvents(events: MatchEvent[] | undefined): MatchEvent[] {
  return getDisplayEvents(events).filter(
    (e) => e.type === "goal" || e.type === "penalty"
  );
}

/** Yellow and red cards only — for previous fixture summaries. */
export function getCardEvents(events: MatchEvent[] | undefined): MatchEvent[] {
  return getDisplayEvents(events).filter(
    (e) => e.type === "yellow" || e.type === "red"
  );
}

export function countCardsByTeam(
  events: MatchEvent[] | undefined,
  team: "home" | "away"
): TeamCardCounts {
  const cards = getCardEvents(events).filter((e) => e.team === team);
  return {
    yellow: cards.filter((e) => e.type === "yellow").length,
    red: cards.filter((e) => e.type === "red").length,
  };
}

export function hasCardEvents(events: MatchEvent[] | undefined): boolean {
  return getCardEvents(events).length > 0;
}
