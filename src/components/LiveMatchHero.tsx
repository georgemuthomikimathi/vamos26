"use client";

import type { Match } from "@/lib/scores/types";
import { formatScore } from "@/lib/scores/types";
import { useMatchDetails } from "@/hooks/useMatchDetails";
import { pickMatchMvp } from "@/lib/scores/match-mvp";
import TeamFlagWithFallback from "@/components/TeamFlag";
import MatchClock from "@/components/MatchClock";
import MatchEventChips from "@/components/MatchEventChips";

type LiveMatchHeroProps = {
  match: Match;
  onKickoff?: () => void;
};

export default function LiveMatchHero({ match, onKickoff }: LiveMatchHeroProps) {
  const enriched = useMatchDetails(match, true);
  const score = formatScore(enriched.score);
  const mvp = pickMatchMvp(enriched);
  const goals = (enriched.events ?? []).filter(
    (e) => e.type === "goal" || e.type === "penalty"
  );

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
        </div>
      </div>

      {goals.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-pitch font-semibold mb-3 text-center">
            Goal scorers
          </p>
          <MatchEventChips match={enriched} maxGoals={12} maxCards={6} maxSubs={0} />
        </div>
      )}

      {mvp && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-2">
            Man of the match
          </p>
          <div className="inline-flex items-center gap-3 bg-white/5 border border-gold/30 rounded-2xl px-4 py-3">
            <TeamFlagWithFallback code={mvp.teamCode} name={mvp.teamName} size={32} />
            <div className="text-left">
              <p className="font-semibold text-white">{mvp.name}</p>
              <p className="text-[10px] text-muted">
                {mvp.goals > 0 && `${mvp.goals} goal${mvp.goals > 1 ? "s" : ""}`}
                {mvp.goals > 0 && mvp.assists > 0 && " · "}
                {mvp.assists > 0 && `${mvp.assists} assist${mvp.assists > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
