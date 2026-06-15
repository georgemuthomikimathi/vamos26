import { NextRequest, NextResponse } from "next/server";
import { getCompetition, isLiveCompetition } from "@/lib/competitions";
import { fetchGroupStandings } from "@/lib/standings/fetch-group-standings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let standingsCache: { body: Record<string, unknown>; storedAt: number } | null = null;
const STANDINGS_TTL_MS = 30 * 60_000;

export async function GET(request: NextRequest) {
  const competitionParam = request.nextUrl.searchParams.get("competition") ?? "world-cup";

  if (!isLiveCompetition(competitionParam)) {
    return NextResponse.json(
      { error: "Invalid competition", valid: ["world-cup"] },
      { status: 400 }
    );
  }

  if (standingsCache && Date.now() - standingsCache.storedAt < STANDINGS_TTL_MS) {
    return NextResponse.json({ ...standingsCache.body, cached: true });
  }

  const competition = getCompetition(competitionParam)!;
  const standings = await fetchGroupStandings();

  const body = {
    competition: competition.id,
    competitionName: competition.name,
    groups: standings.groups,
    matchesPlayed: standings.matchesPlayed,
    updatedAt: standings.updatedAt,
    source: standings.source,
  };

  standingsCache = { body, storedAt: Date.now() };

  return NextResponse.json(body);
}
