import { NextResponse } from "next/server";
import { probeApiFootball } from "@/lib/scores/providers/api-football";
import {
  fetchMatchesByCompetition,
  isApiFootballPlanError,
  isApiFootballRateLimitError,
  isApiFootballAuthError,
} from "@/lib/scores/fetch-matches";
import { getLiveCount } from "@/lib/scores/types";
import { checkApiFootballEnv } from "@/lib/scores/providers/api-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const envCheck = checkApiFootballEnv();
  const probe = await probeApiFootball();
  const { matches, source, provider, reason, apiError, apiFootballError } =
    await fetchMatchesByCompetition("world-cup");

  const apiFootballPlanBlocked = isApiFootballPlanError(apiFootballError);
  const apiFootballRateLimited = isApiFootballRateLimitError(apiFootballError);
  const apiFootballAuthFailed = isApiFootballAuthError(apiFootballError);

  return NextResponse.json({
    ok: source === "api" && provider === "api-football",
    source,
    provider,
    reason,
    apiError,
    apiFootballError,
    apiFootballPlanBlocked,
    apiFootballRateLimited,
    apiFootballAuthError: apiFootballAuthFailed,
    envCheck: {
      configured: envCheck.configured,
      keySource: envCheck.keySource,
      leagueId: envCheck.leagueId,
      season: envCheck.season,
      warnings: envCheck.warnings,
    },
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
    fix:
      provider === "api-football"
        ? apiFootballRateLimited
          ? "Rate limited — serving cached API data. Upgrade API-Football plan for more requests/minute."
          : "API-Football connected"
        : !probe.configured
          ? "Add API_FOOTBALL_KEY in Vercel → Redeploy"
          : apiFootballPlanBlocked
            ? "Paid plan required for World Cup 2026 season"
            : apiFootballAuthFailed
              ? "Invalid API_FOOTBALL_KEY — regenerate at dashboard.api-football.com"
              : "No fixtures returned — check API_FOOTBALL_LEAGUE_WC=1 and season=2026",
  });
}
