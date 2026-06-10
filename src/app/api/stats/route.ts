import { NextResponse } from "next/server";
import { TOP_SCORERS, TOP_ASSISTS, CLEAN_SHEETS } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    scorers: TOP_SCORERS,
    assists: TOP_ASSISTS,
    cleanSheets: CLEAN_SHEETS,
  });
}
