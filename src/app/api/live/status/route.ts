import { NextResponse } from "next/server";
import { probeApiFootball } from "@/lib/scores/providers/api-football";
import { probeWorldCup26 } from "@/lib/scores/providers/worldcup26";
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
  const worldcup26Probe = await probeWorldCup26();
  const { matches, source, provider, reason, apiError, apiFootballError } =
    await fetchMatchesByCompetition("world-cup");

  const apiFootballPlanBlocked = isApiFootballPlanError(apiFootballError);
  const apiFootballRateLimited = isApiFootballRateLimitError(apiFootballError);
  const apiFootballAuthError = isApiFootballAuthError(apiFootballError);

  const envMisconfigured = envCheck.warnings.length > 0;

  return NextResponse.json({
    ok: source === "api" && provider === "api-football",
    source,
    provider,
    reason,
    apiError,
    apiFootballError,
    apiFootballPlanBlocked,
    apiFootballRateLimited,
    apiFootballAuthError,
    envCheck: {
      configured: envCheck.configured,
      keySource: envCheck.keySource,
      keyRecovered: envCheck.keyRecovered,
      recoveredFromVar: envCheck.recoveredFromVar,
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
    worldcup26: worldcup26Probe,
    fix:
      provider === "api-football"
        ? envCheck.keyRecovered
          ? "API key auto-recovered from misplaced env var — move key to API_FOOTBALL_KEY and set league=1"
          : "Paid API-Football connected — live lineups, all subs, cards, goals & assists enabled"
        : envMisconfigured
          ? `Fix Vercel env: ${envCheck.warnings[0]}`
          : provider === "worldcup26"
            ? "World Cup 2026 scores via worldcup26.ir (free). Set API_FOOTBALL_KEY + API_FOOTBALL_LEAGUE_WC=1 for paid data."
            : !probe.configured
              ? "Vercel → vamos26 → Settings → Environment Variables → add API_FOOTBALL_KEY → Redeploy"
              : source === "static"
                ? apiFootballPlanBlocked
                  ? "API-Football free tier blocked WC 2026; worldcup26.ir fallback also failed"
                  : apiFootballRateLimited
                    ? "API-Football rate limited; worldcup26.ir fallback also failed"
                    : apiFootballAuthError
                      ? "API_FOOTBALL_KEY rejected — verify paid key at dashboard.api-football.com"
                      : "Key is set but no fixtures returned. Verify key and league=1 season=2026"
                : "Check probe.errors for details",
  });
}
