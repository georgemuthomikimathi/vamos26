import { NextResponse } from "next/server";
import { probeApiFootball } from "@/lib/scores/providers/api-football";
import { probeWorldCup26 } from "@/lib/scores/providers/worldcup26";
import {
  fetchMatchesByCompetition,
  isApiFootballPlanError,
} from "@/lib/scores/fetch-matches";
import { getLiveCount } from "@/lib/scores/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const probe = await probeApiFootball();
  const worldcup26Probe = await probeWorldCup26();
  const { matches, source, provider, reason, apiError, apiFootballError } =
    await fetchMatchesByCompetition("world-cup");

  const apiFootballPlanBlocked = isApiFootballPlanError(apiFootballError);

  return NextResponse.json({
    ok: source === "api",
    source,
    provider,
    reason,
    apiError,
    apiFootballError,
    apiFootballPlanBlocked,
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
    probe,
    worldcup26: worldcup26Probe,
    fix:
      provider === "worldcup26"
        ? "World Cup 2026 scores via worldcup26.ir (free). API-Football optional for richer data."
        : !probe.configured
          ? "Vercel → vamos26 → Settings → Environment Variables → add API_FOOTBALL_KEY → Redeploy (optional)"
          : source === "static"
            ? apiFootballPlanBlocked
              ? "API-Football free tier blocked WC 2026; worldcup26.ir fallback also failed — check /get/games"
              : "Key is set but no fixtures returned. Verify key at dashboard.api-football.com"
            : "API connected via API-Football",
  });
}
