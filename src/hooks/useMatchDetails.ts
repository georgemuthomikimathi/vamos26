"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/scores/types";
import { attachLineupsToMatch } from "@/lib/scores/lineups";

function needsApiRefresh(match: Match): boolean {
  if (!match.id.startsWith("af-")) return false;
  if (
    match.status !== "live" &&
    match.status !== "halftime" &&
    match.status !== "finished"
  ) {
    return false;
  }
  const hasEvents = Boolean(match.events?.length);
  const hasBothLineups = Boolean(match.homeLineup && match.awayLineup);
  const hasSubs = Boolean(match.homeSubs?.length || match.awaySubs?.length);
  return !hasEvents || !hasBothLineups || !hasSubs;
}

export function useMatchDetails(match: Match, enabled: boolean): Match {
  const [enriched, setEnriched] = useState(() => attachLineupsToMatch(match));

  useEffect(() => {
    setEnriched(attachLineupsToMatch(match));
  }, [match]);

  useEffect(() => {
    if (!enabled) return;

    const withSquads = attachLineupsToMatch(match);
    if (!needsApiRefresh(match)) {
      setEnriched(withSquads);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch(
          `/api/match-details?id=${encodeURIComponent(match.id)}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          setEnriched(withSquads);
          return;
        }
        const data = (await res.json()) as {
          details?: Partial<
            Pick<Match, "events" | "homeLineup" | "awayLineup" | "homeSubs" | "awaySubs">
          >;
        };
        if (cancelled) return;
        const merged = attachLineupsToMatch({
          ...match,
          events: data.details?.events ?? match.events,
          homeLineup: data.details?.homeLineup ?? match.homeLineup,
          awayLineup: data.details?.awayLineup ?? match.awayLineup,
          homeSubs: data.details?.homeSubs ?? match.homeSubs,
          awaySubs: data.details?.awaySubs ?? match.awaySubs,
        });
        setEnriched(merged);
      } catch {
        if (!cancelled) setEnriched(withSquads);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [match, enabled]);

  return enriched;
}
