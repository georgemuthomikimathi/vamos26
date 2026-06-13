import { NextResponse } from "next/server";
import { probeWorldCup26 } from "@/lib/scores/providers/worldcup26";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { getLiveCount } from "@/lib/scores/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const worldcup26Probe = await probeWorldCup26();
  const { matches, source, provider, reason, apiError } =
    await fetchMatchesByCompetition("world-cup");

  const ok = source === "api" && provider === "worldcup26";

  return NextResponse.json({
    ok,
    source,
    provider,
    reason,
    apiError,
    dataSource: "worldcup26.ir",
    liveCount: getLiveCount(matches),
    matchCount: matches.length,
    firstMatch: matches[0]
      ? {
          id: matches[0].id,
          home: matches[0].home.name,
          away: matches[0].away.name,
          status: matches[0].status,
          score: matches[0].score,
          minute: matches[0].minute,
        }
      : null,
    worldcup26: worldcup26Probe,
    fix: ok
      ? "World Cup 2026 live via worldcup26.ir — no API key needed."
      : "worldcup26.ir unreachable — retry shortly or check https://worldcup26.ir",
  });
}
