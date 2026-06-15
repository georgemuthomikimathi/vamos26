import type { Match } from "@/lib/scores/types";

/** Score + minute signature for live matches — triggers refresh on goals/cards. */
export function liveScoreFingerprint(matches: Match[]): string {
  return matches
    .filter((m) => m.status === "live" || m.status === "halftime")
    .map((m) => {
      const h = m.score.home ?? 0;
      const a = m.score.away ?? 0;
      const min = m.score.home != null ? `${m.minute ?? 0}+${m.extraMinute ?? 0}` : "0";
      return `${m.id}:${h}-${a}@${min}`;
    })
    .sort()
    .join("|");
}
