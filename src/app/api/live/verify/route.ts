import { NextResponse } from "next/server";
import { checkApiFootballEnv } from "@/lib/scores/providers/api-config";
import { verifyApiFootballKey } from "@/lib/scores/providers/api-football-fetch";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Safe key verification — never returns the full API key */
export async function GET() {
  const env = checkApiFootballEnv();
  const verify = await verifyApiFootballKey();

  return NextResponse.json({
    envCheck: {
      configured: env.configured,
      keySource: env.keySource,
      leagueId: env.leagueId,
      season: env.season,
      warnings: env.warnings,
    },
    verify,
    ok: Boolean(verify.workingMode),
    fix: verify.hint,
  });
}
