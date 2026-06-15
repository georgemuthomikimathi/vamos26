import type { Match, MatchStatus } from "@/lib/scores/types";

/** True for API-Football fixtures only. */
export function isApiSourcedMatch(match: Match): boolean {
  return match.id.startsWith("af-");
}

/** Keep live minute from jumping backward when a poll omits elapsed time. */
export function stabilizeLiveMatch(prev: Match | undefined, next: Match): Match {
  if (!prev || prev.id !== next.id) return next;
  const liveish =
    next.status === "live" ||
    next.status === "halftime" ||
    prev.status === "live" ||
    prev.status === "halftime";
  if (!liveish) return next;

  const prevMin = prev.minute;
  const nextMin = next.minute;

  if (nextMin == null || nextMin === 0) {
    if (prevMin != null && prevMin > 0) {
      return { ...next, minute: prevMin, extraMinute: next.extraMinute ?? prev.extraMinute };
    }
    return next;
  }

  if (prevMin != null && nextMin < prevMin && prevMin > 5 && next.status !== "halftime") {
    return { ...next, minute: prevMin, extraMinute: prev.extraMinute ?? next.extraMinute };
  }

  return next;
}

export function mergeStableMatches(prev: Match[], next: Match[]): Match[] {
  const prevById = new Map(prev.map((m) => [m.id, m]));
  return next.map((m) => stabilizeLiveMatch(prevById.get(m.id), m));
}

/**
 * Client-side hint: scheduled API fixtures past kickoff display as live until the API updates.
 * Does not fabricate a minute — clock waits for API elapsed time.
 */
export function applyKickoffHints(matches: Match[], now = Date.now()): Match[] {
  return matches.map((match) => {
    if (!isApiSourcedMatch(match)) return match;
    if (match.status !== "scheduled" || !match.kickoffAt) return match;

    const kickoffMs = new Date(match.kickoffAt).getTime();
    if (now < kickoffMs) return match;

    const hintedStatus: MatchStatus = "live";
    const score =
      match.score.home === null && match.score.away === null
        ? { home: 0, away: 0 }
        : match.score;

    return {
      ...match,
      status: hintedStatus,
      statusShort: "LIVE",
      score,
    };
  });
}

export function nextKickoffMs(matches: Match[], now = Date.now()): number | null {
  let nearest: number | null = null;

  for (const match of matches) {
    if (match.status !== "scheduled" || !match.kickoffAt) continue;
    const ms = new Date(match.kickoffAt).getTime() - now;
    if (ms <= 0) continue;
    if (nearest == null || ms < nearest) nearest = ms;
  }

  return nearest;
}
