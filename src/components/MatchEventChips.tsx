"use client";

import type { Match, MatchEvent } from "@/lib/scores/types";
import { getDisplayEvents } from "@/lib/scores/card-events";
import { enrichMatchFromMeta } from "@/lib/scores/enrich-from-meta";
import { formatSubstitutionMinute } from "@/lib/timezone";

function eventIcon(event: MatchEvent): string {
  if (event.type === "goal" || event.type === "penalty") return "⚽";
  if (event.type === "red") return "🟥";
  if (event.type === "yellow") return "🟨";
  return "•";
}

function formatMinute(minute: number, extraMinute?: number): string {
  return formatSubstitutionMinute(minute, extraMinute);
}

type MatchEventChipsProps = {
  match: Match;
  maxGoals?: number;
  maxCards?: number;
  maxSubs?: number;
};

/** Inline goal, card & sub chips — visible on live and finished cards without expanding. */
export default function MatchEventChips({
  match,
  maxGoals = 8,
  maxCards = 6,
  maxSubs = 4,
}: MatchEventChipsProps) {
  const enriched = enrichMatchFromMeta(match);
  const displayEvents = getDisplayEvents(enriched.events ?? []);
  const goals = displayEvents.filter((e) => e.type === "goal" || e.type === "penalty");
  const cards = displayEvents.filter((e) => e.type === "yellow" || e.type === "red");
  const allSubs = [
    ...(enriched.homeSubs ?? []).map((s) => ({ ...s, side: enriched.home.code.toUpperCase() })),
    ...(enriched.awaySubs ?? []).map((s) => ({ ...s, side: enriched.away.code.toUpperCase() })),
  ];

  if (goals.length === 0 && cards.length === 0 && allSubs.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-1.5">
      {goals.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {goals.slice(0, maxGoals).map((g, i) => (
            <span
              key={`g-${g.minute}-${g.player}-${i}`}
              className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-muted"
            >
              <span className="text-gold font-semibold">{formatMinute(g.minute, g.extraMinute)}</span>{" "}
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
        <div className="flex flex-wrap gap-1 justify-center">
          {cards.slice(0, maxCards).map((c, i) => (
            <span
              key={`c-${c.minute}-${c.player}-${i}`}
              className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-muted"
            >
              <span className="text-gold font-semibold">{formatMinute(c.minute, c.extraMinute)}</span>{" "}
              {eventIcon(c)} {c.player}
              {c.detail === "Second yellow" && (
                <span className="text-muted/50"> (2nd yellow)</span>
              )}
            </span>
          ))}
          {allSubs.slice(0, maxSubs).map((s, i) => (
            <span
              key={`s-${s.minute}-${s.playerIn}-${i}`}
              className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-muted"
            >
              <span className="text-gold font-semibold">
                {formatSubstitutionMinute(s.minute, s.extraMinute)}
              </span>{" "}
              Sub: {s.playerOut} → {s.playerIn}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
