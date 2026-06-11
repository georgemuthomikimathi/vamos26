"use client";

import type { Match, MatchEvent } from "@/lib/scores/types";

function eventIcon(type: MatchEvent["type"]): string {
  switch (type) {
    case "goal":
      return "⚽";
    case "penalty":
      return "⚽ (P)";
    case "penalty_missed":
      return "❌";
    case "red":
      return "🟥";
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
  const events = match.events ?? [];
  const subs = [...(match.homeSubs ?? []), ...(match.awaySubs ?? [])];

  if (events.length === 0 && subs.length === 0) {
    if (match.status === "live" || match.status === "halftime") {
      return (
        <p className="text-center text-xs text-muted">Waiting for match events…</p>
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
                    <span className="text-gold font-semibold">{s.minute}&apos;</span>{" "}
                    <span className="text-pitch">{s.playerIn}</span>
                    <span className="text-muted/60"> for </span>
                    {s.playerOut}
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
                    <span className="text-gold font-semibold">{s.minute}&apos;</span>{" "}
                    <span className="text-pitch">{s.playerIn}</span>
                    <span className="text-muted/60"> for </span>
                    {s.playerOut}
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
              {eventIcon(e.type)}{" "}
              <span className="text-white/90">{e.player}</span>
              {e.playerSecondary && e.type === "goal" && (
                <span className="text-muted/70"> ({e.playerSecondary})</span>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
