import type { Match, MatchEvent } from "@/lib/scores/types";
import { getCardEvents, getDisplayEvents, getGoalEvents } from "@/lib/scores/card-events";
import { enrichMatchFromMeta } from "@/lib/scores/enrich-from-meta";

export type MatchLogEntry = {
  minute: string;
  kind: "goal" | "card" | "sub";
  label: string;
  team: "home" | "away";
};

function formatMin(minute: number, extra?: number): string {
  if (extra && extra > 0) return `${minute}+${extra}'`;
  return `${minute}'`;
}

/** Chronological goals, cards, and subs for display and news. */
export function buildMatchLog(match: Match): MatchLogEntry[] {
  const enriched = enrichMatchFromMeta(match);
  const display = getDisplayEvents(enriched.events ?? []);
  const goals = getGoalEvents(display);
  const cards = getCardEvents(display);
  const entries: MatchLogEntry[] = [];

  for (const e of goals) {
    const assist = e.playerSecondary ? ` (assist ${e.playerSecondary})` : "";
    entries.push({
      minute: formatMin(e.minute, e.extraMinute),
      kind: "goal",
      label: `${e.player}${assist}`,
      team: e.team,
    });
  }

  for (const e of cards) {
    const note = e.detail === "Second yellow" ? " — 2nd yellow" : "";
    entries.push({
      minute: formatMin(e.minute, e.extraMinute),
      kind: "card",
      label: `${e.player}${note}`,
      team: e.team,
    });
  }

  for (const sub of enriched.homeSubs ?? []) {
    entries.push({
      minute: formatMin(sub.minute, sub.extraMinute),
      kind: "sub",
      label: `${sub.playerIn} ← ${sub.playerOut}`,
      team: "home",
    });
  }
  for (const sub of enriched.awaySubs ?? []) {
    entries.push({
      minute: formatMin(sub.minute, sub.extraMinute),
      kind: "sub",
      label: `${sub.playerIn} ← ${sub.playerOut}`,
      team: "away",
    });
  }

  return entries.sort((a, b) => {
    const parse = (m: string) => {
      const [base, extra] = m.replace("'", "").split("+");
      return Number(base) * 100 + Number(extra ?? 0);
    };
    return parse(a.minute) - parse(b.minute);
  });
}

export function hasGoalOrCardEvents(match: Match): boolean {
  const enriched = enrichMatchFromMeta(match);
  const display = getDisplayEvents(enriched.events ?? []);
  return getGoalEvents(display).length > 0 || getCardEvents(display).length > 0;
}

export function cardSummaryForNews(events: MatchEvent[]): string {
  const cards = getCardEvents(getDisplayEvents(events));
  if (cards.length === 0) return "";
  const parts = cards.map((c) => {
    const icon = c.type === "red" ? "red" : "yellow";
    return `${c.player} ${c.minute}' (${icon}${c.detail === "Second yellow" ? ", 2nd yellow" : ""})`;
  });
  return ` Cards: ${parts.join("; ")}.`;
}
