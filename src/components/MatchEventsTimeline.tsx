"use client";

import type { Match, MatchEvent } from "@/lib/scores/types";
import {
  getDisplayEvents,
  hasCardEvents,
  TWO_YELLOWS_NOTE,
} from "@/lib/scores/card-events";
import { formatSubstitutionMinute } from "@/lib/timezone";

function eventIcon(type: MatchEvent["type"], detail?: string): string {
  switch (type) {
    case "goal":
      return "⚽";
    case "penalty":
      return "⚽ (P)";
    case "penalty_missed":
      return "❌";
    case "red":
      return detail === "Second yellow" ? "🟥" : "🟥";
    case "yellow":
      return "🟨";
    case "subst":
      return "↔";
    default:
      return "•";
  }
}

function formatEventMinute(e: MatchEvent): string {
  if (e.extraMinute && e.extraMinute > 0) return `${e.minute}+${e.extraMinute}'`;
  return `${e.minute}'`;
}

type MatchEventsTimelineProps = {
  match: Match;
  expanded?: boolean;
  limit?: number;
};

export default function MatchEventsTimeline({
  match,
  expanded = false,
  limit = 4,
}: MatchEventsTimelineProps) {
  const rawEvents = match.events ?? [];
  const events = getDisplayEvents(rawEvents);
  const subs = [...(match.homeSubs ?? []), ...(match.awaySubs ?? [])];
  const showCardNote = hasCardEvents(rawEvents);

  if (events.length === 0 && subs.length === 0) {
    if (match.status === "live" || match.status === "halftime") {
      return (
        <p className="text-center text-xs text-muted">Waiting for match events…</p>
      );
    }
    if (match.status === "finished") {
      return (
        <p className="text-center text-xs text-muted py-2">
          Goal scorers shown in scoreline — full event log updating.
        </p>
      );
    }
    return null;
  }

  const shown = expanded ? events : events.slice(-limit);

  return (
    <div className={`space-y-2 ${expanded ? "" : "mt-2"}`}>
      {expanded && (match.homeSubs?.length || match.awaySubs?.length) ? (
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {match.homeSubs && match.homeSubs.length > 0 && (
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[10px] uppercase tracking-wider text-pitch mb-2">
                {match.home.name} subs
              </p>
              <ul className="space-y-1 text-xs text-muted">
                {match.homeSubs.map((s, i) => (
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
          {match.awaySubs && match.awaySubs.length > 0 && (
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[10px] uppercase tracking-wider text-pitch mb-2">
                {match.away.name} subs
              </p>
              <ul className="space-y-1 text-xs text-muted">
                {match.awaySubs.map((s, i) => (
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
      ) : null}

      <ul className={`flex flex-wrap gap-2 ${expanded ? "justify-center" : ""}`}>
        {shown
          .filter((e) => e.type !== "subst" || !expanded)
          .map((e, i) => (
            <li
              key={`${e.minute}-${e.type}-${e.player}-${i}`}
              className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-muted"
            >
              <span className="text-gold font-semibold">{formatEventMinute(e)}</span>{" "}
              {eventIcon(e.type, e.detail)}{" "}
              <span className="text-white/90">{e.player}</span>
              {e.detail === "Second yellow" && (
                <span className="text-muted/60 text-[10px]"> (2nd yellow)</span>
              )}
              {e.type === "subst" && e.playerSecondary ? (
                <span className="text-muted/70">
                  {" "}
                  Sub: {e.playerSecondary} → {e.player}
                </span>
              ) : null}
              {e.playerSecondary && (e.type === "goal" || e.type === "penalty") && (
                <span className="text-muted/70"> · assist {e.playerSecondary}</span>
              )}
            </li>
          ))}
      </ul>

      {showCardNote && (
        <p className={`text-[10px] text-muted/50 ${expanded ? "text-center" : ""}`}>
          {TWO_YELLOWS_NOTE}
        </p>
      )}
    </div>
  );
}
