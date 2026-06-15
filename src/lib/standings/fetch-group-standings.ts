import { fetchApiFootballSeasonFixtures } from "@/lib/scores/providers/api-football";
import { attachLineupsToMatches } from "@/lib/scores/lineups";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";
import {
  compileGroupStandings,
  type CompiledGroupStandings,
} from "@/lib/standings/compile-group-standings";

export async function fetchGroupStandings(): Promise<
  CompiledGroupStandings & { source: "api-football" | "fallback" }
> {
  const { matches } = await fetchApiFootballSeasonFixtures("world-cup");
  const finalized = enrichMatchesFromMeta(attachLineupsToMatches(matches ?? []));
  const compiled = compileGroupStandings(finalized);

  return {
    ...compiled,
    source: matches?.length ? "api-football" : "fallback",
  };
}
