import { NextResponse } from "next/server";
import { fetchTeamNews } from "@/lib/team-news/fetch-feeds";
import { fetchMatchesByCompetition } from "@/lib/scores/fetch-matches";
import { filterVerifiedNews } from "@/lib/verification/verify-content";
import { PREVIEW_NEWS } from "@/lib/team-news";
import { buildMatchFacts } from "@/lib/verification/match-facts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV === "development";

  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/** Daily + post-deploy verification sweep — confirms scores and filters news. */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [{ matches }, news] = await Promise.all([
    fetchMatchesByCompetition("world-cup"),
    fetchTeamNews(),
  ]);

  const facts = buildMatchFacts(matches);
  const { rejected } = filterVerifiedNews(
    [...news.items, ...PREVIEW_NEWS],
    matches
  );

  return NextResponse.json({
    ok: true,
    ranAt: new Date().toISOString(),
    matchFacts: facts.map((f) => ({
      id: f.matchId,
      fixture: `${f.home} ${f.homeGoals}–${f.awayGoals} ${f.away}`,
      stage: f.stage,
    })),
    publishedArticles: news.items.length,
    verifiedArticles: news.verifiedCount,
    rejectedArticles: news.rejectedCount + rejected.length,
    sources: news.sources,
  });
}
