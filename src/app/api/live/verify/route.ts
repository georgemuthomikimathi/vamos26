import { NextResponse } from "next/server";
import { verifyApiFootballKey } from "@/lib/scores/providers/api-football-fetch";
import { checkApiFootballEnv } from "@/lib/scores/providers/api-config";
import { probeWorldCup26 } from "@/lib/scores/providers/worldcup26";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const envCheck = checkApiFootballEnv();
  const verification = await verifyApiFootballKey();
  const worldcup26 = await probeWorldCup26();

  return NextResponse.json({
    ok: verification.workingMode != null,
    provider: verification.workingMode ? "api-football" : "worldcup26",
    verification,
    envCheck: {
      configured: envCheck.configured,
      keySource: envCheck.keySource,
      keyRecovered: envCheck.keyRecovered,
      recoveredFromVar: envCheck.recoveredFromVar,
      leagueId: envCheck.leagueId,
      season: envCheck.season,
      warnings: envCheck.warnings,
    },
    worldcup26,
    hint: verification.hint,
    fix: verification.workingMode
      ? envCheck.keyRecovered
        ? "Key auto-recovered — move to API_FOOTBALL_KEY and set API_FOOTBALL_LEAGUE_WC=1, then redeploy"
        : "API-Football key verified. Use /api/live/status for full diagnostics."
      : envCheck.warnings[0] ??
        "Set API_FOOTBALL_KEY in Vercel (Production) and redeploy. See /api/live/status.",
  });
}
