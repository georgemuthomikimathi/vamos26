import { NextResponse } from "next/server";
import { fetchTeamNews } from "@/lib/team-news/fetch-feeds";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const result = await fetchTeamNews();

  return NextResponse.json({
    updatedAt: result.fetchedAt,
    items: result.items,
    sources: result.sources,
    count: result.items.length,
    verifiedCount: result.verifiedCount,
    rejectedCount: result.rejectedCount,
    matchFactsCount: result.matchFactsCount,
  });
}
