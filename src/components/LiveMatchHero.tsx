"use client";

import { ExternalLink } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import { formatScore } from "@/lib/scores/types";
import { useMatchDetails } from "@/hooks/useMatchDetails";
import { getMatchMetaForMatch, getCoachInfo } from "@/lib/match-meta";
import TeamFlagWithFallback from "@/components/TeamFlag";
import MatchClock from "@/components/MatchClock";
import MatchEventsTimeline from "@/components/MatchEventsTimeline";
import MatchEventChips from "@/components/MatchEventChips";
import MatchLineupPanel from "@/components/MatchLineupPanel";
import MatchSubsPanel from "@/components/MatchSubsPanel";
import MatchOfficialsPanel from "@/components/MatchOfficialsPanel";

type LiveMatchHeroProps = {
  match: Match;
  onKickoff?: () => void;
};

export default function LiveMatchHero({ match, onKickoff }: LiveMatchHeroProps) {
  const enriched = useMatchDetails(match, true);
  const score = formatScore(enriched.score);
  const meta = getMatchMetaForMatch(enriched);
  const coaches = getCoachInfo(enriched);
  const isLive = enriched.status === "live" || enriched.status === "halftime";

  return (
    <article className="mb-6 rounded-3xl border border-red-500/40 bg-gradient-to-br from-red-500/10 via-card to-navy p-5 md:p-8 shadow-lg shadow-red-500/10">
      <p className="text-center text-[10px] uppercase tracking-[0.35em] text-red-400 font-semibold mb-4">
        {enriched.stage} · {enriched.venue}
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6 mb-6">
        <div className="flex flex-col items-center text-center gap-2">
          <TeamFlagWithFallback code={enriched.home.code} name={enriched.home.name} size={80} />
          <h3 className="font-display text-xl md:text-3xl text-white leading-tight">
            {enriched.home.name}
          </h3>
          {coaches.homeCoach && (
            <p className="text-[10px] text-muted">{coaches.homeCoach}</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 min-w-[7rem]">
          <div className="font-display text-5xl md:text-7xl text-white tracking-wider">
            {score}
          </div>
          <MatchClock match={enriched} size="lg" onKickoff={onKickoff} />
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <TeamFlagWithFallback code={enriched.away.code} name={enriched.away.name} size={80} />
          <h3 className="font-display text-xl md:text-3xl text-white leading-tight">
            {enriched.away.name}
          </h3>
          {coaches.awayCoach && (
            <p className="text-[10px] text-muted">{coaches.awayCoach}</p>
          )}
        </div>
      </div>

      {(enriched.homeLineup || enriched.awayLineup || enriched.id.startsWith("af-")) && (
        <div className="mb-6 pt-6 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-pitch font-semibold mb-3 text-center">
            Starting XI & bench
          </p>
          <MatchLineupPanel match={enriched} />
        </div>
      )}

      <MatchEventChips match={enriched} />

      <MatchEventsTimeline match={enriched} expanded />

      {(isLive || enriched.homeSubs?.length || enriched.awaySubs?.length) && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-pitch font-semibold mb-3 text-center">
            Substitutions
          </p>
          <MatchSubsPanel match={enriched} meta={meta} />
        </div>
      )}

      {(meta || coaches.homeCoach || coaches.awayCoach) && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-pitch font-semibold mb-3 text-center">
            Officials & coaches
          </p>
          <MatchOfficialsPanel match={enriched} meta={meta} coaches={coaches} />
        </div>
      )}

      {enriched.detailUrl && (
        <div className="mt-4 text-center">
          <a
            href={enriched.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pitch hover:text-white transition-colors"
          >
            Full match report
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </article>
  );
}
