"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import { formatScore } from "@/lib/scores/types";
import { attachLineupsToMatch } from "@/lib/scores/lineups";
import { getMatchMeta } from "@/lib/match-meta";
import TeamFlagWithFallback from "@/components/TeamFlag";
import MatchEventsTimeline from "@/components/MatchEventsTimeline";
import MatchSubsPanel from "@/components/MatchSubsPanel";
import MatchOfficialsPanel from "@/components/MatchOfficialsPanel";
import { formatSubstitutionMinute } from "@/lib/timezone";

type PreviousFixtureCardProps = {
  match: Match;
  defaultExpanded?: boolean;
};

function eventIcon(type: string): string {
  if (type === "goal" || type === "penalty") return "⚽";
  if (type === "red") return "🟥";
  if (type === "yellow") return "🟨";
  return "•";
}

export default function PreviousFixtureCard({
  match,
  defaultExpanded = false,
}: PreviousFixtureCardProps) {
  const enriched = attachLineupsToMatch(match);
  const meta = getMatchMeta(enriched.id);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const goals = (enriched.events ?? []).filter(
    (e) => e.type === "goal" || e.type === "penalty"
  );
  const cards = (enriched.events ?? []).filter(
    (e) => e.type === "red" || e.type === "yellow"
  );
  const allSubs = [
    ...(enriched.homeSubs ?? []).map((s) => ({ ...s, side: enriched.home.name })),
    ...(enriched.awaySubs ?? []).map((s) => ({ ...s, side: enriched.away.name })),
  ];
  const scoreDisplay = formatScore(enriched.score);

  return (
    <article
      className={`bg-card border rounded-xl transition-all ${
        expanded
          ? "border-pitch/30 shadow-md shadow-pitch/5"
          : "border-white/10 hover:border-pitch/20"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
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
          <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
            <span className="font-medium truncate text-sm">{enriched.home.name}</span>
            <TeamFlagWithFallback code={enriched.home.code} name={enriched.home.name} size={28} />
          </div>

          <div className="shrink-0 text-center px-2 min-w-[5rem]">
            <div className="font-display tracking-wider text-white text-2xl">{scoreDisplay}</div>
            <p className="text-[10px] text-muted uppercase tracking-wider">Full time</p>
          </div>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <TeamFlagWithFallback code={enriched.away.code} name={enriched.away.name} size={28} />
            <span className="font-medium truncate text-sm">{enriched.away.name}</span>
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
                    <span className="text-gold font-semibold">{g.minute}&apos;</span>{" "}
                    {eventIcon(g.type)} {g.player}
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
                    <span className="text-gold font-semibold">{c.minute}&apos;</span>{" "}
                    {eventIcon(c.type)} {c.player}
                  </span>
                ))}
                {allSubs.slice(0, 4).map((s, i) => (
                  <span
                    key={`${s.minute}-${s.playerIn}-${i}`}
                    className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-1 text-muted"
                  >
                    <span className="text-gold font-semibold">
                      {formatSubstitutionMinute(s.minute, s.extraMinute)}
                    </span>{" "}
                    ↔ {s.playerOut} → {s.playerIn}
                  </span>
                ))}
                {allSubs.length > 4 && (
                  <span className="text-[10px] text-muted/60 self-center">
                    +{allSubs.length - 4} more subs
                  </span>
                )}
              </div>
            )}

            <p className="text-[10px] text-muted/60 text-center">
              Tap for full timeline · {enriched.venue}
            </p>
          </div>
        )}
      </button>

      <motion.div
        initial={false}
        animate={{
          height: expanded ? "auto" : 0,
          opacity: expanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div className="px-3 md:px-4 pb-4 pt-0 border-t border-white/10 mx-3 md:mx-4 space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted pt-3">
            <span>{enriched.date} · {enriched.time} ET</span>
            <span className="flex items-center gap-1 min-w-0">
              <MapPin size={12} className="text-pitch shrink-0" />
              <span className="truncate">
                {enriched.venue} · {enriched.city}
              </span>
            </span>
          </div>

          <MatchEventsTimeline match={enriched} expanded />

          {(enriched.homeSubs?.length || enriched.awaySubs?.length) ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {enriched.homeSubs && enriched.homeSubs.length > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-[10px] uppercase tracking-wider text-pitch mb-2">
                    {enriched.home.name} subs
                  </p>
                  <ul className="space-y-1 text-xs text-muted">
                    {enriched.homeSubs.map((s, i) => (
                      <li key={i}>
                        <span className="text-gold font-semibold">
                          {formatSubstitutionMinute(s.minute, s.extraMinute)}
                        </span>{" "}
                        Sub: {s.playerOut}
                        <span className="text-muted/60"> → </span>
                        <span className="text-pitch">{s.playerIn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {enriched.awaySubs && enriched.awaySubs.length > 0 && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-[10px] uppercase tracking-wider text-pitch mb-2">
                    {enriched.away.name} subs
                  </p>
                  <ul className="space-y-1 text-xs text-muted">
                    {enriched.awaySubs.map((s, i) => (
                      <li key={i}>
                        <span className="text-gold font-semibold">
                          {formatSubstitutionMinute(s.minute, s.extraMinute)}
                        </span>{" "}
                        Sub: {s.playerOut}
                        <span className="text-muted/60"> → </span>
                        <span className="text-pitch">{s.playerIn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : meta ? (
            <MatchSubsPanel match={enriched} meta={meta} />
          ) : null}

          {meta && <MatchOfficialsPanel match={enriched} meta={meta} />}
        </div>
      </motion.div>
    </article>
  );
}
