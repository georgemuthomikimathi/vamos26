import { NextRequest, NextResponse } from "next/server";
import { getCompetition, isLiveCompetition } from "@/lib/competitions";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { getLiveCount } from "@/lib/scores/types";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ competition: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { competition: competitionId } = await context.params;

  if (!isLiveCompetition(competitionId)) {
    return NextResponse.json(
      { error: "Competition not found", valid: ["world-cup"] },
      { status: 404 }
    );
  }

  const competition = getCompetition(competitionId)!;
  const { matches, source, reason } = await fetchMatchesByCompetition(competitionId);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    competition: competition.id,
    competitionName: competition.name,
    active: competition.active,
    liveCount: getLiveCount(matches),
    matches,
    source,
    reason,
  });
}
