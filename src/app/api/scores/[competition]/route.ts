import { NextRequest, NextResponse } from "next/server";
import { getCompetition, isValidCompetition } from "@/lib/competitions";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { getLiveCount } from "@/lib/scores/types";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ competition: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { competition: competitionId } = await context.params;

  if (!isValidCompetition(competitionId)) {
    return NextResponse.json(
      { error: "Competition not found", valid: ["world-cup", "friendly", "premier-league", "serie-a"] },
      { status: 404 }
    );
  }

  const competition = getCompetition(competitionId)!;
  const { matches, source } = await fetchMatchesByCompetition(competitionId);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    competition: competition.id,
    competitionName: competition.name,
    active: competition.active,
    liveCount: getLiveCount(matches),
    matches,
    source,
  });
}
