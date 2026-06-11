"use client";

import type { Match } from "@/lib/scores/types";
import { formatScore } from "@/lib/scores/types";
import TeamFlagWithFallback from "@/components/TeamFlag";
import MatchClock from "@/components/MatchClock";
import MatchEventsTimeline from "@/components/MatchEventsTimeline";

type LiveMatchHeroProps = {
  match: Match;
};

export default function LiveMatchHero({ match }: LiveMatchHeroProps) {
  const score = formatScore(match.score);

  return (
    <article className="mb-6 rounded-3xl border border-red-500/40 bg-gradient-to-br from-red-500/10 via-card to-navy p-5 md:p-8 shadow-lg shadow-red-500/10">
      <p className="text-center text-[10px] uppercase tracking-[0.35em] text-red-400 font-semibold mb-4">
        {match.stage} · {match.venue}
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6 mb-6">
        <div className="flex flex-col items-center text-center gap-2">
          <TeamFlagWithFallback code={match.home.code} name={match.home.name} size={80} />
          <h3 className="font-display text-xl md:text-3xl text-white leading-tight">
            {match.home.name}
          </h3>
        </div>

        <div className="flex flex-col items-center gap-2 min-w-[7rem]">
          <div className="font-display text-5xl md:text-7xl text-white tracking-wider">
            {score}
          </div>
          <MatchClock match={match} size="lg" />
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <TeamFlagWithFallback code={match.away.code} name={match.away.name} size={80} />
          <h3 className="font-display text-xl md:text-3xl text-white leading-tight">
            {match.away.name}
          </h3>
        </div>
      </div>

      <MatchEventsTimeline match={match} expanded />
    </article>
  );
}
