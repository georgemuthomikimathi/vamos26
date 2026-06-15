"use client";

import type { Match, MatchEvent } from "@/lib/scores/types";
import {
  getCardEvents,
  getGoalEvents,
  type TeamCardCounts,
} from "@/lib/scores/card-events";
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
    <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-1 text-muted inline-flex items-center gap-1">
      <span className="text-gold font-semibold tabular-nums">
        {formatMinute(event.minute, event.extraMinute)}
      </span>
      <span>
        {eventIcon(event)} {event.player}
      </span>
      {(event.type === "goal" || event.type === "penalty") && event.playerSecondary && (
        <span className="text-muted/60">({event.playerSecondary})</span>
      )}
      {event.detail === "Second yellow" && (
        <span className="text-muted/50">(2nd yellow)</span>
      )}
      <span className="text-muted/50">({code})</span>
    </span>
  );
}

function TeamEventColumn({
  side,
  code,
  goals,
  cards,
  cardCounts,
  align,
}: {
  side: "home" | "away";
  code: string;
  goals: MatchEvent[];
  cards: MatchEvent[];
  cardCounts: TeamCardCounts;
  align: "left" | "right";
}) {
  const teamGoals = goals.filter((e) => e.team === side);
  const teamCards = cards.filter((e) => e.team === side);
  const items = [...teamGoals, ...teamCards].sort(
    (a, b) => eventSortKey(a) - eventSortKey(b)
  );

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
      {items.length === 0 ? (
        <span className="text-[10px] text-muted/40">—</span>
      ) : (
        <div
          className={`flex flex-col gap-1 w-full ${
            align === "right" ? "items-end" : "items-start"
          }`}
        >
          {items.map((event, i) => (
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

function eventSortKey(event: MatchEvent): number {
  const typeOrder: Record<string, number> = {
    goal: 0,
    penalty: 0,
    yellow: 1,
    red: 2,
  };
  return (
    event.minute * 100_000 +
    (event.extraMinute ?? 0) * 1_000 +
    (typeOrder[event.type] ?? 9)
  );
}

type FixtureGoalCardSummaryProps = {
  match: Match;
  homeCards: TeamCardCounts;
  awayCards: TeamCardCounts;
  className?: string;
};

/** Uniform goals + cards strip for finished matches (no subs). */
export default function FixtureGoalCardSummary({
  match,
  homeCards,
  awayCards,
  className = "",
}: FixtureGoalCardSummaryProps) {
  const goals = getGoalEvents(match.events);
  const cards = getCardEvents(match.events);
  const homeCode = match.home.code.toUpperCase();
  const awayCode = match.away.code.toUpperCase();

  if (goals.length === 0 && cards.length === 0) {
    return (
      <p className={`text-[10px] text-muted/60 text-center ${className}`}>
        No goal or card events recorded
      </p>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start gap-3">
        <TeamEventColumn
          side="home"
          code={homeCode}
          goals={goals}
          cards={cards}
          cardCounts={homeCards}
          align="left"
        />
        <div className="shrink-0 pt-0.5">
          <span className="text-[9px] uppercase tracking-wider text-muted/40 font-semibold">
            Goals & cards
          </span>
        </div>
        <TeamEventColumn
          side="away"
          code={awayCode}
          goals={goals}
          cards={cards}
          cardCounts={awayCards}
          align="right"
        />
      </div>
    </div>
  );
}

export { TeamCardBadges };
