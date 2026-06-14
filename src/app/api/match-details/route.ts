import { NextRequest, NextResponse } from "next/server";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { enrichMatchFromApi } from "@/lib/scores/providers/fixture-enrichment";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id query required" }, { status: 400 });
  }

  const { matches } = await fetchMatchesByCompetition("world-cup");
  const match = matches.find((m) => m.id === id);

  if (!match) {
    return NextResponse.json({ error: "match not found" }, { status: 404 });
  }

  const enriched =
    match.id.startsWith("af-") &&
    (match.status === "live" ||
      match.status === "halftime" ||
      match.status === "finished")
      ? await enrichMatchFromApi(match)
      : match;

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
