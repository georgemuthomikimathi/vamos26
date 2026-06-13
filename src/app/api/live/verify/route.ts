import { NextResponse } from "next/server";
import { probeWorldCup26 } from "@/lib/scores/providers/worldcup26";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Legacy verify URL — redirects to worldcup26-only status model */
export async function GET() {
  const probe = await probeWorldCup26();

  return NextResponse.json({
    ok: probe.gameCount > 0,
    provider: "worldcup26",
    dataSource: "worldcup26.ir",
    worldcup26: probe,
    fix:
      probe.gameCount > 0
        ? "World Cup 2026 via worldcup26.ir — no API key required."
        : "worldcup26.ir unreachable — check https://worldcup26.ir",
    note: "API-Football removed. Use /api/live/status for full diagnostics.",
  });
}
