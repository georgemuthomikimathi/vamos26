import type { Match, MatchStatus } from "@/lib/scores/types";

/** True for matches from a live data provider (not static preview ids like m1). */
export function isApiSourcedMatch(match: Match): boolean {
  return match.id.startsWith("af-") || match.id.startsWith("wc26-");
}

/**
 * Client-side hint: scheduled API fixtures past kickoff display as live until the API updates.
 * Skips static preview matches (m1, m2…) so the site does not stick on opening kickoff at 0:00.
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
      minute: match.minute ?? 0,
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
