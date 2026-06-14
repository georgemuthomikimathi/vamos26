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
  CompiledGroupStandings & { source: "api-football" | "worldcup26" | "fallback" }
> {
  const [{ matches: apiMatches, provider }, { matches: wc26Matches }] = await Promise.all([
    fetchMatchesByCompetition("world-cup"),
    fetchWorldCup26AllGroupMatches("world-cup"),
  ]);

  const matches =
    provider === "api-football"
      ? apiMatches
      : wc26Matches && wc26Matches.length > 0
        ? mergeGroupMatches(wc26Matches, apiMatches)
        : apiMatches;

  const compiled = compileGroupStandings(matches);

  return {
    ...compiled,
    source:
      provider === "api-football"
        ? "api-football"
        : wc26Matches && wc26Matches.length > 0
          ? "worldcup26"
          : "fallback",
  };
}
