import { NextRequest, NextResponse } from "next/server";
import { getCompetition, isValidCompetition } from "@/lib/competitions";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { getLiveCount } from "@/lib/scores/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const competitionParam = request.nextUrl.searchParams.get("competition") ?? "world-cup";

  if (!isValidCompetition(competitionParam)) {
    return NextResponse.json(
      { error: "Invalid competition", valid: ["world-cup", "friendly", "premier-league", "serie-a"] },
      { status: 400 }
    );
  }

  const competition = getCompetition(competitionParam)!;
  const { matches, source, provider, reason, apiError } =
    await fetchMatchesByCompetition(competitionParam);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    competition: competition.id,
    competitionName: competition.name,
    liveCount: getLiveCount(matches),
    matches,
    source,
    provider,
    reason,
    apiError: source === "static" ? apiError : undefined,
  });
}
