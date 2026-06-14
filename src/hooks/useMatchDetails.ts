"use client";

import { useCallback, useEffect, useState } from "react";
import type { Match } from "@/lib/scores/types";
import { attachLineupsToMatch } from "@/lib/scores/lineups";
import { enrichMatchFromMeta } from "@/lib/scores/enrich-from-meta";
import { POLL_LIVE_MS } from "@/lib/realtime/polling";

function shouldFetchDetails(match: Match): boolean {
  if (!match.id.startsWith("af-")) return false;
  return (
    match.status === "live" ||
    match.status === "halftime" ||
    match.status === "finished"
  );
}

function mergeDetails(
  match: Match,
  details?: Partial<
    Pick<Match, "events" | "homeLineup" | "awayLineup" | "homeSubs" | "awaySubs">
  >
): Match {
  return enrichMatchFromMeta(
    attachLineupsToMatch({
      ...match,
      events: details?.events !== undefined ? details.events : match.events,
      homeLineup: details?.homeLineup ?? match.homeLineup,
      awayLineup: details?.awayLineup ?? match.awayLineup,
      homeSubs: details?.homeSubs !== undefined ? details.homeSubs : match.homeSubs,
      awaySubs: details?.awaySubs !== undefined ? details.awaySubs : match.awaySubs,
    })
  );
}

export function useMatchDetails(match: Match, enabled: boolean): Match {
  const [enriched, setEnriched] = useState(() =>
    enrichMatchFromMeta(attachLineupsToMatch(match))
  );

  const fetchDetails = useCallback(async () => {
    if (!shouldFetchDetails(match)) {
      setEnriched(enrichMatchFromMeta(attachLineupsToMatch(match)));
      return;
    }

    try {
      const res = await fetch(
        `/api/match-details?id=${encodeURIComponent(match.id)}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        setEnriched(enrichMatchFromMeta(attachLineupsToMatch(match)));
        return;
      }
      const data = (await res.json()) as {
        details?: Partial<
          Pick<Match, "events" | "homeLineup" | "awayLineup" | "homeSubs" | "awaySubs">
        >;
      };
      setEnriched(mergeDetails(match, data.details));
    } catch {
      setEnriched(enrichMatchFromMeta(attachLineupsToMatch(match)));
    }
  }, [match]);

  useEffect(() => {
    setEnriched(enrichMatchFromMeta(attachLineupsToMatch(match)));
  }, [match]);

  useEffect(() => {
    if (!enabled) return;
    void fetchDetails();
  }, [enabled, fetchDetails]);

  useEffect(() => {
    if (!enabled) return;
    const isLive = match.status === "live" || match.status === "halftime";
    if (!isLive || !match.id.startsWith("af-")) return;

    const interval = setInterval(() => void fetchDetails(), POLL_LIVE_MS);
    return () => clearInterval(interval);
  }, [enabled, fetchDetails, match.status, match.id]);

  return enriched;
}
