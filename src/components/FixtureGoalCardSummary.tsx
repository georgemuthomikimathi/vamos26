"use client";

import type { Match, MatchEvent } from "@/lib/scores/types";
import {
  getCardEvents,
  getDisplayEvents,
  getGoalEvents,
  hasCardEvents,
  TWO_YELLOWS_NOTE,
  type TeamCardCounts,
} from "@/lib/scores/card-events";
import { formatSubstitutionMinute } from "@/lib/timezone";

function eventIcon(event: MatchEvent): string {
  if (event.type === "goal" || event.type === "penalty") return "⚽";
  if (event.type === "red") return "🟥";
  if (event.type === "yellow") return "🟨";
  if (event.type === "subst") return "↔";
  return "•";
}

function formatMinute(minute: number, extraMinute?: number): string {
  return formatSubstitutionMinute(minute, extraMinute);
}

function eventSortKey(event: MatchEvent): number {
  const typeOrder: Record<string, number> = {
    goal: 0,
    penalty: 0,
    yellow: 1,
    red: 2,
    subst: 3,
  };
  return (
    event.minute * 100_000 +
    (event.extraMinute ?? 0) * 1_000 +
    (typeOrder[event.type] ?? 9)
  );
}

function subsToEvents(
  match: Match
): MatchEvent[] {
  const out: MatchEvent[] = [];
  for (const sub of match.homeSubs ?? []) {
    out.push({
      minute: sub.minute,
      extraMinute: sub.extraMinute,
      type: "subst",
      player: sub.playerIn,
      playerSecondary: sub.playerOut,
      team: "home",
      detail: "Sub",
    });
  }
  for (const sub of match.awaySubs ?? []) {
    out.push({
      minute: sub.minute,
      extraMinute: sub.extraMinute,
      type: "subst",
      player: sub.playerIn,
      playerSecondary: sub.playerOut,
      team: "away",
      detail: "Sub",
    });
  }
  return out;
}

function TeamCardBadges({ counts }: { counts: TeamCardCounts }) {
  if (counts.yellow === 0 && counts.red === 0) {
    return <span className="text-[9px] text-muted/40 tabular-nums">—</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-[9px] text-muted/80 tabular-nums">
      {counts.yellow > 0 && <span>🟨{counts.yellow}</span>}
      {counts.red > 0 && <span>🟥{counts.red}</span>}
    </span>
  );
}

function EventChip({
  event,
  code,
}: {
  event: MatchEvent;
  code: string;
}) {
  return (
    <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-1 text-muted inline-flex items-center gap-1 max-w-full">
      <span className="text-gold font-semibold tabular-nums shrink-0">
        {formatMinute(event.minute, event.extraMinute)}
      </span>
      <span className="truncate">
        {eventIcon(event)}{" "}
        {event.type === "subst" ? (
          <>
            {event.player}
            <span className="text-muted/50"> ← {event.playerSecondary}</span>
          </>
        ) : (
          event.player
        )}
      </span>
      {(event.type === "goal" || event.type === "penalty") && event.playerSecondary && (
        <span className="text-muted/60 shrink-0">({event.playerSecondary})</span>
      )}
      {event.detail === "Second yellow" && (
        <span className="text-muted/50 shrink-0">(2nd yellow)</span>
      )}
      <span className="text-muted/50 shrink-0">({code})</span>
    </span>
  );
}

function TeamEventColumn({
  side,
  code,
  items,
  cardCounts,
  align,
}: {
  side: "home" | "away";
  code: string;
  items: MatchEvent[];
  cardCounts: TeamCardCounts;
  align: "left" | "right";
}) {
  const teamItems = items
    .filter((e) => e.team === side)
    .sort((a, b) => eventSortKey(a) - eventSortKey(b));

  return (
    <div
      className={`flex flex-col gap-1.5 min-w-0 flex-1 ${
        align === "right" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 w-full ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <span className="text-[9px] uppercase tracking-wider text-muted/50 font-semibold truncate">
          {code}
        </span>
        <TeamCardBadges counts={cardCounts} />
      </div>
      {teamItems.length === 0 ? (
        <span className="text-[10px] text-muted/40">—</span>
      ) : (
        <div
          className={`flex flex-col gap-1 w-full ${
            align === "right" ? "items-end" : "items-start"
          }`}
        >
          {teamItems.map((event, i) => (
            <EventChip
              key={`${side}-${event.type}-${event.minute}-${event.player}-${i}`}
              event={event}
              code={code}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type FixtureGoalCardSummaryProps = {
  match: Match;
  homeCards: TeamCardCounts;
  awayCards: TeamCardCounts;
  className?: string;
};

/** Uniform goals, cards & subs strip for every finished fixture. */
export default function FixtureGoalCardSummary({
  match,
  homeCards,
  awayCards,
  className = "",
}: FixtureGoalCardSummaryProps) {
  const displayEvents = getDisplayEvents(match.events ?? []);
  const goals = getGoalEvents(displayEvents);
  const cards = getCardEvents(displayEvents);
  const subs = subsToEvents(match);
  const timeline = [...goals, ...cards, ...subs].sort(
    (a, b) => eventSortKey(a) - eventSortKey(b)
  );

  const homeCode = match.home.code.toUpperCase();
  const awayCode = match.away.code.toUpperCase();
  const showCardNote = hasCardEvents(match.events);

  if (timeline.length === 0) {
    return (
      <p className={`text-[10px] text-muted/60 text-center ${className}`}>
        No match events recorded
      </p>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start gap-3">
        <TeamEventColumn
          side="home"
          code={homeCode}
          items={timeline}
          cardCounts={homeCards}
          align="left"
        />
        <div className="shrink-0 pt-0.5 text-center">
          <span className="text-[9px] uppercase tracking-wider text-muted/40 font-semibold block">
            Match
          </span>
          <span className="text-[9px] uppercase tracking-wider text-muted/40 font-semibold block">
            events
          </span>
        </div>
        <TeamEventColumn
          side="away"
          code={awayCode}
          items={timeline}
          cardCounts={awayCards}
          align="right"
        />
      </div>
      {showCardNote && (
        <p className="text-[9px] text-muted/50 text-center">{TWO_YELLOWS_NOTE}</p>
      )}
    </div>
  );
}

export { TeamCardBadges };
