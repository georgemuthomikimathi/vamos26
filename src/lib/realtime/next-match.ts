import type { Match } from "@/lib/scores/types";
import { isSquadRevealWindow } from "@/lib/realtime/polling";

export function nextScheduledMatch(
  matches: Match[],
  now = Date.now()
): Match | null {
  const upcoming = matches
    .filter((m) => m.status === "scheduled" && m.kickoffAt)
    .sort(
      (a, b) =>
        new Date(a.kickoffAt!).getTime() - new Date(b.kickoffAt!).getTime()
    );

  for (const match of upcoming) {
    if (new Date(match.kickoffAt!).getTime() > now) return match;
  }
  return upcoming[0] ?? null;
}

export function msUntilMatchKickoff(
  match: Match | null,
  now = Date.now()
): number | null {
  if (!match?.kickoffAt) return null;
  return new Date(match.kickoffAt).getTime() - now;
}

export function isLineupRevealForMatch(match: Match, now = Date.now()): boolean {
  if (match.status === "live" || match.status === "halftime" || match.status === "finished") {
    return true;
  }
  return isSquadRevealWindow(match.kickoffAt, now);
}
