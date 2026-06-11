import { NextRequest, NextResponse } from "next/server";
import { getCompetition, isLiveCompetition } from "@/lib/competitions";
import { fetchGroupStandings } from "@/lib/standings/fetch-group-standings";

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
  const standings = await fetchGroupStandings();

  return NextResponse.json({
    competition: competition.id,
    competitionName: competition.name,
    groups: standings.groups,
    matchesPlayed: standings.matchesPlayed,
    updatedAt: standings.updatedAt,
    source: standings.source,
  });
}
