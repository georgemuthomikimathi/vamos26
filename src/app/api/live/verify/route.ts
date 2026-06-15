import { NextResponse } from "next/server";
import { verifyApiFootballKey } from "@/lib/scores/providers/api-football-fetch";
import { checkApiFootballEnv } from "@/lib/scores/providers/api-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const env = checkApiFootballEnv();
  const verification = await verifyApiFootballKey();

  return NextResponse.json({
    provider: verification.workingMode ? "api-football" : "static",
    env: {
      configured: env.configured,
      keySource: env.keySource,
      leagueId: env.leagueId,
      season: env.season,
      warnings: env.warnings,
    },
    verification,
  });
}
