import { NextRequest, NextResponse } from "next/server";
import { getCompetition, isLiveCompetition } from "@/lib/competitions";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { compileTournamentStats } from "@/lib/stats/compile-tournament-stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const competitionParam = request.nextUrl.searchParams.get("competition") ?? "world-cup";

  if (!isLiveCompetition(competitionParam)) {
    return NextResponse.json(
      { error: "Invalid competition", valid: ["world-cup"] },
      { status: 400 }
    );
  }

  const competition = getCompetition(competitionParam)!;
  const { matches } = await fetchMatchesByCompetition(competitionParam);
  const compiled = compileTournamentStats(matches);

  return NextResponse.json({
    updatedAt: compiled.updatedAt,
    competition: competition.id,
    matchesPlayed: compiled.matchesPlayed,
    scorers: compiled.topScorers,
    assists: compiled.topAssists,
    mostCards: compiled.mostCards,
  });
}
