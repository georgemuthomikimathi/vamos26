import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { fetchWorldCup26AllGroupMatches } from "@/lib/scores/providers/worldcup26";
import {
  compileGroupStandings,
  type CompiledGroupStandings,
} from "@/lib/standings/compile-group-standings";
import type { Match } from "@/lib/scores/types";

function mergeGroupMatches(primary: Match[], fallback: Match[]): Match[] {
  const byId = new Map<string, Match>();
  for (const match of fallback) byId.set(match.id, match);
  for (const match of primary) byId.set(match.id, match);
  return [...byId.values()];
}

export async function fetchGroupStandings(): Promise<
  CompiledGroupStandings & { source: "worldcup26" | "fallback" }
> {
  const [{ matches: apiMatches }, { matches: wc26Matches }] = await Promise.all([
    fetchMatchesByCompetition("world-cup"),
    fetchWorldCup26AllGroupMatches("world-cup"),
  ]);

  const matches =
    wc26Matches && wc26Matches.length > 0
      ? mergeGroupMatches(wc26Matches, apiMatches)
      : apiMatches;

  const compiled = compileGroupStandings(matches);

  return {
    ...compiled,
    source: wc26Matches && wc26Matches.length > 0 ? "worldcup26" : "fallback",
  };
}
