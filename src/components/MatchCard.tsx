"use client";

import { Clock, MapPin } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import { formatScore, isPreMatch } from "@/lib/scores/types";
import TeamFlagWithFallback from "@/components/TeamFlag";

function StatusBadge({ match }: { match: Match }) {
  const { status, minute } = match;
  if (status === "live")
    return (
      <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse">
        Live {minute}&apos;
      </span>
    );
  if (status === "halftime")
    return (
      <span className="inline-flex items-center gap-1 bg-gold/20 text-gold border border-gold/40 rounded px-2 py-0.5 text-[10px] font-bold uppercase">
        HT
      </span>
    );
  if (status === "finished")
    return (
      <span className="bg-white/10 text-muted border border-white/10 rounded px-2 py-0.5 text-[10px] font-bold uppercase">
        FT
      </span>
    );
  return (
    <span className="bg-pitch/10 text-pitch border border-pitch/30 rounded px-2 py-0.5 text-[10px] font-bold uppercase">
      {isPreMatch(match.score) ? "vs" : "Upcoming"}
    </span>
  );
}

type MatchCardProps = {
  match: Match;
  compact?: boolean;
  showCompetition?: boolean;
};

export default function MatchCard({ match, compact = true, showCompetition }: MatchCardProps) {
  const isLive = match.status === "live" || match.status === "halftime";
  const scoreDisplay = formatScore(match.score);

  return (
    <div
      className={`bg-card border rounded-xl transition-colors ${
        compact ? "p-3 md:p-4" : "p-5 md:p-6 rounded-2xl"
      } ${
        isLive
          ? "border-red-500/30 shadow-md shadow-red-500/5"
          : "border-white/10 hover:border-pitch/20"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusBadge match={match} />
          {showCompetition && match.competition === "friendly" && (
            <span className="text-[10px] text-gold/80 uppercase tracking-wider truncate">
              Friendly
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted uppercase tracking-wider truncate max-w-[50%] text-right">
          {match.stage}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
          <span className={`font-medium truncate ${compact ? "text-sm" : "text-base"}`}>
            {match.home.name}
          </span>
          <TeamFlagWithFallback code={match.home.code} name={match.home.name} size={compact ? 28 : 40} />
        </div>

        <div className="shrink-0 text-center px-2 min-w-[4.5rem]">
          <div
            className={`font-display tracking-wider text-white ${
              isPreMatch(match.score)
                ? "text-xl text-muted/60"
                : compact
                  ? "text-2xl"
                  : "text-4xl"
            }`}
          >
            {scoreDisplay}
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-muted mt-0.5">
            <Clock size={10} />
            <span>{match.date}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-2 min-w-0">
          <TeamFlagWithFallback code={match.away.code} name={match.away.name} size={compact ? 28 : 40} />
          <span className={`font-medium truncate ${compact ? "text-sm" : "text-base"}`}>
            {match.away.name}
          </span>
        </div>
      </div>

      {!compact && (
        <div className="flex items-center gap-2 mt-3 text-xs text-muted justify-center">
          <MapPin size={12} className="text-pitch" />
          {match.venue} · {match.city}
        </div>
      )}

      {match.events && match.events.length > 0 && !compact && (
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2 justify-center">
          {match.events.map((e, j) => (
            <span key={j} className="text-xs bg-white/5 rounded-full px-3 py-1 text-muted">
              {e.minute}&apos; ⚽ {e.player}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
