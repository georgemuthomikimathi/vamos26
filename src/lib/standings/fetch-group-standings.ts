import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import {
  compileGroupStandings,
  type CompiledGroupStandings,
} from "@/lib/standings/compile-group-standings";

export async function fetchGroupStandings(): Promise<
  CompiledGroupStandings & { source: "api-football" | "worldcup26" | "fallback" }
> {
  const { matches, provider } = await fetchMatchesByCompetition("world-cup");
  const compiled = compileGroupStandings(matches);

  return {
    ...compiled,
    source:
      provider === "api-football"
        ? "api-football"
        : provider === "worldcup26"
          ? "worldcup26"
          : "fallback",
  };
}
