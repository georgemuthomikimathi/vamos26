import type { Match } from "@/lib/scores/types";
import {
  fetchWorldCup26AllGroupMatches,
  fetchWorldCup26Fixtures,
} from "@/lib/scores/providers/worldcup26";

function pairKey(match: Pick<Match, "home" | "away">): string {
  return `${match.home.code}-${match.away.code}`;
}

function needsEventBackfill(match: Match): boolean {
  if (
    match.status !== "finished" &&
    match.status !== "live" &&
    match.status !== "halftime"
  ) {
    return false;
  }
  const goals = (match.score.home ?? 0) + (match.score.away ?? 0);
  if (goals === 0) return false;
  return !(match.events?.length);
}

async function loadWorldCup26Matches(): Promise<Match[]> {
  const { matches: recent } = await fetchWorldCup26Fixtures("world-cup");
  if (recent?.length) return recent;

  const { matches: all } = await fetchWorldCup26AllGroupMatches("world-cup");
  return all ?? [];
}

/** Fill missing timelines from worldcup26.ir scorer strings when API-Football events fail. */
export async function backfillEventsFromWorldCup26(
  matches: Match[]
): Promise<Match[]> {
  if (!matches.some(needsEventBackfill)) return matches;

  const wc26 = await loadWorldCup26Matches();
  if (!wc26.length) return matches;

  const wc26ByPair = new Map(wc26.map((m) => [pairKey(m), m]));

  return matches.map((match) => {
    if (!needsEventBackfill(match)) return match;
    const source = wc26ByPair.get(pairKey(match));
    if (!source?.events?.length) return match;
    return {
      ...match,
      events: source.events,
    };
  });
}
