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
  if (counts.yellow === 0 && counts.red === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[9px] text-muted/80 tabular-nums">
      {counts.yellow > 0 && (
        <span>
          🟨{counts.yellow}
        </span>
      )}
      {counts.red > 0 && (
        <span>
          🟥{counts.red}
        </span>
      )}
    </span>
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

  if (goals.length === 0 && cards.length === 0) {
    return (
      <p className={`text-[10px] text-muted/60 text-center ${className}`}>
        No goal or card events recorded
      </p>
    );
  }

  const chipClass =
    "text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-1 text-muted";

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2 px-1">
        <TeamCardBadges counts={homeCards} />
        <span className="text-[9px] uppercase tracking-wider text-muted/50">
          Cards
        </span>
        <TeamCardBadges counts={awayCards} />
      </div>

      {goals.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {goals.map((g, i) => (
            <span key={`g-${g.minute}-${g.player}-${i}`} className={chipClass}>
              <span className="text-gold font-semibold">
                {formatMinute(g.minute, g.extraMinute)}
              </span>{" "}
              {eventIcon(g)} {g.player}
              {g.playerSecondary && (
                <span className="text-muted/60"> ({g.playerSecondary})</span>
              )}
              <span className="text-muted/50 ml-1">
                (
                {g.team === "home"
                  ? match.home.code.toUpperCase()
                  : match.away.code.toUpperCase()}
                )
              </span>
            </span>
          ))}
        </div>
      )}

      {cards.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {cards.map((c, i) => (
            <span key={`c-${c.minute}-${c.player}-${c.type}-${i}`} className={chipClass}>
              <span className="text-gold font-semibold">
                {formatMinute(c.minute, c.extraMinute)}
              </span>{" "}
              {eventIcon(c)} {c.player}
              {c.detail === "Second yellow" && (
                <span className="text-muted/50"> (2nd yellow)</span>
              )}
              <span className="text-muted/50 ml-1">
                (
                {c.team === "home"
                  ? match.home.code.toUpperCase()
                  : match.away.code.toUpperCase()}
                )
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export { TeamCardBadges };
