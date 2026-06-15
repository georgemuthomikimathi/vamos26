import { NextRequest, NextResponse } from "next/server";
import { enrichMatchFromMeta } from "@/lib/scores/enrich-from-meta";
import { findCachedMatch } from "@/lib/scores/providers/api-football-fixture-cache";
import { enrichMatchEventsFromApi } from "@/lib/scores/providers/fixture-enrichment";
import type { Match } from "@/lib/scores/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const detailsCache = new Map<
  string,
  { details: Record<string, unknown>; storedAt: number }
>();
const DETAILS_TTL_MS = 15 * 60_000;

function resolveMatch(id: string): Match | undefined {
  return findCachedMatch(id);
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id query required" }, { status: 400 });
  }

  const cached = detailsCache.get(id);
  if (cached && Date.now() - cached.storedAt < DETAILS_TTL_MS) {
    return NextResponse.json({
      id,
      updatedAt: new Date().toISOString(),
      details: cached.details,
      cached: true,
    });
  }

  const match = resolveMatch(id);

  if (!match) {
    return NextResponse.json({ error: "match not found" }, { status: 404 });
  }

  const isApiMatch =
    match.id.startsWith("af-") &&
    (match.status === "live" ||
      match.status === "halftime" ||
      match.status === "finished");

  const enriched = isApiMatch
    ? enrichMatchFromMeta(await enrichMatchEventsFromApi(match))
    : enrichMatchFromMeta(match);

  const details = { events: enriched.events };

  detailsCache.set(id, { details, storedAt: Date.now() });

  return NextResponse.json({
    id: enriched.id,
    updatedAt: new Date().toISOString(),
    details,
  });
}
