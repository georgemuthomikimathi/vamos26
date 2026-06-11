import { NextResponse } from "next/server";
import { probeApiFootball } from "@/lib/scores/providers/api-football";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { getLiveCount } from "@/lib/scores/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const probe = await probeApiFootball();
  const { matches, source, reason, apiError } = await fetchMatchesByCompetition("world-cup");

  return NextResponse.json({
    ok: source === "api",
    source,
    reason,
    apiError,
    liveCount: getLiveCount(matches),
    matchCount: matches.length,
    firstMatch: matches[0]
      ? {
          id: matches[0].id,
          home: matches[0].home.name,
          away: matches[0].away.name,
          status: matches[0].status,
          score: matches[0].score,
        }
      : null,
    probe,
    fix: !probe.configured
      ? "Vercel → vamos26 → Settings → Environment Variables → add API_FOOTBALL_KEY → Redeploy"
      : source === "static"
        ? "Key is set but API returned no fixtures. Verify key at dashboard.api-football.com"
        : "API connected",
  });
}
