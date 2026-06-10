"use client";

import { useState } from "react";
import { Clock, MapPin, ChevronDown } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import { formatScore, isPreMatch } from "@/lib/scores/types";
import { getMatchMeta } from "@/lib/match-meta";
import TeamFlagWithFallback from "@/components/TeamFlag";
import MatchOfficialsPanel from "@/components/MatchOfficialsPanel";
import MatchSubsPanel from "@/components/MatchSubsPanel";

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

type DetailTab = "info" | "subs" | "officials";

export default function MatchCard({ match, compact = true, showCompetition }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>("info");
  const isLive = match.status === "live" || match.status === "halftime";
  const scoreDisplay = formatScore(match.score);
  const meta = getMatchMeta(match.id);
  const hasDetails =
    Boolean(match.venue) ||
    Boolean(match.time) ||
    (match.events && match.events.length > 0) ||
    Boolean(meta);

  return (
    <article
      className={`bg-card border rounded-xl transition-all ${
        compact ? "p-3 md:p-4" : "p-5 md:p-6 rounded-2xl"
      } ${
        isLive
          ? "border-red-500/30 shadow-md shadow-red-500/5"
          : expanded
            ? "border-pitch/30 shadow-md shadow-pitch/5"
            : "border-white/10 hover:border-pitch/20"
      }`}
    >
      <button
        type="button"
        onClick={() => hasDetails && setExpanded((v) => !v)}
        aria-expanded={hasDetails ? expanded : undefined}
        className={`w-full text-left focus-ring rounded-lg ${hasDetails ? "cursor-pointer" : "cursor-default"}`}
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
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[10px] text-muted uppercase tracking-wider truncate max-w-[8rem] sm:max-w-none text-right">
              {match.stage}
            </span>
            {hasDetails && (
              <ChevronDown
                size={14}
                className={`text-muted shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            )}
          </div>
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

        {!expanded && hasDetails && (
          <p className="text-[10px] text-muted/60 text-center mt-2">Tap for kickoff, venue & goals</p>
        )}
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-3 border-t border-white/10 space-y-3">
            {meta && (
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    { id: "info" as const, label: "Info" },
                    { id: "subs" as const, label: "Subs" },
                    { id: "officials" as const, label: "Officials" },
                  ] as const
                ).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailTab(id);
                    }}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border transition-colors ${
                      detailTab === id
                        ? "bg-pitch/15 border-pitch/40 text-pitch"
                        : "border-white/10 text-muted hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {detailTab === "info" && (
              <>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-pitch" />
                    {match.time}
                  </span>
                  <span className="flex items-center gap-1 min-w-0">
                    <MapPin size={12} className="text-pitch shrink-0" />
                    <span className="truncate">
                      {match.venue} · {match.city}
                    </span>
                  </span>
                </div>

                {match.events && match.events.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {match.events.map((e, j) => (
                      <span
                        key={j}
                        className="text-xs bg-white/5 rounded-full px-3 py-1.5 text-muted"
                      >
                        {e.minute}&apos; ⚽ {e.player}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {detailTab === "subs" && meta && (
              <MatchSubsPanel match={match} meta={meta} />
            )}

            {detailTab === "officials" && meta && (
              <MatchOfficialsPanel match={match} meta={meta} />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
