import { fetchWorldCup26AllGroupMatches } from "@/lib/scores/providers/worldcup26";
import { attachLineupsToMatches } from "@/lib/scores/lineups";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";
import {
  compileGroupStandings,
  type CompiledGroupStandings,
} from "@/lib/standings/compile-group-standings";

export async function fetchGroupStandings(): Promise<
  CompiledGroupStandings & { source: "worldcup26" | "fallback" }
> {
  const { matches } = await fetchWorldCup26AllGroupMatches("world-cup");
  const finalized = enrichMatchesFromMeta(attachLineupsToMatches(matches ?? []));
  const compiled = compileGroupStandings(finalized);

  return {
    ...compiled,
    source: matches?.length ? "worldcup26" : "fallback",
  };
}
