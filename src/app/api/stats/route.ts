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
  const { matches, provider } = await fetchMatchesByCompetition(competitionParam, {
    enrichEvents: true,
  });

  const statEligible = matches.filter(
    (m) =>
      m.status === "finished" ||
      m.status === "live" ||
      m.status === "halftime"
  );

  const compiled = compileTournamentStats(statEligible);

  return NextResponse.json({
    updatedAt: compiled.updatedAt,
    competition: competition.id,
    matchesPlayed: compiled.matchesPlayed,
    scorers: compiled.topScorers,
    assists: compiled.topAssists,
    yellowCards: compiled.mostYellowCards,
    redCards: compiled.mostRedCards,
    penalties: compiled.topPenalties,
    substitutions: compiled.mostSubstitutions,
    summary: compiled.summary,
    provider,
  });
}
