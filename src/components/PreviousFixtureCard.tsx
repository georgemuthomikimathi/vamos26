"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, MapPin, Users } from "lucide-react";
import type { Match, MatchEvent } from "@/lib/scores/types";
import { formatScore } from "@/lib/scores/types";
import { getDisplayEvents } from "@/lib/scores/card-events";
import { attachLineupsToMatch } from "@/lib/scores/lineups";
import { getMatchMetaForMatch, getCoachInfo } from "@/lib/match-meta";
import TeamFlagWithFallback from "@/components/TeamFlag";
import MatchEventsTimeline from "@/components/MatchEventsTimeline";
import MatchLineupPanel from "@/components/MatchLineupPanel";
import MatchSubsPanel from "@/components/MatchSubsPanel";
import MatchOfficialsPanel from "@/components/MatchOfficialsPanel";
import { formatSubstitutionMinute } from "@/lib/timezone";

function formatGoalMinute(minute: number, extraMinute?: number): string {
  return formatSubstitutionMinute(minute, extraMinute);
}

type PreviousFixtureCardProps = {
  match: Match;
  defaultExpanded?: boolean;
};

function eventIcon(event: MatchEvent): string {
  if (event.type === "goal" || event.type === "penalty") return "⚽";
  if (event.type === "red") return "🟥";
  if (event.type === "yellow") return "🟨";
  return "•";
}

export default function PreviousFixtureCard({
  match,
  defaultExpanded = false,
}: PreviousFixtureCardProps) {
  const enriched = attachLineupsToMatch(match);
  const meta = getMatchMetaForMatch(enriched);
  const coaches = getCoachInfo(enriched);
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (defaultExpanded) setExpanded(true);
  }, [defaultExpanded]);

  const displayEvents = getDisplayEvents(enriched.events ?? []);
  const goals = displayEvents.filter(
    (e) => e.type === "goal" || e.type === "penalty"
  );
  const cards = displayEvents.filter(
    (e) => e.type === "red" || e.type === "yellow"
  );
  const allSubs = [
    ...(enriched.homeSubs ?? []).map((s) => ({ ...s, side: enriched.home.name })),
    ...(enriched.awaySubs ?? []).map((s) => ({ ...s, side: enriched.away.name })),
  ];
  const scoreDisplay = formatScore(enriched.score);

  const toggle = () => setExpanded((v) => !v);

  return (
    <article
      className={`bg-card border rounded-xl transition-all ${
        expanded
          ? "border-pitch/30 shadow-md shadow-pitch/5"
          : "border-white/10 hover:border-pitch/20"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        aria-expanded={expanded}
        className="w-full text-left focus-ring rounded-xl p-3 md:p-4 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-white/10 text-muted border border-white/10 rounded px-2 py-0.5 text-[10px] font-bold uppercase">
              FT
            </span>
            <span className="text-[10px] text-muted truncate">{enriched.date} · {enriched.time}</span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[10px] text-muted uppercase tracking-wider truncate max-w-[8rem] sm:max-w-none text-right">
              {enriched.stage}
            </span>
            <ChevronDown
              size={14}
              className={`text-muted shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex flex-col items-end gap-0.5 min-w-0">
            <div className="flex items-center gap-2 justify-end w-full">
              <span className="font-medium truncate text-sm">{enriched.home.name}</span>
              <TeamFlagWithFallback code={enriched.home.code} name={enriched.home.name} size={28} />
            </div>
            {coaches.homeCoach && (
              <span className="text-[10px] text-muted/70 truncate max-w-full">{coaches.homeCoach}</span>
            )}
          </div>

          <div className="shrink-0 text-center px-2 min-w-[5rem]">
            <div className="font-display tracking-wider text-white text-2xl">{scoreDisplay}</div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Full time</p>
          </div>

          <div className="flex-1 flex flex-col items-start gap-0.5 min-w-0">
            <div className="flex items-center gap-2 w-full">
              <TeamFlagWithFallback code={enriched.away.code} name={enriched.away.name} size={28} />
              <span className="font-medium truncate text-sm">{enriched.away.name}</span>
            </div>
            {coaches.awayCoach && (
              <span className="text-[10px] text-muted/70 truncate max-w-full">{coaches.awayCoach}</span>
            )}
          </div>
        </div>

        {!expanded && (
          <div className="mt-3 space-y-2">
            {goals.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {goals.map((g, i) => (
                  <span
                    key={`${g.minute}-${g.player}-${i}`}
                    className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-1 text-muted"
                  >
                    <span className="text-gold font-semibold">{formatGoalMinute(g.minute, g.extraMinute)}</span>{" "}
                    {eventIcon(g)} {g.player}
                    {g.playerSecondary && (
                      <span className="text-muted/60"> ({g.playerSecondary})</span>
                    )}
                    <span className="text-muted/50 ml-1">
                      ({g.team === "home" ? enriched.home.code.toUpperCase() : enriched.away.code.toUpperCase()})
                    </span>
                  </span>
                ))}
              </div>
            )}

            {(cards.length > 0 || allSubs.length > 0) && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {cards.map((c, i) => (
                  <span
                    key={`${c.minute}-${c.player}-${i}`}
                    className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-1 text-muted"
                  >
                    <span className="text-gold font-semibold">{formatGoalMinute(c.minute, c.extraMinute)}</span>{" "}
                    {eventIcon(c)} {c.player}
                    {c.detail === "Second yellow" && (
                      <span className="text-muted/50"> (2nd yellow)</span>
                    )}
                  </span>
                ))}
                {allSubs.slice(0, 6).map((s, i) => (
                  <span
                    key={`${s.minute}-${s.playerIn}-${i}`}
                    className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-1 text-muted"
                  >
                    <span className="text-gold font-semibold">
                      {formatSubstitutionMinute(s.minute, s.extraMinute)}
                    </span>{" "}
                    Sub: {s.playerOut} → {s.playerIn}
                  </span>
                ))}
                {allSubs.length > 6 && (
                  <span className="text-[10px] text-muted/60 px-2 py-1">
                    +{allSubs.length - 6} more subs
                  </span>
                )}
              </div>
            )}

            <p className="text-[10px] text-muted/60 text-center flex items-center justify-center gap-1">
              <MapPin size={10} className="text-pitch" />
              {enriched.venue}
            </p>
            <p className="text-[10px] text-pitch font-semibold text-center flex items-center justify-center gap-1">
              View match events & squads
              <ChevronDown size={12} />
            </p>
          </div>
        )}
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3 md:px-4 pb-4 pt-0 border-t border-white/10 mx-3 md:mx-4 space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted pt-3">
              <span>{enriched.date} · {enriched.time} ET</span>
              <span className="flex items-center gap-1 min-w-0">
                <MapPin size={12} className="text-pitch shrink-0" />
                <span className="truncate font-medium text-white/90">
                  {enriched.venue}
                </span>
                <span className="text-muted">· {enriched.city}</span>
              </span>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-pitch mb-2 flex items-center gap-1.5">
                <Users size={12} />
                Full squads · starting XI & bench
              </p>
              <MatchLineupPanel match={enriched} />
            </div>

            <MatchOfficialsPanel match={enriched} meta={meta} coaches={coaches} />

            <div>
              <p className="text-[10px] uppercase tracking-wider text-pitch mb-2">
                Match timeline
              </p>
              <MatchEventsTimeline match={enriched} expanded />
            </div>

            <MatchSubsPanel match={enriched} meta={meta} />

            {enriched.detailUrl && (
              <a
                href={enriched.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-pitch hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Full match report on FIFA.com
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
