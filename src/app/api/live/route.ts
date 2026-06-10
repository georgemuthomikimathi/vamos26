import { NextRequest, NextResponse } from "next/server";
import { getCompetition, isValidCompetition } from "@/lib/competitions";
import { getMatchesByCompetition } from "@/lib/scores";
import { getLiveCount } from "@/lib/scores/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const competitionParam = request.nextUrl.searchParams.get("competition") ?? "world-cup";

  if (!isValidCompetition(competitionParam)) {
    return NextResponse.json(
      { error: "Invalid competition", valid: ["world-cup", "friendly", "premier-league", "serie-a"] },
      { status: 400 }
    );
  }

  const competition = getCompetition(competitionParam)!;
  const matches = getMatchesByCompetition(competitionParam);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    competition: competition.id,
    competitionName: competition.name,
    liveCount: getLiveCount(matches),
    matches,
  });
}
