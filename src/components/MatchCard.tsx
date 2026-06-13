"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import {
  formatScore,
  formatLiveClock,
  liveClockSyncKey,
  isPreMatch,
} from "@/lib/scores/types";
import { attachLineupsToMatch } from "@/lib/scores/lineups";
import { getMatchMeta, getCoachInfo } from "@/lib/match-meta";
import TeamFlagWithFallback from "@/components/TeamFlag";
import MatchOfficialsPanel from "@/components/MatchOfficialsPanel";
import MatchSubsPanel from "@/components/MatchSubsPanel";
import MatchLineupPanel from "@/components/MatchLineupPanel";
import MatchClock from "@/components/MatchClock";
import MatchEventsTimeline from "@/components/MatchEventsTimeline";

function StatusBadge({ match }: { match: Match }) {
  const [now, setNow] = useState(() => Date.now());
  const syncAtRef = useRef(Date.now());
  const syncKeyRef = useRef(liveClockSyncKey(match));

  useEffect(() => {
    if (match.status !== "live" && match.status !== "halftime") return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [match.status]);

  useEffect(() => {
    const key = liveClockSyncKey(match);
    if (key !== syncKeyRef.current) {
      syncKeyRef.current = key;
      syncAtRef.current = Date.now();
    }
  }, [match]);

  const { status } = match;
  if (status === "live")
    return (
      <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/40 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider animate-pulse">
        Live {formatLiveClock(match, syncAtRef.current, now)}
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
  animateScore?: boolean;
  onKickoff?: () => void;
};

type DetailTab = "info" | "lineups" | "subs" | "events" | "officials";

function defaultDetailTab(isLive: boolean, hasLineups: boolean): DetailTab {
  if (hasLineups) return "lineups";
  if (isLive) return "events";
  return "info";
}

export default function MatchCard({
  match,
  compact = true,
  animateScore = false,
  onKickoff,
}: MatchCardProps) {
  const enriched = attachLineupsToMatch(match);
  const isLive = enriched.status === "live" || enriched.status === "halftime";
  const hasLineups = Boolean(enriched.homeLineup || enriched.awayLineup);
  const [expanded, setExpanded] = useState(isLive);
  const [detailTab, setDetailTab] = useState<DetailTab>(() =>
    defaultDetailTab(isLive, hasLineups)
  );

  useEffect(() => {
    if (isLive) {
      setExpanded(true);
      setDetailTab(defaultDetailTab(true, hasLineups));
    }
  }, [isLive, enriched.id, hasLineups]);

  const scoreDisplay = formatScore(enriched.score);
  const meta = getMatchMeta(enriched.id);
  const coaches = getCoachInfo(enriched);
  const hasCoaches = Boolean(coaches.homeCoach || coaches.awayCoach);
  const hasSubs = Boolean(enriched.homeSubs?.length || enriched.awaySubs?.length);
  const hasEvents = Boolean(enriched.events?.length);
  const hasDetails =
    Boolean(match.venue) ||
    Boolean(match.time) ||
    hasEvents ||
    hasSubs ||
    hasLineups ||
    hasCoaches ||
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
            <StatusBadge match={enriched} />
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[10px] text-muted uppercase tracking-wider truncate max-w-[8rem] sm:max-w-none text-right">
              {enriched.stage}
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
              {enriched.home.name}
            </span>
            <TeamFlagWithFallback code={enriched.home.code} name={enriched.home.name} size={compact ? 28 : 40} />
          </div>

          <div className="shrink-0 text-center px-2 min-w-[5rem]">
            {animateScore && isLive ? (
              <motion.div
                key={scoreDisplay}
                initial={{ scale: 1.15, color: "#f87171" }}
                animate={{ scale: 1, color: "#ffffff" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className={`font-display tracking-wider ${
                  isPreMatch(enriched.score)
                    ? "text-xl text-muted/60"
                    : compact
                      ? "text-2xl"
                      : "text-4xl"
                }`}
              >
                {scoreDisplay}
              </motion.div>
            ) : (
              <div
                className={`font-display tracking-wider text-white ${
                  isPreMatch(enriched.score)
                    ? "text-xl text-muted/60"
                    : compact
                      ? "text-2xl"
                      : "text-4xl"
                }`}
              >
                {scoreDisplay}
              </div>
            )}
            <MatchClock match={enriched} size="sm" onKickoff={onKickoff} />
          </div>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <TeamFlagWithFallback code={enriched.away.code} name={enriched.away.name} size={compact ? 28 : 40} />
            <span className={`font-medium truncate ${compact ? "text-sm" : "text-base"}`}>
              {enriched.away.name}
            </span>
          </div>
        </div>

        {isLive && !expanded && <MatchEventsTimeline match={enriched} limit={3} />}

        {!expanded && hasDetails && !isLive && (
          <p className="text-[10px] text-muted/60 text-center mt-2">Tap for events, subs & venue</p>
        )}
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex flex-wrap gap-1">
              {(
                [
                  { id: "events" as const, label: "Events", show: hasEvents || isLive },
                  { id: "lineups" as const, label: "Lineups", show: hasLineups },
                  { id: "subs" as const, label: "Subs", show: hasSubs || Boolean(meta) },
                  { id: "info" as const, label: "Info", show: true },
                  { id: "officials" as const, label: "Officials", show: Boolean(meta) || hasCoaches },
                ] as const
              )
                .filter((t) => t.show)
                .map(({ id, label }) => (
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

            {detailTab === "events" && (
              <MatchEventsTimeline match={enriched} expanded />
            )}

            {detailTab === "lineups" && hasLineups && (
              <MatchLineupPanel match={enriched} />
            )}

            {detailTab === "info" && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span>{enriched.time}</span>
                <span className="flex items-center gap-1 min-w-0">
                  <MapPin size={12} className="text-pitch shrink-0" />
                  <span className="truncate">
                    {enriched.venue} · {enriched.city}
                  </span>
                </span>
              </div>
            )}

            {detailTab === "subs" && (meta || hasSubs) && (
              <MatchSubsPanel match={enriched} meta={meta} />
            )}

            {detailTab === "subs" && !hasSubs && !meta && (
              <p className="text-xs text-muted text-center py-2">No substitutions recorded yet.</p>
            )}

            {detailTab === "officials" && (meta || hasCoaches) && (
              <MatchOfficialsPanel match={enriched} meta={meta} coaches={coaches} />
            )}

            {enriched.detailUrl && detailTab === "info" && (
              <a
                href={enriched.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-xs text-pitch hover:text-white transition-colors"
              >
                Full match report →
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
