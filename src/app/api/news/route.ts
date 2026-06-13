import { NextResponse } from "next/server";
import { fetchTeamNews } from "@/lib/team-news/fetch-feeds";

export const dynamic = "force-dynamic";
export const revalidate = 120;

export async function GET() {
  const { items, sources, fetchedAt } = await fetchTeamNews();

  return NextResponse.json({
    updatedAt: fetchedAt,
    items,
    sources,
    count: items.length,
  });
}
