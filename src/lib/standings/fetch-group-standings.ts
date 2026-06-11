import type { Match } from "@/lib/scores/types";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { fetchWorldCup26AllGroupMatches } from "@/lib/scores/providers/worldcup26";
import {
  compileGroupStandings,
  type CompiledGroupStandings,
} from "@/lib/standings/compile-group-standings";

function mergeGroupMatches(primary: Match[], fallback: Match[]): Match[] {
  const byId = new Map<string, Match>();
  for (const match of fallback) byId.set(match.id, match);
  for (const match of primary) byId.set(match.id, match);
  return [...byId.values()];
}

export async function fetchGroupStandings(): Promise<
  CompiledGroupStandings & { source: "worldcup26" | "fallback" }
> {
  const [{ matches: allGroupMatches }, { matches: liveMatches }] = await Promise.all([
    fetchWorldCup26AllGroupMatches("world-cup"),
    fetchMatchesByCompetition("world-cup"),
  ]);

  const matches =
    allGroupMatches && allGroupMatches.length > 0
      ? mergeGroupMatches(allGroupMatches, liveMatches)
      : liveMatches;

  const compiled = compileGroupStandings(matches);

  return {
    ...compiled,
    source: allGroupMatches && allGroupMatches.length > 0 ? "worldcup26" : "fallback",
  };
}
