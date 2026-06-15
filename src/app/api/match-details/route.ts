import { NextRequest, NextResponse } from "next/server";
import { enrichMatchFromMeta } from "@/lib/scores/enrich-from-meta";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { fetchApiFootballFixtureById } from "@/lib/scores/providers/api-football";
import { fixtureIdFromMatchId } from "@/lib/scores/providers/api-football-fetch";
import { enrichMatchFromApi } from "@/lib/scores/providers/fixture-enrichment";
import type { Match } from "@/lib/scores/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function resolveMatch(id: string): Promise<Match | undefined> {
  const fixtureId = id.startsWith("af-") ? fixtureIdFromMatchId(id) : null;
  if (fixtureId) {
    const direct = await fetchApiFootballFixtureById(fixtureId);
    if (direct) return direct;
  }

  const { matches } = await fetchMatchesByCompetition("world-cup");
  return matches.find((m) => m.id === id);
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id query required" }, { status: 400 });
  }

  const match = await resolveMatch(id);

  if (!match) {
    return NextResponse.json({ error: "match not found" }, { status: 404 });
  }

  const enriched =
    match.id.startsWith("af-") &&
    (match.status === "live" ||
      match.status === "halftime" ||
      match.status === "finished")
      ? enrichMatchFromMeta(await enrichMatchFromApi(match))
      : enrichMatchFromMeta(match);

  return NextResponse.json({
    id: enriched.id,
    updatedAt: new Date().toISOString(),
    details: {
      events: enriched.events,
      homeLineup: enriched.homeLineup,
      awayLineup: enriched.awayLineup,
      homeSubs: enriched.homeSubs,
      awaySubs: enriched.awaySubs,
    },
  });
}
