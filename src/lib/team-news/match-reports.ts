import type { Match } from "@/lib/scores/types";
import type { TeamNewsItem } from "@/lib/team-news";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";
import { getMatchMetaForMatch } from "@/lib/match-meta";

function scorerSummary(match: Match): string {
  const goals = (match.events ?? []).filter(
    (e) => e.type === "goal" || e.type === "penalty"
  );
  if (goals.length === 0) {
    return `Full-time at ${match.venue}.`;
  }
  const parts = goals.map((g) => {
    const side = g.team === "home" ? match.home.name : match.away.name;
    const assist = g.playerSecondary ? ` (assist ${g.playerSecondary})` : "";
    return `${g.player} ${g.minute}'${g.extraMinute ? `+${g.extraMinute}` : ""} for ${side}${assist}`;
  });
  return `Goals: ${parts.join("; ")}.`;
}

function headlineForMatch(match: Match): string {
  const home = match.home.name;
  const away = match.away.name;
  const h = match.score.home ?? 0;
  const a = match.score.away ?? 0;

  if (h === a) {
    return `${home} and ${away} draw ${h}–${a} in ${match.stage}`;
  }

  if (h > a) {
    return `${home} beat ${away} ${h}–${a} in ${match.stage}`;
  }
  return `${away} beat ${home} ${a}–${h} in ${match.stage}`;
}

function teamCodeForWinner(match: Match): string {
  const h = match.score.home ?? 0;
  const a = match.score.away ?? 0;
  if (h === a) return match.home.code;
  return h > a ? match.home.code : match.away.code;
}

function teamNameForWinner(match: Match): string {
  const h = match.score.home ?? 0;
  const a = match.score.away ?? 0;
  if (h === a) return match.home.name;
  return h > a ? match.home.name : match.away.name;
}

/** Verified headlines generated only from finished match scores on worldcup26.ir */
export function generateVerifiedMatchReports(matches: Match[]): TeamNewsItem[] {
  const enriched = enrichMatchesFromMeta(matches);

  return enriched
    .filter((m) => m.status === "finished" && m.score.home != null && m.score.away != null)
    .sort((a, b) => {
      const ta = a.kickoffAt ? new Date(a.kickoffAt).getTime() : 0;
      const tb = b.kickoffAt ? new Date(b.kickoffAt).getTime() : 0;
      return tb - ta;
    })
    .map((match) => {
      const meta = getMatchMetaForMatch(match);
      const extra =
        match.score.home === match.score.away
          ? undefined
          : match.score.home! > match.score.away!
            ? meta?.home.newsHeadline
            : meta?.away.newsHeadline;

      return {
        id: `verified-${match.id}`,
        code: teamCodeForWinner(match),
        team: teamNameForWinner(match),
        headline: headlineForMatch(match),
        summary: extra ? `${extra} ${scorerSummary(match)}` : scorerSummary(match),
        date: match.date,
        tag: "form" as const,
        url: match.detailUrl ?? `https://www.fifa.com/en/matches?search=${encodeURIComponent(`${match.home.name} ${match.away.name}`)}`,
        source: "VAMOS26 Verified",
        external: true,
        verified: true,
        kind: "match-report" as const,
      };
    });
}
