import type { Match, MatchStatus } from "@/lib/scores/types";

export type MatchCenterTab = "live" | "upcoming" | "previous";

const FINISHED_STATUSES: MatchStatus[] = ["finished"];
const LIVE_STATUSES: MatchStatus[] = ["live", "halftime"];

export function isMatchLive(match: Match): boolean {
  return LIVE_STATUSES.includes(match.status);
}

export function isMatchFinished(match: Match): boolean {
  return FINISHED_STATUSES.includes(match.status);
}

export function isMatchUpcoming(match: Match): boolean {
  return match.status === "scheduled";
}

export type MatchBuckets = {
  live: Match[];
  upcoming: Match[];
  previous: Match[];
};

function kickoffTime(match: Match): number {
  return match.kickoffAt ? new Date(match.kickoffAt).getTime() : 0;
}

export function bucketMatches(matches: Match[]): MatchBuckets {
  const live = matches.filter(isMatchLive);
  const previous = matches
    .filter(isMatchFinished)
    .sort((a, b) => kickoffTime(b) - kickoffTime(a));
  const upcoming = matches
    .filter(isMatchUpcoming)
    .sort((a, b) => kickoffTime(a) - kickoffTime(b));

  return { live, upcoming, previous };
}

export function getMatchTabCounts(matches: Match[]): Record<MatchCenterTab, number> {
  const buckets = bucketMatches(matches);
  return {
    live: buckets.live.length,
    upcoming: buckets.upcoming.length,
    previous: buckets.previous.length,
  };
}

export function pickDefaultTab(counts: Record<MatchCenterTab, number>): MatchCenterTab {
  if (counts.live > 0) return "live";
  if (counts.previous > 0) return "previous";
  if (counts.upcoming > 0) return "upcoming";
  return "previous";
}

export function extractStageFilters(matches: Match[]): string[] {
  const groups = new Set<string>();
  for (const match of matches) {
    const groupMatch = match.stage.match(/Group\s+[A-L]/i);
    if (groupMatch) {
      groups.add(groupMatch[0].toUpperCase());
      continue;
    }
    if (/final/i.test(match.stage)) groups.add("Final");
    else if (/semi/i.test(match.stage)) groups.add("Semi-finals");
    else if (/quarter/i.test(match.stage)) groups.add("Quarter-finals");
    else if (/round of 16|r16/i.test(match.stage)) groups.add("Round of 16");
    else if (/round of 32|r32/i.test(match.stage)) groups.add("Round of 32");
  }
  return [...groups].sort();
}

export function filterByStage(matches: Match[], stage: string | null): Match[] {
  if (!stage) return matches;
  if (stage === "Final") return matches.filter((m) => /final/i.test(m.stage) && !/semi|quarter|third/i.test(m.stage));
  if (stage === "Semi-finals") return matches.filter((m) => /semi/i.test(m.stage));
  if (stage === "Quarter-finals") return matches.filter((m) => /quarter/i.test(m.stage));
  if (stage === "Round of 16") return matches.filter((m) => /round of 16|r16/i.test(m.stage));
  if (stage === "Round of 32") return matches.filter((m) => /round of 32|r32/i.test(m.stage));
  return matches.filter((m) => m.stage.toUpperCase().includes(stage.toUpperCase()));
}
