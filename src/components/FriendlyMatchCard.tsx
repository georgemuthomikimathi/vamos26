"use client";

import { useState } from "react";
import { Clock, MapPin, ChevronDown, Users } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import { formatScore, isPreMatch } from "@/lib/scores/types";
import { getSquad } from "@/lib/squads";
import TeamFlagWithFallback from "@/components/TeamFlag";
import FriendlyLineup from "@/components/FriendlyLineup";

type Tab = "summary" | "lineups";

function StatusBadge({ match }: { match: Match }) {
  const { status, minute } = match;
  if (status === "live")
    return (
      <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse">
        Live {minute}&apos;
      </span>
    );
  if (status === "finished")
    return (
      <span className="bg-white/10 text-muted border border-white/10 rounded px-2 py-0.5 text-[10px] font-bold uppercase">
        FT
      </span>
    );
  return (
    <span className="bg-gold/10 text-gold border border-gold/30 rounded px-2 py-0.5 text-[10px] font-bold uppercase">
      Upcoming
    </span>
  );
}

type FriendlyMatchCardProps = {
  match: Match;
  defaultExpanded?: boolean;
};

export default function FriendlyMatchCard({ match, defaultExpanded = false }: FriendlyMatchCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [tab, setTab] = useState<Tab>("summary");
  const [focusTeam, setFocusTeam] = useState<"home" | "away" | null>(null);

  const homeSquad = getSquad(match.home.code);
  const awaySquad = getSquad(match.away.code);
  const scoreDisplay = formatScore(match.score);
  const hasLineups = Boolean(homeSquad && awaySquad);

  return (
    <article
      className={`bg-card border rounded-2xl transition-all ${
        expanded ? "border-gold/30 shadow-lg shadow-gold/5" : "border-white/10 hover:border-gold/20"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full text-left p-4 focus-ring rounded-2xl"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge match={match} />
          <div className="flex items-center gap-1">
            {hasLineups && (
              <span className="text-[10px] text-pitch/80 flex items-center gap-1">
                <Users size={10} />
                Lineups
              </span>
            )}
            <ChevronDown
              size={16}
              className={`text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFocusTeam((t) => (t === "home" ? null : "home"));
              setExpanded(true);
              setTab("lineups");
            }}
            className="flex-1 flex items-center gap-2 min-w-0 justify-end hover:opacity-80 transition-opacity"
          >
            <span className="font-medium text-sm truncate">{match.home.name}</span>
            <TeamFlagWithFallback code={match.home.code} name={match.home.name} size={32} />
          </button>

          <div className="shrink-0 text-center px-2 min-w-[4.5rem]">
            <div
              className={`font-display tracking-wider ${
                isPreMatch(match.score) ? "text-xl text-muted/60" : "text-3xl text-white"
              }`}
            >
              {scoreDisplay}
            </div>
            <div className="flex items-center justify-center gap-1 text-[10px] text-muted mt-0.5">
              <Clock size={10} />
              {match.date}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFocusTeam((t) => (t === "away" ? null : "away"));
              setExpanded(true);
              setTab("lineups");
            }}
            className="flex-1 flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
          >
            <TeamFlagWithFallback code={match.away.code} name={match.away.name} size={32} />
            <span className="font-medium text-sm truncate">{match.away.name}</span>
          </button>
        </div>

        {!expanded && (
          <p className="text-[10px] text-muted/60 text-center mt-2">
            Tap for goals, venue & projected lineups
          </p>
        )}
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 border-t border-white/10">
            <div className="flex gap-1 mt-3 mb-3">
              {(["summary", "lineups"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  disabled={t === "lineups" && !hasLineups}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${
                    tab === t
                      ? "bg-gold/15 border-gold/40 text-gold"
                      : "border-white/10 text-muted hover:text-white disabled:opacity-40"
                  }`}
                >
                  {t === "summary" ? "Match" : "Lineups"}
                </button>
              ))}
            </div>

            {tab === "summary" && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-gold" />
                    {match.time}
                  </span>
                  <span className="flex items-center gap-1 min-w-0">
                    <MapPin size={12} className="text-gold shrink-0" />
                    <span className="truncate">
                      {match.venue} · {match.city}
                    </span>
                  </span>
                </div>

                {match.events && match.events.length > 0 ? (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted mb-2">Goal scorers</p>
                    <div className="flex flex-wrap gap-2">
                      {match.events.map((e, j) => (
                        <span
                          key={j}
                          className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-muted"
                        >
                          {e.minute}&apos; ⚽ {e.player}
                          <span className="text-pitch/70 ml-1">
                            ({e.team === "home" ? match.home.name : match.away.name})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted bg-white/5 rounded-lg px-3 py-2">
                    Projected XI available — switch to Lineups tab for both squads.
                  </p>
                )}
              </div>
            )}

            {tab === "lineups" && hasLineups && homeSquad && awaySquad && (
              <div className="grid sm:grid-cols-2 gap-3">
                <FriendlyLineup
                  squad={homeSquad}
                  highlight={focusTeam === "home"}
                />
                <FriendlyLineup
                  squad={awaySquad}
                  highlight={focusTeam === "away"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
