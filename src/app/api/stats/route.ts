import { NextRequest, NextResponse } from "next/server";
import { getCompetition, isLiveCompetition } from "@/lib/competitions";
import { fetchApiFootballSeasonFixtures } from "@/lib/scores/providers/api-football";
import { attachLineupsToMatches } from "@/lib/scores/lineups";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";
import { pickLatestMatchMvp } from "@/lib/scores/match-mvp";
import { compileTournamentStats } from "@/lib/stats/compile-tournament-stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let statsCache: { body: Record<string, unknown>; storedAt: number } | null = null;
const STATS_TTL_MS = 10 * 60_000;

export async function GET(request: NextRequest) {
  const competitionParam = request.nextUrl.searchParams.get("competition") ?? "world-cup";

  if (!isLiveCompetition(competitionParam)) {
    return NextResponse.json(
      { error: "Invalid competition", valid: ["world-cup"] },
      { status: 400 }
    );
  }

  if (statsCache && Date.now() - statsCache.storedAt < STATS_TTL_MS) {
    return NextResponse.json({ ...statsCache.body, cached: true });
  }

  const competition = getCompetition(competitionParam)!;
  const { matches } = await fetchApiFootballSeasonFixtures(competitionParam);
  const finalized = enrichMatchesFromMeta(attachLineupsToMatches(matches ?? []));

  const statEligible = finalized.filter(
    (m) =>
      m.status === "finished" ||
      m.status === "live" ||
      m.status === "halftime"
  );

  const compiled = compileTournamentStats(statEligible);
  const manOfTheMatch = pickLatestMatchMvp(statEligible);

  const body = {
    updatedAt: compiled.updatedAt,
    competition: competition.id,
    matchesPlayed: compiled.matchesPlayed,
    scorers: compiled.topScorers,
    manOfTheMatch,
    summary: compiled.summary,
    provider: matches?.length ? "api-football" : "static",
  };

  statsCache = { body, storedAt: Date.now() };

  return NextResponse.json(body);
}
