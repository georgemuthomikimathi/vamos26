import { NextRequest, NextResponse } from "next/server";
import { fetchFixtureEvents } from "@/lib/scores/providers/api-football-events";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const fixture = request.nextUrl.searchParams.get("fixture");
  if (!fixture) {
    return NextResponse.json({ error: "fixture query required" }, { status: 400 });
  }

  const events = await fetchFixtureEvents(fixture);

  return NextResponse.json({
    fixture,
    updatedAt: new Date().toISOString(),
    events,
  });
}
